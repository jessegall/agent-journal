package drivers

import (
	"context"
	"errors"
	"sync"
	"time"

	"journal-agent/drivers/contracts"
	"journal-agent/keyscripts"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// TerminalDriverType is the driver type the journal names for a runtime kept open in one interactive terminal.
const TerminalDriverType = "terminal"

// interruptKey stops the running turn in both pinned programs (recorded in the terminal-interrupt fixtures).
const interruptKey = "\x1b"

// stopKeys end the program from its composer: the interrupt, then the end of input both programs exit on.
const stopKeys = "\x1b\x04"

// readyDeadline is how long a delivery waits for an empty, still composer before it stays staged for later.
const readyDeadline = 10 * time.Second

// echoDeadline is how long a typed line waits to be drawn in the composer before its delivery is uncertain.
const echoDeadline = 5 * time.Second

// pollInterval is how often the driver reads the screen again while it waits.
const pollInterval = 50 * time.Millisecond

// TerminalRuntime is what the terminal driver drives: the screen read from the program, the gate every key passes,
// the program build's registered key scripts and the clock its waits run on.
type TerminalRuntime struct {
	Profile    string
	Classifier *screen.Classifier
	Gate       *terminal.InputGate
	Composer   string
	Generation func(region string) uint64
	Scripts    *keyscripts.Registry
	Runner     *keyscripts.Runner
	Clock      keyscripts.Clock
}

// TerminalDriver carries out the six operations on one persistent program in one process generation: every delivered
// prompt is a new turn of the same program, typed into an empty composer, never into an active turn.
type TerminalDriver struct {
	runtime     TerminalRuntime
	mutex       sync.Mutex
	turns       int
	interrupted bool
}

var _ contracts.AgentDriver = (*TerminalDriver)(nil)

var _ contracts.KeyScriptRunner = (*TerminalDriver)(nil)

func NewTerminalDriver(runtime TerminalRuntime) *TerminalDriver {
	return &TerminalDriver{runtime: runtime}
}

// Turns is how many prompts the driver submitted in this generation.
func (driver *TerminalDriver) Turns() int {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	return driver.turns
}

func (driver *TerminalDriver) Deliver(
	_ context.Context,
	delivery contracts.Delivery,
) (contracts.OperationResult, error) {
	return driver.prompt(delivery.Request, delivery.Message)
}

// Wake types the standard pending-work prompt, unless an interrupt holds the runtime: a held runtime does no work.
func (driver *TerminalDriver) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.prompt(wake.Request, pendingWorkPrompt)
}

// ChangeModel stays staged: the recorded model picker reaches the wanted entry, but no recording shows a confirmed
// choice and its evidence, so nothing is applied live (task 1048).
func (driver *TerminalDriver) ChangeModel(
	_ context.Context,
	change contracts.ModelChange,
) (contracts.OperationResult, error) {
	return staged(change.Request), nil
}

// ChangeEffort stays staged for the same reason: no recorded live path reaches evidence of the new effort.
func (driver *TerminalDriver) ChangeEffort(
	_ context.Context,
	change contracts.EffortChange,
) (contracts.OperationResult, error) {
	return staged(change.Request), nil
}

// Interrupt stops the running turn and holds the runtime until a person or a new delivery releases it.
func (driver *TerminalDriver) Interrupt(
	_ context.Context,
	interrupt contracts.InterruptRequest,
) (contracts.OperationResult, error) {
	if err := driver.runtime.Gate.Keys(interruptKey); err != nil {
		return failed(interrupt.Request), err
	}

	driver.mutex.Lock()
	driver.interrupted = true
	driver.mutex.Unlock()

	return contracts.OperationResult{
		Request:  interrupt.Request,
		Progress: contracts.ProgressApplying,
		Hold:     contracts.HoldInterrupted,
	}, nil
}

func (driver *TerminalDriver) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	if err := driver.runtime.Gate.Keys(stopKeys); err != nil {
		return failed(stop.Request), err
	}

	return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplying}, nil
}

// RunKeyScript runs a registered maintenance script of the program build through the gate.
func (driver *TerminalDriver) RunKeyScript(
	_ context.Context,
	request contracts.KeyScriptRequest,
) (contracts.OperationResult, error) {
	script, err := driver.runtime.Scripts.Find(driver.runtime.Profile, request.Script)
	if err != nil {
		return failed(request.Request), err
	}

	result, err := driver.runtime.Runner.Run(script, request.Parameters)
	if err != nil || result.Outcome != keyscripts.Finished {
		return contracts.OperationResult{
			Request:  request.Request,
			Progress: contracts.ProgressFailed,
			Hold:     contracts.HoldNeedsAttention,
		}, err
	}

	return contracts.OperationResult{Request: request.Request, Progress: contracts.ProgressApplying}, nil
}

// prompt types a prompt into an empty, still composer, waits for its echo and submits it once. An interrupted
// runtime or a composer that is not ready keeps the request staged; a lost echo makes it uncertain.
func (driver *TerminalDriver) prompt(
	request contracts.RequestIdentity,
	text string,
) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	interrupted := driver.interrupted
	driver.mutex.Unlock()

	if interrupted {
		return contracts.OperationResult{
			Request:  request,
			Progress: contracts.ProgressStaged,
			Hold:     contracts.HoldInterrupted,
		}, nil
	}
	if !driver.waitUntil(readyDeadline, driver.promptReady) {
		return staged(request), nil
	}

	generation := driver.runtime.Generation(driver.runtime.Composer)
	line, err := driver.runtime.Gate.Type(request.RequestID, request.Attempt, text, generation)
	if errors.Is(err, terminal.ErrComposerHeld) {
		return staged(request), nil
	}
	if err != nil {
		return failed(request), err
	}

	driver.waitUntil(echoDeadline, func() bool { return driver.runtime.Gate.Echoes(text) })
	delivery, err := driver.runtime.Gate.Submit(line, 0)
	if err != nil || delivery != terminal.Delivered {
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressDeliveryUncertain}, err
	}

	driver.mutex.Lock()
	driver.turns++
	driver.mutex.Unlock()

	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying}, nil
}

func (driver *TerminalDriver) promptReady() bool {
	reading := driver.runtime.Classifier.Classify(driver.runtime.Clock.Now())

	return reading.Kind == screen.PromptReady && reading.Stable
}

// waitUntil reads the condition on the runtime's clock until it holds or the deadline passes.
func (driver *TerminalDriver) waitUntil(deadline time.Duration, condition func() bool) bool {
	until := driver.runtime.Clock.Now().Add(deadline)

	for !condition() {
		if !driver.runtime.Clock.Now().Before(until) {
			return false
		}
		driver.runtime.Clock.Sleep(pollInterval)
	}

	return true
}

func failed(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed}
}
