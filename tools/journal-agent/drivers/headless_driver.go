// Package drivers holds the agent drivers: the headless driver runs one child per turn, the terminal driver keeps one
// interactive program open.
package drivers

import (
	"context"
	"errors"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"syscall"

	"journal-agent/drivers/contracts"
	"journal-agent/host"
	profilecontracts "journal-agent/profiles/contracts"
)

// BypassLogName is the file in a runtime's settings folder where the hook relay writes the calls it answered alone
// while the journal could not be reached, to send them once it answers again.
const BypassLogName = "bypasses.jsonl"

// ErrConversationUnknown is returned when a resume has no exact conversation reference; the latest is never taken.
var ErrConversationUnknown = errors.New("the runtime has no exact conversation reference")

// ErrTurnRunning is returned when a turn is asked for while the previous child still runs.
var ErrTurnRunning = errors.New("a turn is still running")

// HeadlessRuntime is what the headless driver needs to know about its runtime.
type HeadlessRuntime struct {
	JournalURL string
	Credential string
	ProfilePin []string
	// Start is the base of every turn's start: the conversation, the settings and work folders, the hook command,
	// the account, and the model and effort the journal asked for.
	Start profilecontracts.BaseStart
	// ResumesConversation is set when the start's conversation is an earlier one the host verified, so even the
	// first turn resumes it.
	ResumesConversation bool
	Profile             profilecontracts.DriverProfile
	// Environment is the prepared start's clean environment the child starts from; the host's own never reaches it.
	Environment []string
	// ReadFiles are the files the host opens for each turn's program to read, the first on descriptor 3.
	ReadFiles []string
	// RelayVariables tell the hook relay the start's key and where its sealed output grants are.
	RelayVariables []string
	// Executable is the absolute path of the program in the protected installation; an account start runs nothing
	// else.
	Executable string
	// Container runs each turn's program as its session container's own process; nil runs it as a child of the host.
	Container TurnContainer
	// Confinement runs each turn's program confined to a connected child's own checkout, in place of the session
	// sandbox; nil runs it unconfined.
	Confinement TurnConfinement
	// Usage takes the limit windows and result costs a Claude account start's program reports; nil reads none.
	Usage UsageObserver
	// Limits are the waits the journal sent with the start; a stop gives the turn no longer than they say.
	Limits contracts.Limits
	// SignInMethods are the Claude sign-in methods the journal accepts for an account start, as the program names them.
	SignInMethods []string
	// ConfinesAccountStarts is whether the journal has an account start's turns run in their session sandbox; the
	// host applies its platform's mechanism, the macOS sandbox profile.
	ConfinesAccountStarts bool
}

// TurnContainer gives one turn of the program, at the process generation given, as its session container's own
// process, with the start's settings, credential and environment inside the container.
type TurnContainer interface {
	TurnProgram(start profilecontracts.Start, generation int) (TurnProgram, error)
}

// TurnProgram is the program of one turn as the driver runs it, a child of the host or its session container's own
// process: started once, read while it runs, and ended by its exit, an interrupt or a stop.
type TurnProgram interface {
	// Output is what the program prints, read from its start to its end; it is asked for before Start.
	Output() (io.Reader, error)
	Start() error
	// Wait answers once the program ended: nil for exit code 0.
	Wait() error
	// Interrupt asks the program to end its turn, as Ctrl+C does.
	Interrupt() error
	// Stop ends the program in bounded stages and says whether its exit is proven.
	Stop(stages host.StopStages) host.StopOutcome
}

// childTurn is a turn's program as a child of the host, the leader of its own process group.
type childTurn struct {
	command *exec.Cmd
	group   host.OwnedGroup
}

func (turn *childTurn) Output() (io.Reader, error) {
	return turn.command.StdoutPipe()
}

// Start starts the child and closes the host's own ends of the files it was handed, started or not.
func (turn *childTurn) Start() error {
	defer host.CloseFiles(turn.command.ExtraFiles)
	if err := turn.command.Start(); err != nil {
		return err
	}

	turn.group = host.OwnedGroupOf(turn.command.Process.Pid)

	return nil
}

func (turn *childTurn) Wait() error {
	return turn.command.Wait()
}

func (turn *childTurn) Interrupt() error {
	return turn.group.Signal(syscall.SIGINT)
}

