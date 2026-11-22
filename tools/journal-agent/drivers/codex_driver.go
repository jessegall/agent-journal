package drivers

import (
	"context"
	"errors"
	"fmt"

	"journal-agent/drivers/contracts"
	"journal-agent/host"
)

// CodexThreads is what a thread driver needs of the account's shared app-server: a thread of its own, its turns,
// and the end of each.
type CodexThreads interface {
	StartThread(ctx context.Context, settings host.CodexThreadSettings) (string, error)
	StartTurn(ctx context.Context, threadID, text, effort string, writableRoots []string) (string, error)
	Interrupt(ctx context.Context, threadID, turnID string) error
	TurnEnds(threadID string) <-chan host.CodexTurnEnd
}

// ErrTurnInterrupted is the end of a turn the user or the journal interrupted.
var ErrTurnInterrupted = errors.New("the turn was interrupted")

// CodexDriver runs one runtime as one thread on its account's shared app-server: each turn is a turn/start on the
// thread the app-server acknowledged, and its end is that turn's own completion, whatever the owner does next.
type CodexDriver struct {
	owner      CodexThreads
	settings   host.CodexThreadSettings
	generation int
	turnState
	threadID string
	turnID   string
	turns    int
}

// NewCodexDriver returns the driver of one thread on the owner, under the runtime's process generation.
func NewCodexDriver(owner CodexThreads, settings host.CodexThreadSettings, generation int) *CodexDriver {
	return &CodexDriver{owner: owner, settings: settings, generation: generation}
}

func (driver *CodexDriver) Generation() int { return driver.generation }

func (driver *CodexDriver) Deliver(ctx context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	return driver.startTurn(ctx, delivery.Request, delivery.Message)
}

func (driver *CodexDriver) Wake(ctx context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.startTurn(ctx, wake.Request, wake.PromptOr(pendingWorkPrompt))
}

// ChangeModel is staged for the next thread start; a thread keeps the model it started with.
func (driver *CodexDriver) ChangeModel(_ context.Context, change contracts.ModelChange) (contracts.OperationResult,
	error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	driver.settings.Model = change.Model
	return staged(change.Request), nil
}

// Interrupt stops the running turn of this thread only; with no turn running the answer is AlreadyIdle.
func (driver *CodexDriver) Interrupt(ctx context.Context, interrupt contracts.InterruptRequest) (
	contracts.OperationResult, error) {
	driver.mutex.Lock()
	threadID, turnID, running := driver.threadID, driver.turnID, driver.turnID != "" && interrupt.Turn == driver.turns
	driver.mutex.Unlock()
	if !running {
		return alreadyIdle(interrupt.Request), nil
	}
	if err := driver.owner.Interrupt(ctx, threadID, turnID); err != nil {
		return contracts.OperationResult{}, err
	}
	return contracts.OperationResult{
		Request: interrupt.Request, Progress: contracts.ProgressApplying, Hold: contracts.HoldInterrupted,
	}, nil
}

// Stop interrupts the thread's running turn; the owner and its other threads go on.
func (driver *CodexDriver) Stop(ctx context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	threadID, turnID := driver.threadID, driver.turnID
	driver.mutex.Unlock()
	if turnID != "" {
		if err := driver.owner.Interrupt(ctx, threadID, turnID); err != nil {
			return stopResult(stop.Request, host.StopUnconfirmed), nil
		}
	}
	return contracts.OperationResult{
		Request: stop.Request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed,
		Hold: contracts.HoldNone,
	}, nil
}

// RunKeyScript is refused: a thread on the shared app-server has no terminal to type a script into.
func (driver *CodexDriver) RunKeyScript(
	_ context.Context,
	request contracts.KeyScriptRequest,
) (contracts.OperationResult, error) {
	return contracts.OperationResult{
		Request: request.Request, Progress: contracts.ProgressUnavailable, Outcome: contracts.OutcomeTerminalRequired,
	}, nil
}

func (driver *CodexDriver) startTurn(
	ctx context.Context,
	request contracts.RequestIdentity,
	text string,
) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	if driver.turnID != "" {
		return contracts.OperationResult{}, ErrTurnRunning
	}
	if driver.threadID == "" {
		threadID, err := driver.owner.StartThread(ctx, driver.settings)
		if err != nil {
			return contracts.OperationResult{}, err
		}
		driver.threadID = threadID
	}
	turnID, err := driver.owner.StartTurn(ctx, driver.threadID, text, driver.effort, driver.settings.WritableRoots)
	if err != nil {
		return contracts.OperationResult{}, err
	}
	driver.turns++
	driver.turnID = turnID
	driver.finished = make(chan error, 1)
	go driver.awaitEnd(driver.owner.TurnEnds(driver.threadID), turnID, driver.finished)
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying, Hold: contracts.HoldNone},
		nil
}

// awaitEnd ends the turn with its own completion, whatever the owner does next.
func (driver *CodexDriver) awaitEnd(ends <-chan host.CodexTurnEnd, turnID string, finished chan<- error) {
	outcome := turnOutcome(ends, turnID)
	driver.mutex.Lock()
	driver.turnID = ""
	driver.mutex.Unlock()
	finished <- outcome
}

// turnOutcome waits for the turn's own end: completed is a success, interrupted and failed are not, and an owner that
// exited, or a thread the owner no longer knows, ends the turn as failed.
func turnOutcome(ends <-chan host.CodexTurnEnd, turnID string) error {
	if ends == nil {
		return fmt.Errorf("%w: the owner no longer knows the thread", ErrProviderTurnFailed)
	}
	for end := range ends {
		if end.Status != "ownerExited" && end.TurnID != turnID {
			continue
		}
		switch end.Status {
		case "completed":
			return nil
		case "interrupted":
			return ErrTurnInterrupted
		default:
			return fmt.Errorf("%w: %s", ErrProviderTurnFailed, end.Status)
		}
	}
	return fmt.Errorf("%w: the owner closed the thread", ErrProviderTurnFailed)
}
