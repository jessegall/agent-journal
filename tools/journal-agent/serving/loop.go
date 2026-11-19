// Package serving carries out the requests a host claims: it files them with the scheduler, opens each runtime's
// driver once from its launch grant, runs every admission on the driver and reports each result back to the journal
// (doc 40 revision 3, sections 10, 16, 17 and 21).
package serving

import (
	"context"
	"log"
	"strings"
	"sync"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/keyscripts"
)

// Journal is the part of the journal the loop reports to.
type Journal interface {
	LaunchGrant(ctx context.Context, runtimeID string) (client.Grant, error)
	ReportRequest(ctx context.Context, report client.RequestReport) error
	ReportActivity(ctx context.Context, report client.ActivityReport) error
	ReportExit(ctx context.Context, report client.LivenessReport) error
}

// Runtime is a running program's driver as the loop uses it: the six operations, the process generation its reports
// carry, and when the current turn ends.
type Runtime interface {
	contracts.AgentDriver
	Generation() int
	Finished() <-chan error
}

// Opener starts the driver of a runtime from its launch grant; it is the one place that chooses by driver type.
type Opener func(runtimeID string, grant client.Grant) (Runtime, error)

// Loop carries out claimed requests, one runtime at a time in its accepted order.
type Loop struct {
	journal   Journal
	open      Opener
	scheduler *host.Scheduler
	mutex     sync.Mutex
	runtimes  map[string]*liveRuntime
}

// liveRuntime is a runtime the host runs: its driver, the turns it started, the requests of the running turn and
// why it is held, if it is.
type liveRuntime struct {
	id      string
	driver  Runtime
	turns   int
	running []client.ClaimedRequest
	staged  []client.ClaimedRequest
	// interrupts are the interrupts sent to the running turn: done once it ends, however its program exits.
	interrupts []client.ClaimedRequest
	hold       contracts.Hold
}

// NewLoop returns a loop that reports to the journal and opens drivers with open.
func NewLoop(journal Journal, open Opener) *Loop {
	return &Loop{journal: journal, open: open, scheduler: host.NewScheduler(), runtimes: map[string]*liveRuntime{}}
}

// Take files the claimed requests and runs whatever each touched runtime may run now.
func (loop *Loop) Take(ctx context.Context, claimed []client.ClaimedRequest) {
	loop.scheduler.Add(claimed)
	touched := map[string]bool{}
	for _, request := range claimed {
		touched[request.RuntimeID] = true
	}
	for runtimeID := range touched {
		loop.advance(ctx, runtimeID)
	}
}

// advance runs admissions on one runtime until nothing more may run now.
func (loop *Loop) advance(ctx context.Context, runtimeID string) {
	for {
		var admission host.Admission
		loop.scheduler.With(runtimeID, func(queue *host.RuntimeQueue) { admission = queue.Next() })
		if admission.IsEmpty() && len(admission.Superseded) == 0 {
			return
		}
		runtime, err := loop.runtimeOf(ctx, runtimeID)
		if err != nil {
			log.Printf("runtime %s could not be opened: %v", runtimeID, err)
			loop.failAll(ctx, admission, contracts.ProgressUnavailable)
			return
		}
		if !loop.run(ctx, runtime, admission) {
			return
		}
	}
}

// run carries out one admission and answers whether the runtime may take more now.
func (loop *Loop) run(ctx context.Context, runtime *liveRuntime, admission host.Admission) bool {
	for _, superseded := range admission.Superseded {
		loop.report(ctx, superseded, contracts.OperationResult{Progress: "superseded"})
	}
	if admission.Control != nil {
		return loop.control(ctx, runtime, *admission.Control)
	}
	for _, setting := range admission.Staged {
		loop.setting(ctx, runtime, setting)
	}
	if admission.Script != nil {
		loop.startScript(ctx, runtime, *admission.Script)

		return false
	}
	if !admission.StartsTurn() {
		return true
	}
	loop.startTurn(ctx, runtime, admission)

	return false
}

