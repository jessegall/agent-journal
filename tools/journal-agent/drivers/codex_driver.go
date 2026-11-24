package drivers

import (
	"context"

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

// NativeIdentity is the thread the app-server acknowledged, empty until the bootstrap or the first turn made it.
func (driver *CodexDriver) NativeIdentity() string {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	return driver.threadID
}

func (driver *CodexDriver) Deliver(ctx context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	return driver.startTurn(ctx, delivery.Request, contracts.PromptOf(delivery.Parts))
}

func (driver *CodexDriver) Wake(ctx context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.startTurn(ctx, wake.Request, wake.Prompt)
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

// Bootstrap starts the thread once and binds it, or answers the thread already bound; it starts no turn and sends no
// text. A failed thread start binds nothing and is never retried here with another thread.
func (driver *CodexDriver) Bootstrap(ctx context.Context, request contracts.RequestIdentity) (contracts.OperationResult,
	error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	if driver.threadID == "" {
		threadID, err := driver.owner.StartThread(ctx, driver.settings)
		if err != nil {
			return contracts.OperationResult{}, err
		}
		driver.threadID = threadID
	}
	return contracts.OperationResult{
		Request: request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed,
		ActualBinding: driver.threadID,
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
	driver.finished = make(chan contracts.TurnEnd, 1)
	go driver.awaitEnd(driver.owner.TurnEnds(driver.threadID), turnID, driver.finished)
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying, Hold: contracts.HoldNone},
		nil
}

// awaitEnd ends the turn with its own completion, whatever the owner does next.
func (driver *CodexDriver) awaitEnd(ends <-chan host.CodexTurnEnd, turnID string, finished chan<- contracts.TurnEnd) {
	outcome := turnEndOf(ends, turnID)
	driver.mutex.Lock()
	driver.turnID = ""
	driver.mutex.Unlock()
	finished <- outcome
}

// turnEndOf waits for the turn's own end and tells the status the owner ended it with, or that the owner exited or no
// longer knows the thread.
func turnEndOf(ends <-chan host.CodexTurnEnd, turnID string) contracts.TurnEnd {
	if ends == nil {
		return contracts.TurnEnd{Problem: "the owner no longer knows the thread"}
	}
	for end := range ends {
		if end.Status == "ownerExited" || end.TurnID == turnID {
			return contracts.TurnEnd{CodexStatus: end.Status}
		}
	}
	return contracts.TurnEnd{Problem: "the owner closed the thread"}
}