func (turn *childTurn) Stop(stages host.StopStages) host.StopOutcome {
	return turn.group.Stop(stages)
}

// signInFailure is a turn that never started because its account's sign-in check failed.
type signInFailure struct{ cause error }

func (failure signInFailure) Error() string { return failure.cause.Error() }

func (failure signInFailure) Unwrap() error { return failure.cause }

// TurnConfinement makes one turn's command run its program confined.
type TurnConfinement interface {
	Wrap(command *exec.Cmd)
}

// HeadlessDriver runs one child of the program per turn, each with a new process generation. Settings asked for between
// turns are staged and passed to the next child; they count as applied only when that child's evidence shows them.
type HeadlessDriver struct {
	runtime HeadlessRuntime
	turnState
	generation int
	turns      int
	model      string
	// turn is the program of the turn that runs now; nil between turns.
	turn TurnProgram
	// signedIn is set once a Claude account start's sign-in was checked.
	signedIn bool
}

// NewHeadlessDriver returns a driver for one runtime, starting at the generation the journal last recorded.
func NewHeadlessDriver(runtime HeadlessRuntime, generation int) *HeadlessDriver {
	return &HeadlessDriver{runtime: runtime, generation: generation}
}

// Generation is the process generation of the latest child.
// NativeIdentity is the conversation every child of the runtime continues, which the start's bootstrap proves.
func (driver *HeadlessDriver) NativeIdentity() string {
	return driver.runtime.Start.SessionID
}

func (driver *HeadlessDriver) Generation() int {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	return driver.generation
}

func (driver *HeadlessDriver) Deliver(_ context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	return driver.startTurn(delivery.Request, contracts.PromptOf(delivery.Parts))
}

// Wake starts one standard turn that checks the agent's pending work.
func (driver *HeadlessDriver) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.startTurn(wake.Request, wake.Prompt)
}

func (driver *HeadlessDriver) ChangeModel(_ context.Context, change contracts.ModelChange) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	driver.model = change.Model
	return staged(change.Request), nil
}

// Interrupt signals the process group of the child running the turn the interrupt is bound to; when that turn has
// ended, nothing is signalled, the answer is AlreadyIdle and the runtime stays held.
func (driver *HeadlessDriver) Interrupt(_ context.Context, interrupt contracts.InterruptRequest) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	if driver.turn == nil || interrupt.Turn != driver.turns {
		return alreadyIdle(interrupt.Request), nil
	}
	if err := driver.turn.Interrupt(); err != nil {
		return contracts.OperationResult{}, err
	}

	return contracts.OperationResult{Request: interrupt.Request, Progress: contracts.ProgressApplying}, nil
}

// Stop ends the current child's process group in bounded stages, gracefully and then by force, and answers applied
// only when the exit is proven; with no child running there is nothing to end.
func (driver *HeadlessDriver) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	turn := driver.turn
	driver.mutex.Unlock()

	if turn == nil {
		return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed, Hold: contracts.HoldNone}, nil
	}

	return stopResult(stop.Request, turn.Stop(host.StopStagesOf(driver.runtime.Limits.StopGrace(), driver.runtime.Limits.StopForce()))), nil
}

func (driver *HeadlessDriver) startTurn(request contracts.RequestIdentity, prompt string) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	if driver.turn != nil {
		return contracts.OperationResult{}, ErrTurnRunning
	}
	if driver.runtime.Start.SessionID == "" {
		return contracts.OperationResult{}, contracts.RefuseStart(contracts.RefusalConversationUnknown, ErrConversationUnknown)
	}

	start := driver.stagedStart().Turn(prompt, driver.turns > 0 || driver.runtime.ResumesConversation)
	driver.generation++
	turn, err := driver.turnProgram(start)
	if err != nil {
		driver.generation--

		return turnRefusal(err)
	}
	result, err := driver.resultOf(turn)
	if err != nil {
		driver.generation--
		return contracts.OperationResult{}, err
	}
	if err := turn.Start(); err != nil {
		driver.generation--
		return contracts.OperationResult{}, err
	}

	driver.turns++
	driver.turn = turn
	driver.finished = make(chan contracts.TurnEnd, 1)
	go driver.wait(turn, result, driver.finished)

	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying, Hold: contracts.HoldNone}, nil
}