func (loop *Loop) control(ctx context.Context, runtime *liveRuntime, request client.ClaimedRequest) bool {
	identity := identityOf(request)
	switch request.Operation {
	case "interrupt":
		loop.mutex.Lock()
		turn := 0
		if len(runtime.running) > 0 {
			turn = runtime.turns
		}
		loop.mutex.Unlock()
		result, err := runtime.driver.Interrupt(ctx, contracts.InterruptRequest{Request: identity, Turn: turn})
		if err == nil && result.Hold != "" && result.Hold != contracts.HoldNone {
			loop.mutex.Lock()
			runtime.hold = result.Hold
			if result.Progress == contracts.ProgressApplying {
				runtime.interrupts = append(runtime.interrupts, request)
			}
			loop.mutex.Unlock()
		}
		loop.reportResult(ctx, request, result, err)
		return true
	case "stop":
		result, err := runtime.driver.Stop(ctx, contracts.StopRequest{Request: identity})
		loop.reportResult(ctx, request, result, err)
		if err == nil && result.Progress == contracts.ProgressApplied {
			loop.exited(ctx, runtime, "stopped on request")
		}
		return false
	default:
		loop.report(ctx, request, contracts.OperationResult{Progress: contracts.ProgressUnavailable})
		return true
	}
}

func (loop *Loop) setting(ctx context.Context, runtime *liveRuntime, request client.ClaimedRequest) {
	identity := identityOf(request)
	var result contracts.OperationResult
	var err error
	if request.Operation == "change_model" {
		result, err = runtime.driver.ChangeModel(ctx, contracts.ModelChange{Request: identity, Model: text(request.Model)})
	} else {
		result, err = runtime.driver.ChangeEffort(ctx, contracts.EffortChange{Request: identity, Effort: text(request.Effort)})
	}
	if err == nil && result.Progress == contracts.ProgressStaged {
		runtime.staged = append(runtime.staged, request)
	}
	loop.reportResult(ctx, request, result, err)
}

// startTurn hands the turn's deliveries to the program as one prompt, or the wake's pending-work prompt when no
// content waits, and reports the rest when the turn ends.
func (loop *Loop) startTurn(ctx context.Context, runtime *liveRuntime, admission host.Admission) {
	requests := append(append([]client.ClaimedRequest{}, admission.Deliveries...), admission.Wakes...)
	first := identityOf(requests[0])
	var result contracts.OperationResult
	var err error
	if len(admission.Deliveries) > 0 {
		messages := make([]string, 0, len(admission.Deliveries))
		for _, delivery := range admission.Deliveries {
			messages = append(messages, text(delivery.Message))
		}
		result, err = runtime.driver.Deliver(ctx, contracts.Delivery{Request: first, Message: strings.Join(messages, "\n\n")})
	} else {
		result, err = runtime.driver.Wake(ctx, contracts.WakeRequest{Request: first})
	}
	if err != nil || result.Progress != contracts.ProgressApplying {
		for _, request := range requests {
			loop.reportResult(ctx, request, result, err)
		}
		return
	}

	runtime.turns++
	runtime.running = requests
	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.TurnStarted() })
	for _, request := range requests {
		loop.report(ctx, request, contracts.OperationResult{Progress: contracts.ProgressApplying})
	}
	loop.activity(ctx, runtime, "running")
	go loop.awaitTurn(ctx, runtime)
}

// awaitTurn waits for the turn's program to end, reports its requests applied, or uncertain when the program ended
// with an error, and the runtime idle, and runs what waited behind the turn.
func (loop *Loop) awaitTurn(ctx context.Context, runtime *liveRuntime) {
	ended := <-runtime.driver.Finished()
	result := contracts.OperationResult{Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed}
	if ended != nil {
		log.Printf("the turn of runtime %s ended with an error: %v", runtime.id, ended)
		result = contracts.OperationResult{Progress: contracts.ProgressDeliveryUncertain}
	}

	loop.mutex.Lock()
	finished := append(runtime.running, runtime.staged...)
	interrupts := runtime.interrupts
	runtime.running, runtime.staged, runtime.interrupts = nil, nil, nil
	loop.mutex.Unlock()

	for _, request := range finished {
		loop.report(ctx, request, result)
	}
	for _, request := range interrupts {
		loop.report(ctx, request, contracts.OperationResult{Progress: contracts.ProgressApplied})
	}
	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.TurnFinished() })
	loop.activity(ctx, runtime, "idle")
	loop.advance(ctx, runtime.id)
}

// startScript runs a key script like a turn: the runtime is busy while it runs, the run waits on its screen in its
// own goroutine so the loop takes a stop or a wake meanwhile, and the runtime takes more work when it ends.
func (loop *Loop) startScript(ctx context.Context, runtime *liveRuntime, request client.ClaimedRequest) {
	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.TurnStarted() })
	loop.report(ctx, request, contracts.OperationResult{Progress: contracts.ProgressApplying})
	loop.activity(ctx, runtime, "running")
	go loop.runScript(ctx, runtime, request)
}

