// Package drivers holds the agent drivers: the headless driver runs one child per turn, the terminal driver keeps one
// interactive program open.
package drivers

import (
	"context"
	"errors"
	"journal-agent/recording"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"syscall"

	"journal-agent/drivers/contracts"
	"journal-agent/host"
	profilecontracts "journal-agent/profiles/contracts"
)

// BypassLogName is the file in a runtime's settings folder where the hook relay writes the calls it answered alone
// while the journal could not be reached, to send them once it answers again.
const BypassLogName = "bypasses.jsonl"

// HeadlessVariant is the driver type the journal names for a runtime run one child per turn.
const HeadlessVariant = "headless"

// ErrConversationUnknown is returned when a resume has no exact conversation reference; the latest is never taken.
var ErrConversationUnknown = errors.New("the runtime has no exact conversation reference")

// ErrTurnRunning is returned when a turn is asked for while the previous child still runs.
var ErrTurnRunning = errors.New("a turn is still running")

// HeadlessRuntime is what the headless driver needs to know about its runtime.
type HeadlessRuntime struct {
	JournalURL     string
	Credential     string
	ProfilePin     []string
	ConversationID string
	// ResumesConversation is set when ConversationID names an earlier conversation the host verified, so even the
	// first turn resumes it.
	ResumesConversation bool
	SettingsFolder      string
	WorkingFolder       string
	HookCommand         string
	Profile             profilecontracts.DriverProfile
	// Environment is the prepared start's clean environment the child starts from; the host's own never reaches it.
	Environment []string
	// ReadFiles are the files the host opens for each turn's program to read, the first on descriptor 3.
	ReadFiles []string
	// Account is the saved account each child signs in with.
	Account *profilecontracts.AccountStart
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
}

// TurnContainer gives the command that runs one turn of the program, at the process generation given, as its session
// container's own process, with the start's settings, credential and environment inside the container.
type TurnContainer interface {
	TurnCommand(start profilecontracts.Start, generation int) (*exec.Cmd, error)
}

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
	child      *exec.Cmd
	childGroup host.OwnedGroup
	// signedIn is set once a Claude account start's sign-in was checked.
	signedIn bool
}

// NewHeadlessDriver returns a driver for one runtime, starting at the generation the journal last recorded.
func NewHeadlessDriver(runtime HeadlessRuntime, generation int) *HeadlessDriver {
	return &HeadlessDriver{runtime: runtime, generation: generation}
}

// Generation is the process generation of the latest child.
func (driver *HeadlessDriver) Generation() int {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	return driver.generation
}

func (driver *HeadlessDriver) Deliver(_ context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	return driver.startTurn(delivery.Request, delivery.Message)
}

// Wake starts one standard turn that checks the agent's pending work.
func (driver *HeadlessDriver) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.startTurn(wake.Request, pendingWorkPrompt)
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

	if driver.child == nil || interrupt.Turn != driver.turns {
		return alreadyIdle(interrupt.Request), nil
	}
	if err := driver.childGroup.Signal(syscall.SIGINT); err != nil {
		return contracts.OperationResult{}, err
	}

	return contracts.OperationResult{Request: interrupt.Request, Progress: contracts.ProgressApplying, Hold: contracts.HoldInterrupted}, nil
}

// Stop ends the current child's process group in bounded stages, gracefully and then by force, and answers applied
// only when the exit is proven; with no child running there is nothing to end.
func (driver *HeadlessDriver) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	group, running := driver.childGroup, driver.child != nil
	driver.mutex.Unlock()

	if !running {
		return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed, Hold: contracts.HoldNone}, nil
	}

	return stopResult(stop.Request, group.Stop(host.DefaultStopStages)), nil
}

// pendingWorkPrompt is the one prompt a wake sends: it asks the agent to look at its own scoped work.
const pendingWorkPrompt = "Check your pending journal work."

func (driver *HeadlessDriver) startTurn(request contracts.RequestIdentity, prompt string) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	if driver.child != nil {
		return contracts.OperationResult{}, ErrTurnRunning
	}
	if driver.runtime.ConversationID == "" {
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Hold: contracts.HoldNeedsAttention}, ErrConversationUnknown
	}

	start := profilecontracts.Start{
		Mode:           recording.ProcessMode,
		SettingsFolder: driver.runtime.SettingsFolder,
		SessionID:      driver.runtime.ConversationID,
		Resume:         driver.turns > 0 || driver.runtime.ResumesConversation,
		Prompt:         prompt,
		HookCommand:    driver.runtime.HookCommand,
		Model:          driver.model,
		Effort:         driver.effort,
		WorkFolder:     driver.runtime.WorkingFolder,
		Account:        driver.runtime.Account,
	}
	driver.generation++
	command, err := driver.turnCommand(start)
	if err != nil {
		driver.generation--
		return contracts.OperationResult{}, err
	}
	defer host.CloseFiles(command.ExtraFiles)

	if err := driver.checkSignIn(command); err != nil {
		driver.generation--
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Hold: contracts.HoldNeedsAttention}, err
	}
	result, err := driver.resultOf(command)
	if err != nil {
		driver.generation--
		return contracts.OperationResult{}, err
	}
	if err := command.Start(); err != nil {
		driver.generation--
		return contracts.OperationResult{}, err
	}

	driver.turns++
	driver.child = command
	driver.childGroup = host.OwnedGroupOf(command.Process.Pid)
	driver.finished = make(chan error, 1)
	go driver.wait(command, result, driver.finished)

	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying, Hold: contracts.HoldNone}, nil
}

