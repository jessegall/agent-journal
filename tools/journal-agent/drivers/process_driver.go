// Package drivers holds the agent drivers: the process driver runs one child per turn, the terminal driver keeps one
// interactive program open.
package drivers

import (
	"context"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
	"syscall"

	"journal-agent/drivers/contracts"
	"journal-agent/host"
	profilecontracts "journal-agent/profiles/contracts"
)

// BypassLogName is the file in a runtime's settings folder where the hook relay writes the calls it answered alone
// while the journal could not be reached, to send them once it answers again.
const BypassLogName = "bypasses.jsonl"

// ProcessDriverType is the driver type the journal names for a runtime run one child per turn.
const ProcessDriverType = "process"

// ErrConversationUnknown is returned when a resume has no exact conversation reference; the latest is never taken.
var ErrConversationUnknown = errors.New("the runtime has no exact conversation reference")

// ErrTurnRunning is returned when a turn is asked for while the previous child still runs.
var ErrTurnRunning = errors.New("a turn is still running")

// ProcessRuntime is what the process driver needs to know about its runtime.
type ProcessRuntime struct {
	JournalURL     string
	Credential     string
	ProfilePin     []string
	ConversationID string
	SettingsFolder string
	WorkingFolder  string
	HookCommand    string
	Profile        profilecontracts.ProgramProfile
}

// ProcessDriver runs one child of the program per turn, each with a new process generation. Settings asked for between
// turns are staged and passed to the next child; they count as applied only when that child's evidence shows them.
type ProcessDriver struct {
	runtime    ProcessRuntime
	mutex      sync.Mutex
	generation int
	turns      int
	model      string
	effort     string
	child      *exec.Cmd
	childGroup host.OwnedGroup
	finished   chan error
}

// NewProcessDriver returns a driver for one runtime, starting at the generation the journal last recorded.
func NewProcessDriver(runtime ProcessRuntime, generation int) *ProcessDriver {
	return &ProcessDriver{runtime: runtime, generation: generation}
}

// Generation is the process generation of the latest child.
func (driver *ProcessDriver) Generation() int {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	return driver.generation
}

// Finished delivers the exit of the current child: nil for a normal end, which leaves the runtime eligible for the
// next turn; an error fails that turn and the host holds the runtime instead of running it again.
func (driver *ProcessDriver) Finished() <-chan error {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	return driver.finished
}

func (driver *ProcessDriver) Deliver(_ context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	return driver.startTurn(delivery.Request, delivery.Message)
}

// Wake starts one standard turn that checks the agent's pending work.
func (driver *ProcessDriver) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.startTurn(wake.Request, pendingWorkPrompt)
}

func (driver *ProcessDriver) ChangeModel(_ context.Context, change contracts.ModelChange) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	driver.model = change.Model
	return staged(change.Request), nil
}

func (driver *ProcessDriver) ChangeEffort(_ context.Context, change contracts.EffortChange) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	driver.effort = change.Effort
	return staged(change.Request), nil
}

// Interrupt signals the process group of the child running the turn the interrupt is bound to; when that turn has
// ended, nothing is signalled, the answer is AlreadyIdle and the runtime stays held.
func (driver *ProcessDriver) Interrupt(_ context.Context, interrupt contracts.InterruptRequest) (contracts.OperationResult, error) {
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
func (driver *ProcessDriver) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
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

func (driver *ProcessDriver) startTurn(request contracts.RequestIdentity, prompt string) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	if driver.child != nil {
		return contracts.OperationResult{}, ErrTurnRunning
	}
	if driver.runtime.ConversationID == "" {
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed, Hold: contracts.HoldNeedsAttention}, ErrConversationUnknown
	}

	launch := profilecontracts.Launch{
		Mode:           profilecontracts.ProcessMode,
		SettingsFolder: driver.runtime.SettingsFolder,
		SessionID:      driver.runtime.ConversationID,
		Resume:         driver.turns > 0,
		Prompt:         prompt,
		HookCommand:    driver.runtime.HookCommand,
		Model:          driver.model,
		Effort:         driver.effort,
		WorkFolder:     driver.runtime.WorkingFolder,
	}
	command, err := driver.command(launch)
	if err != nil {
		return contracts.OperationResult{}, err
	}

	driver.generation++
	command.Env = append(command.Env,
		"JOURNAL_URL="+driver.runtime.JournalURL,
		"JOURNAL_LAUNCH_TOKEN="+driver.runtime.Credential,
		"JOURNAL_PROCESS_GENERATION="+strconv.Itoa(driver.generation),
		"JOURNAL_BYPASS_LOG="+filepath.Join(driver.runtime.SettingsFolder, BypassLogName),
	)
	command.Env = append(command.Env, driver.runtime.ProfilePin...)
	if err := command.Start(); err != nil {
		driver.generation--
		return contracts.OperationResult{}, err
	}

	driver.turns++
	driver.child = command
	driver.childGroup = host.OwnedGroupOf(command.Process.Pid)
	driver.finished = make(chan error, 1)
	go driver.wait(command, driver.finished)

	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying, Hold: contracts.HoldNone}, nil
}

func (driver *ProcessDriver) command(launch profilecontracts.Launch) (*exec.Cmd, error) {
	profile := driver.runtime.Profile
	files, err := profile.SettingsFiles(launch)
	if err != nil {
		return nil, err
	}
	if err := os.MkdirAll(launch.SettingsFolder, 0o700); err != nil {
		return nil, err
	}
	for _, file := range files {
		if file.LinkTo != "" {
			continue
		}
		if err := os.WriteFile(filepath.Join(launch.SettingsFolder, file.Name), file.Content, 0o600); err != nil {
			return nil, err
		}
	}
	arguments, err := profile.Arguments(launch)
	if err != nil {
		return nil, err
	}
	command := exec.Command(profile.Program(), arguments...)
	command.Dir = driver.runtime.WorkingFolder
	command.Env = profile.Environment(WithoutJournalVariables(os.Environ()), launch)
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	return command, nil
}

func (driver *ProcessDriver) wait(command *exec.Cmd, finished chan<- error) {
	err := command.Wait()
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

// WithoutJournalVariables keeps the host's own journal variables out of the child: only the launch credential the
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

// RegisterProcessDriver makes the process driver available to the factory; runtimeOf supplies what the grant alone
// does not say: the runtime's folders, its conversation and the generation the journal last recorded.
func RegisterProcessDriver(factory *host.RuntimeFactory, runtimeOf func(grant host.LaunchGrant) (ProcessRuntime, int, error)) {
	factory.Register(ProcessDriverType, func(grant host.LaunchGrant) (contracts.AgentDriver, error) {
		runtime, generation, err := runtimeOf(grant)
		if err != nil {
			return nil, err
		}
		runtime.Credential = grant.Credential
		runtime.ProfilePin = grant.ProfilePin
		return NewProcessDriver(runtime, generation), nil
	})
}

// RunKeyScript is refused: a runtime run one child per turn has no terminal to type a script into.
func (driver *ProcessDriver) RunKeyScript(
	_ context.Context,
	request contracts.KeyScriptRequest,
) (contracts.OperationResult, error) {
	return contracts.OperationResult{
		Request:  request.Request,
		Progress: contracts.ProgressUnavailable,
		Outcome:  contracts.OutcomeTerminalRequired,
	}, nil
}