func (loop *Loop) runScript(ctx context.Context, runtime *liveRuntime, request client.ClaimedRequest) {
	result, err := loop.scriptResult(ctx, runtime, request)
	if err == nil && result.Hold == contracts.HoldNavigationNeeded {
		loop.holdForNavigation(ctx, runtime, request, *result.Script.Uncertainty)
	} else {
		loop.reportResult(ctx, request, result, err)
	}

	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.TurnFinished() })
	loop.activity(ctx, runtime, "idle")
	loop.advance(ctx, runtime.id)
}

// scriptResult runs the script on a driver that runs key scripts, reporting each step it confirms, and reads how it
// ended in the journal's words.
func (loop *Loop) scriptResult(
	ctx context.Context,
	runtime *liveRuntime,
	request client.ClaimedRequest,
) (contracts.OperationResult, error) {
	runner, runsScripts := runtime.driver.(contracts.KeyScriptRunner)
	if !runsScripts {
		return contracts.OperationResult{
			Progress: contracts.ProgressUnavailable,
			Outcome:  contracts.OutcomeTerminalRequired,
		}, nil
	}
	if reporter, reportsSteps := runtime.driver.(stepReporter); reportsSteps {
		reporter.ReportProgressTo(func(progress keyscripts.Progress) { loop.reportStep(ctx, runtime, request, progress) })
	}

	result, err := runner.RunKeyScript(ctx, contracts.KeyScriptRequest{
		Request:    identityOf(request),
		Script:     text(request.Script),
		Parameters: parametersOf(request),
		ResumeStep: request.ScriptStep,
	})
	if err != nil || result.Script == nil {
		return result, err
	}

	return scriptEnd(*result.Script), nil
}

// holdForNavigation ends a script that stopped on a menu it could not be certain of: its request ends
// entry_unavailable at the stalled step with only the reason as evidence, never the screen's rows, and the runtime
// holds navigation_needed so no other work types into that menu.
func (loop *Loop) holdForNavigation(
	ctx context.Context,
	runtime *liveRuntime,
	request client.ClaimedRequest,
	uncertainty keyscripts.Uncertainty,
) {
	outcome := string(contracts.OutcomeEntryUnavailable)
	report := client.RequestReport{
		RequestID: request.RequestID,
		Attempt:   request.Attempt,
		Progress:  string(contracts.ProgressFailed),
		Outcome:   &outcome,
		Script: &client.ScriptReport{
			Step:       uncertainty.Step,
			Generation: runtime.driver.Generation(),
			Evidence:   "navigation-needed: " + string(uncertainty.Reason),
		},
	}
	if err := loop.journal.ReportRequest(ctx, report); err != nil {
		log.Printf("the stop of request %s for navigation could not be reported: %v", request.RequestID, err)
	}
	loop.mutex.Lock()
	runtime.hold = contracts.HoldNavigationNeeded
	loop.mutex.Unlock()
	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.Hold() })
}

// stepReporter is a driver whose key scripts report each step they confirm.
type stepReporter interface {
	ReportProgressTo(receiver func(keyscripts.Progress))
}

// reportStep reports one confirmed step under the script's request: its number and what it saw, never a key.
func (loop *Loop) reportStep(
	ctx context.Context,
	runtime *liveRuntime,
	request client.ClaimedRequest,
	progress keyscripts.Progress,
) {
	evidence := progress.Name + ": " + string(progress.Seen.Kind)
	if progress.Seen.Menu != "" {
		evidence += " " + progress.Seen.Menu
	}
	report := client.RequestReport{
		RequestID: request.RequestID,
		Attempt:   request.Attempt,
		Progress:  string(contracts.ProgressApplying),
		Script:    &client.ScriptReport{Step: progress.Step, Generation: runtime.driver.Generation(), Evidence: evidence},
	}
	if err := loop.journal.ReportRequest(ctx, report); err != nil {
		log.Printf("step %d of request %s could not be reported: %v", progress.Step, request.RequestID, err)
	}
}

// scriptEnd is how a run that stopped ends its request: applied only when the script proved its result on screen,
// failed with the reason otherwise, and held for the person when the person typed or a step waits for them.
func scriptEnd(result keyscripts.Result) contracts.OperationResult {
	switch result.Outcome {
	case keyscripts.Finished:
		if result.Proven {
			return contracts.OperationResult{Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed}
		}
		return contracts.OperationResult{Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeUnconfirmed}
	case keyscripts.ScriptFailed:
		return contracts.OperationResult{Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeScriptFailed}
	case keyscripts.EntryUnavailable:
		return contracts.OperationResult{Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeEntryUnavailable}
	case keyscripts.NavigationNeeded:
		return contracts.OperationResult{
			Progress: contracts.ProgressFailed,
			Outcome:  contracts.OutcomeEntryUnavailable,
			Hold:     contracts.HoldNavigationNeeded,
			Script:   &result,
		}
	}

	return contracts.OperationResult{Progress: contracts.ProgressFailed, Hold: contracts.HoldNeedsAttention}
}