// turnCommand is the command of the turn at the driver's current generation: in the session's container when the
// runtime has one, otherwise a child of the host with the journal's variables for its hook relay.
func (driver *HeadlessDriver) turnCommand(start profilecontracts.Start) (*exec.Cmd, error) {
	if driver.runtime.Container != nil {
		return driver.runtime.Container.TurnCommand(start, driver.generation)
	}

	command, err := driver.command(start)
	if err != nil {
		return nil, err
	}

	command.Env = append(command.Env,
		"JOURNAL_URL="+driver.runtime.JournalURL,
		"JOURNAL_START_TOKEN="+driver.runtime.Credential,
		"JOURNAL_PROCESS_GENERATION="+strconv.Itoa(driver.generation),
		"JOURNAL_BYPASS_LOG="+filepath.Join(driver.runtime.SettingsFolder, BypassLogName),
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
	command.Dir = driver.runtime.WorkingFolder
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
	if driver.claudeAccountStart() && runtime.GOOS == "darwin" {
		sandbox, err := host.WriteSessionSandbox(
			start.SettingsFolder,
			driver.runtime.Account.Folder,
			driver.runtime.WorkingFolder,
		)
		if err != nil {
			return nil, err
		}
		sandbox.Wrap(command)
	}
	return command, nil
}

// claudeAccountStart is whether the runtime runs Claude Code on a saved account, whose sign-in and turn results the
// driver checks itself.
func (driver *HeadlessDriver) claudeAccountStart() bool {
	return driver.runtime.Account != nil && driver.runtime.Profile.Driver() == "claude"
}

// checkSignIn refuses the first turn of a Claude account start whose account is not signed in to claude.ai in its
// own folder.
func (driver *HeadlessDriver) checkSignIn(command *exec.Cmd) error {
	if !driver.claudeAccountStart() || driver.signedIn {
		return nil
	}
	runtime := driver.runtime
	if err := CheckClaudeSignIn(context.Background(), command.Path, command.Env, runtime.ReadFiles, runtime.Account.Folder); err != nil {
		return err
	}
	driver.signedIn = true
	return nil
}

// resultOf reads a Claude account turn's result and usage from its output. A contained Claude turn's output is its
// container process's own stream-json, attached by the container start: it is read for usage only, so its turn ends
// with its exit as before. Other starts have nothing to read.
func (driver *HeadlessDriver) resultOf(command *exec.Cmd) (<-chan error, error) {
	if !driver.claudeAccountStart() && !driver.containedClaudeStart() {
		return nil, nil
	}
	output, err := command.StdoutPipe()
	if err != nil {
		return nil, err
	}
	result := make(chan error, 1)
	usage, process, decides := driver.usage(), driver.generation, driver.claudeAccountStart()
	go func() {
		answer := readClaudeResult(output, usage, process)
		if !decides {
			answer = nil
		}
		result <- answer
	}()
	return result, nil
}

// containedClaudeStart is whether the runtime runs Claude Code in its session's container, where the container
// process holds the account.
func (driver *HeadlessDriver) containedClaudeStart() bool {
	return driver.runtime.Container != nil && driver.runtime.Profile.Driver() == "claude"
}

// usage is the observer of the start's usage; a start nobody reads usage of has one that ignores it.
func (driver *HeadlessDriver) usage() UsageObserver {
	if driver.runtime.Usage == nil {
		return ignoredUsage{}
	}
	return driver.runtime.Usage
}

// wait ends the turn with the process exit, or with the turn's own failure when the process exited cleanly but its
// result was an error.
func (driver *HeadlessDriver) wait(command *exec.Cmd, result <-chan error, finished chan<- error) {
	var turnFailure error
	if result != nil {
		turnFailure = <-result
	}
	err := command.Wait()
	if err == nil {
		err = turnFailure
	}
	driver.mutex.Lock()
	driver.child = nil
	driver.mutex.Unlock()
	finished <- err
}

func alreadyIdle(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{
		Request:  request,
		Progress: contracts.ProgressApplied,
		Outcome:  contracts.OutcomeAlreadyIdle,
		Hold:     contracts.HoldInterrupted,
	}
}

// stopResult reports a stop: applied once the exit is proven, unconfirmed while it is not, and refused for a process
// that is not the child the host started.
func stopResult(request contracts.RequestIdentity, outcome host.StopOutcome) contracts.OperationResult {
	switch outcome {
	case host.StopProven:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed, Hold: contracts.HoldNone}
	case host.StopNotOwned:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeRefused, Hold: contracts.HoldNeedsAttention}
	default:
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeStopUnconfirmed, Hold: contracts.HoldNeedsAttention}
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

// RegisterHeadlessDriver makes the headless driver available to the factory; runtimeOf supplies what the grant alone
// does not say: the runtime's folders, its conversation and the generation the journal last recorded.
func RegisterHeadlessDriver(factory *host.RuntimeFactory, runtimeOf func(grant host.StartGrant) (HeadlessRuntime, int, error)) {
	factory.Register(HeadlessVariant, func(grant host.StartGrant) (contracts.AgentDriver, error) {
		runtime, generation, err := runtimeOf(grant)
		if err != nil {
			return nil, err
		}
		runtime.Credential = grant.Credential
		runtime.ProfilePin = grant.ProfilePin
		return NewHeadlessDriver(runtime, generation), nil
	})
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