// turnRefusal answers a turn that never started: a failed sign-in check is refused as not signed in, a plain fact the
// journal chooses the runtime's hold from; any other failure is the caller's to read.
func turnRefusal(err error) (contracts.OperationResult, error) {
	var signIn signInFailure
	if !errors.As(err, &signIn) {
		return contracts.OperationResult{}, err
	}

	return contracts.OperationResult{}, contracts.RefuseStart(contracts.RefusalNotSignedIn, signIn.cause)
}

// turnProgram is the program of the turn at the driver's current generation: the session container's own process
// when the runtime has a container, otherwise a child of the host whose account sign-in was checked.
func (driver *HeadlessDriver) turnProgram(start profilecontracts.Start) (TurnProgram, error) {
	if driver.runtime.Container != nil {
		return driver.runtime.Container.TurnProgram(start, driver.generation)
	}

	command, err := driver.childCommand(start)
	if err != nil {
		return nil, err
	}

	if err := driver.checkSignIn(command); err != nil {
		host.CloseFiles(command.ExtraFiles)

		return nil, signInFailure{cause: err}
	}

	return &childTurn{command: command}, nil
}

// childCommand is the command of a turn run as a child of the host, with the journal's variables for its hook relay.
func (driver *HeadlessDriver) childCommand(start profilecontracts.Start) (*exec.Cmd, error) {
	command, err := driver.command(start)
	if err != nil {
		return nil, err
	}

	command.Env = append(command.Env,
		"JOURNAL_URL="+driver.runtime.JournalURL,
		"JOURNAL_START_TOKEN="+driver.runtime.Credential,
		"JOURNAL_PROCESS_GENERATION="+strconv.Itoa(driver.generation),
		"JOURNAL_BYPASS_LOG="+filepath.Join(driver.runtime.Start.SettingsFolder, BypassLogName),
	)
	command.Env = append(command.Env, driver.runtime.ProfilePin...)
	command.Env = append(command.Env, driver.runtime.RelayVariables...)

	return command, nil
}

func (driver *HeadlessDriver) command(start profilecontracts.Start) (*exec.Cmd, error) {
	profile := driver.runtime.Profile
	files, err := profile.SettingsFiles(start)
	if err != nil {
		return nil, err
	}
	if err := os.MkdirAll(start.SettingsFolder, 0o700); err != nil {
		return nil, err
	}
	for _, file := range files {
		if err := os.WriteFile(filepath.Join(start.SettingsFolder, file.Name), file.Content, 0o600); err != nil {
			return nil, err
		}
	}
	arguments, err := profile.Arguments(start)
	if err != nil {
		return nil, err
	}
	command := exec.Command(profile.Driver(), arguments...)
	if driver.runtime.Executable != "" {
		command.Path, command.Args[0] = driver.runtime.Executable, driver.runtime.Executable
	}
	command.Dir = driver.runtime.Start.WorkFolder
	command.Env = profile.Environment(WithoutJournalVariables(driver.runtime.Environment), start)
	readFiles, err := host.OpenReadFiles(driver.runtime.ReadFiles)
	if err != nil {
		return nil, err
	}
	command.ExtraFiles = readFiles
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if driver.runtime.Confinement != nil {
		driver.runtime.Confinement.Wrap(command)

		return command, nil
	}
	if driver.isClaudeAccountStart() && driver.runtime.ConfinesAccountStarts && runtime.GOOS == "darwin" {
		sandbox, err := host.WriteSessionSandbox(
			start.SettingsFolder,
			driver.runtime.Start.Account.Folder,
			driver.runtime.Start.WorkFolder,
		)
		if err != nil {
			return nil, err
		}
		sandbox.Wrap(command)
	}
	return command, nil
}

// stagedStart is the runtime's base start with the model and effort asked for since it opened, which the next turn
// runs on.
func (driver *HeadlessDriver) stagedStart() profilecontracts.BaseStart {
	base := driver.runtime.Start
	if driver.model != "" {
		base.Model = driver.model
	}
	if driver.effort != "" {
		base.Effort = driver.effort
	}

	return base
}

// isClaudeAccountStart is whether the runtime runs Claude Code on a saved account, whose sign-in and turn results the
// driver checks itself.
func (driver *HeadlessDriver) isClaudeAccountStart() bool {
	return driver.runtime.Start.Account != nil && driver.runtime.Profile.ReportsTurnResults()
}