// parametersOf is the claimed script's parameters by name.
func parametersOf(request client.ClaimedRequest) map[string]string {
	values := map[string]string{}
	for _, parameter := range request.ScriptParameters {
		values[parameter.Name] = parameter.Value
	}

	return values
}

func (loop *Loop) runtimeOf(ctx context.Context, runtimeID string) (*liveRuntime, error) {
	loop.mutex.Lock()
	defer loop.mutex.Unlock()
	if runtime, found := loop.runtimes[runtimeID]; found {
		return runtime, nil
	}
	grant, err := loop.journal.LaunchGrant(ctx, runtimeID)
	if err != nil {
		return nil, err
	}
	driver, err := loop.open(runtimeID, grant)
	if err != nil {
		return nil, err
	}
	runtime := &liveRuntime{id: runtimeID, driver: driver, hold: contracts.HoldNone}
	loop.runtimes[runtimeID] = runtime

	return runtime, nil
}

func (loop *Loop) exited(ctx context.Context, runtime *liveRuntime, evidence string) {
	loop.mutex.Lock()
	delete(loop.runtimes, runtime.id)
	loop.mutex.Unlock()
	report := client.LivenessReport{RuntimeID: runtime.id, ProcessGeneration: runtime.driver.Generation(), Evidence: evidence}
	if err := loop.journal.ReportExit(ctx, report); err != nil {
		log.Printf("the exit of runtime %s could not be reported: %v", runtime.id, err)
	}
}

func (loop *Loop) activity(ctx context.Context, runtime *liveRuntime, activity string) {
	loop.mutex.Lock()
	hold := runtime.hold
	loop.mutex.Unlock()
	if hold == "" {
		hold = contracts.HoldNone
	}
	report := client.ActivityReport{
		RuntimeID:         runtime.id,
		Activity:          activity,
		Hold:              string(hold),
		ProcessGeneration: runtime.driver.Generation(),
	}
	if err := loop.journal.ReportActivity(ctx, report); err != nil {
		log.Printf("the activity of runtime %s could not be reported: %v", runtime.id, err)
	}
}

func (loop *Loop) failAll(ctx context.Context, admission host.Admission, progress contracts.Progress) {
	all := append(append(append([]client.ClaimedRequest{}, admission.Staged...), admission.Deliveries...), admission.Wakes...)
	if admission.Control != nil {
		all = append(all, *admission.Control)
	}
	for _, request := range all {
		loop.report(ctx, request, contracts.OperationResult{Progress: progress})
	}
}

func (loop *Loop) reportResult(ctx context.Context, request client.ClaimedRequest, result contracts.OperationResult, err error) {
	if err != nil {
		log.Printf("%s request %s (attempt %d) of runtime %s failed: %v", request.Operation, request.RequestID, request.Attempt, request.RuntimeID, err)
		result = contracts.OperationResult{Progress: contracts.ProgressFailed, Outcome: contracts.OutcomeRefused}
	}
	loop.report(ctx, request, result)
}

// report sends one request's progress with the attempt it answers; a confirmed outcome is the journal's default and
// is not named.
func (loop *Loop) report(ctx context.Context, request client.ClaimedRequest, result contracts.OperationResult) {
	report := client.RequestReport{RequestID: request.RequestID, Attempt: request.Attempt, Progress: string(result.Progress)}
	if result.ActualBinding != "" {
		binding := result.ActualBinding
		report.ActualBinding = &binding
	}
	if result.Outcome != "" && result.Outcome != contracts.OutcomeConfirmed {
		outcome := string(result.Outcome)
		report.Outcome = &outcome
	}
	if err := loop.journal.ReportRequest(ctx, report); err != nil {
		log.Printf("%s request %s (attempt %d) could not be reported: %v", request.Operation, request.RequestID, request.Attempt, err)
	}
}

func identityOf(request client.ClaimedRequest) contracts.RequestIdentity {
	return contracts.RequestIdentity{RuntimeID: request.RuntimeID, RequestID: request.RequestID, Sequence: request.Sequence, Attempt: request.Attempt}
}

func text(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}