// checkSignIn refuses the first turn of a Claude account start whose account is not signed in to claude.ai in its
// own folder.
func (driver *HeadlessDriver) checkSignIn(command *exec.Cmd) error {
	if !driver.isClaudeAccountStart() || driver.signedIn {
		return nil
	}
	runtime := driver.runtime
	if err := CheckClaudeSignIn(context.Background(), command.Path, command.Env, runtime.ReadFiles, runtime.Start.Account.Folder, runtime.SignInMethods); err != nil {
		return err
	}
	driver.signedIn = true
	return nil
}

// resultOf reads a Claude turn's result and usage from its output: an account start's own stream-json, or a contained
// start's container process stream-json, attached by the container start. Other starts have nothing to read.
func (driver *HeadlessDriver) resultOf(turn TurnProgram) (<-chan contracts.TurnEnd, error) {
	if !driver.isClaudeAccountStart() && !driver.isContainedClaudeStart() {
		return nil, nil
	}
	output, err := turn.Output()
	if err != nil {
		return nil, err
	}
	result := make(chan contracts.TurnEnd, 1)
	usage, process := driver.usage(), driver.generation
	go func() { result <- readClaudeResult(output, usage, process) }()
	return result, nil
}

// isContainedClaudeStart is whether the runtime runs Claude Code in its session's container, where the container
// process holds the account.
func (driver *HeadlessDriver) isContainedClaudeStart() bool {
	return driver.runtime.Container != nil && driver.runtime.Profile.ReportsTurnResults()
}

// usage is the observer of the start's usage; a start nobody reads usage of has one that ignores it.
func (driver *HeadlessDriver) usage() UsageObserver {
	if driver.runtime.Usage == nil {
		return ignoredUsage{}
	}
	return driver.runtime.Usage
}

// wait ends the turn with what its output's result said, when one is read, and the process's exit.
func (driver *HeadlessDriver) wait(turn TurnProgram, result <-chan contracts.TurnEnd, finished chan<- contracts.TurnEnd) {
	end := contracts.TurnEnd{}
	if result != nil {
		end = <-result
	}
	withExit(&end, turn.Wait())
	driver.mutex.Lock()
	if driver.turn == turn {
		driver.turn = nil
	}
	driver.mutex.Unlock()
	finished <- end
}

// withExit adds the process's exit code to the end, or the problem that kept the host from reading one.
func withExit(end *contracts.TurnEnd, waited error) {
	code := 0
	var exit *exec.ExitError
	switch {
	case waited == nil:
		end.ExitCode = &code
	case errors.As(waited, &exit):
		code = exit.ExitCode()
		end.ExitCode = &code
	default:
		end.Problem = strings.TrimSpace(strings.Join([]string{end.Problem, waited.Error()}, " "))
	}
}

func alreadyIdle(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{
		Request:  request,
		Progress: contracts.ProgressApplied,
		Outcome:  contracts.OutcomeAlreadyIdle,
	}
}

// stopResult reports a stop: applied once the exit is proven, unconfirmed while it is not, and refused for a process
// that is not the child the host started.
func stopResult(request contracts.RequestIdentity, outcome host.StopOutcome) contracts.OperationResult {
	switch outcome {
	case host.StopProven:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed}
	case host.StopNotOwned:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeRefused}
	default:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeStopUnconfirmed}
	}
}

func staged(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressStaged, Hold: contracts.HoldNone}
}

// WithoutJournalVariables keeps the host's own journal variables out of the child: only the start token the
// driver adds itself may reach it, never the host secret.
func WithoutJournalVariables(environment []string) []string {
	kept := make([]string, 0, len(environment))
	for _, entry := range environment {
		if len(entry) >= 8 && entry[:8] == "JOURNAL_" {
			continue
		}
		kept = append(kept, entry)
	}
	return kept
}

// RunKeyScript is refused: a runtime run one child per turn has no terminal to type a script into.
func (driver *HeadlessDriver) RunKeyScript(
	_ context.Context,
	request contracts.KeyScriptRequest,
) (contracts.OperationResult, error) {
	return contracts.OperationResult{
		Request:  request.Request,
		Progress: contracts.ProgressUnavailable,
		Outcome:  contracts.OutcomeTerminalRequired,
	}, nil
}
