package serving

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
)

type fakeJournal struct {
	mutex    sync.Mutex
	grants   int
	reports  []client.RequestReport
	activity []string
	holds    []string
	exits    int
	raises   []client.NavigationRaise
	// interrupts are the navigation requests the host reported the person took over.
	interrupts []string
	// replayed are the library entries the host reported it replayed.
	replayed []string
	// stale are the library entries the host reported stale, by entry id.
	stale map[string]client.EntryStaleReport
	// answers are the replies to the raises in turn; past the last one a raise is opened.
	answers []raiseReply
}

// raiseReply is one reply of the journal to a raise: an answer, or the error its call ended with.
type raiseReply struct {
	answer client.NavigationAnswer
	err    error
}

func (journal *fakeJournal) ReportReplayed(_ context.Context, entryID, _, _ string) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.replayed = append(journal.replayed, entryID)
	return nil
}

func (journal *fakeJournal) ReportStale(_ context.Context, entryID string, report client.EntryStaleReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if journal.stale == nil {
		journal.stale = map[string]client.EntryStaleReport{}
	}
	journal.stale[entryID] = report
	return nil
}

func (journal *fakeJournal) InterruptNavigation(_ context.Context, navigationID string) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.interrupts = append(journal.interrupts, navigationID)
	return nil
}

func (journal *fakeJournal) RaiseNavigation(
	_ context.Context,
	_ string,
	raise client.NavigationRaise,
) (client.NavigationAnswer, error) {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.raises = append(journal.raises, raise)
	if len(journal.answers) == 0 {
		return client.NavigationAnswer{Answer: client.NavigationOpened}, nil
	}
	reply := journal.answers[0]
	journal.answers = journal.answers[1:]
	return reply.answer, reply.err
}

// grantedPreparer prepares a start from the fake journal's grant alone: the loop's tests do not reach accounts.
type grantedPreparer struct{ journal *fakeJournal }

func (preparer grantedPreparer) Prepare(ctx context.Context, runtimeID string) (host.PreparedStart, error) {
	grant, err := preparer.journal.StartGrant(ctx, runtimeID)
	return host.PreparedStart{Grant: grant}, err
}

func (journal *fakeJournal) StartGrant(context.Context, string) (client.Grant, error) {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.grants++
	return client.Grant{Token: "token", Runtime: client.RuntimeStart{ProgramBuild: "0.165.0"}}, nil
}

func (journal *fakeJournal) ReportRequest(_ context.Context, report client.RequestReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.reports = append(journal.reports, report)
	return nil
}

func (journal *fakeJournal) ReportActivity(_ context.Context, report client.ActivityReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.activity = append(journal.activity, report.Activity)
	journal.holds = append(journal.holds, report.Hold)
	return nil
}

func (journal *fakeJournal) ReportExit(context.Context, client.LivenessReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.exits++
	return nil
}

func (journal *fakeJournal) progressOf(requestID string) []string {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	progress := []string{}
	for _, report := range journal.reports {
		if report.RequestID == requestID {
			progress = append(progress, report.Progress)
		}
	}
	return progress
}

// fakeRuntime runs every turn until the test ends it.
type fakeRuntime struct {
	prompts  []string
	finished chan error
	stopped  bool
}

func (runtime *fakeRuntime) Deliver(_ context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	runtime.prompts = append(runtime.prompts, delivery.Message)
	runtime.finished = make(chan error, 1)
	return contracts.OperationResult{Request: delivery.Request, Progress: contracts.ProgressApplying}, nil
}

func (runtime *fakeRuntime) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return runtime.Deliver(context.Background(), contracts.Delivery{Request: wake.Request, Message: "wake"})
}

func (runtime *fakeRuntime) ChangeModel(_ context.Context, change contracts.ModelChange) (contracts.OperationResult, error) {
	return contracts.OperationResult{Request: change.Request, Progress: contracts.ProgressStaged}, nil
}

func (runtime *fakeRuntime) ChangeEffort(_ context.Context, change contracts.EffortChange) (contracts.OperationResult, error) {
	return contracts.OperationResult{Request: change.Request, Progress: contracts.ProgressStaged}, nil
}

func (runtime *fakeRuntime) Interrupt(_ context.Context, interrupt contracts.InterruptRequest) (contracts.OperationResult, error) {
	return contracts.OperationResult{Request: interrupt.Request, Progress: contracts.ProgressApplying, Hold: contracts.HoldInterrupted}, nil
}

func (runtime *fakeRuntime) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	runtime.stopped = true
	return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed}, nil
}

func (runtime *fakeRuntime) Generation() int { return 1 }

func (runtime *fakeRuntime) Finished() <-chan error { return runtime.finished }

func claimed(id string, sequence int, operation string, message string) client.ClaimedRequest {
	return client.ClaimedRequest{RuntimeID: "runtime", RequestID: id, Sequence: sequence, Operation: operation, Message: &message}
}

func waitFor(t *testing.T, condition func() bool) {
	t.Helper()
	deadline := time.Now().Add(2 * time.Second)
	for !condition() {
		if time.Now().After(deadline) {
			t.Fatal("the loop did not get there in time")
		}
		time.Sleep(5 * time.Millisecond)
	}
}

func TestDeliveriesRunAsOneTurnAndAreAppliedWhenItEnds(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "deliver", "one"), claimed("b", 2, "deliver", "two")})

	if len(runtime.prompts) != 1 || runtime.prompts[0] != "one\n\ntwo" {
		t.Fatalf("the program got %q", runtime.prompts)
	}
	if got := journal.progressOf("a"); len(got) != 1 || got[0] != "applying" {
		t.Fatalf("a was reported %v before the turn ended", got)
	}

	runtime.finished <- nil

	waitFor(t, func() bool { return len(journal.progressOf("b")) == 2 })
	if got := journal.progressOf("b"); got[1] != "applied" || journal.grants != 1 {
		t.Fatalf("b was reported %v after %d grants", got, journal.grants)
	}
}

func TestAStopEndsTheRuntimeAndReportsItsExit(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("stop", 1, "stop", "")})

	if !runtime.stopped || journal.exits != 1 {
		t.Fatalf("stopped %v, %d exits reported", runtime.stopped, journal.exits)
	}
	if got := journal.progressOf("stop"); len(got) != 1 || got[0] != "applied" {
		t.Fatalf("the stop was reported %v", got)
	}
}

func TestAnInterruptKeepsTheRuntimeHeldAndEndsWithItsTurn(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.Take(context.Background(), []client.ClaimedRequest{claimed("work", 1, "deliver", "count")})

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("stop-turn", 2, "interrupt", "")})
	runtime.finished <- errors.New("signal: interrupt")

	waitFor(t, func() bool { return len(journal.progressOf("stop-turn")) == 2 })
	journal.mutex.Lock()
	last := journal.activity[len(journal.activity)-1]
	journal.mutex.Unlock()
	if got := journal.progressOf("stop-turn"); got[1] != "applied" || last != "idle" {
		t.Fatalf("the interrupt was reported %v, the runtime %s", got, last)
	}
}

func TestATurnWhoseProgramFailsLeavesItsDeliveryUncertain(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.Take(context.Background(), []client.ClaimedRequest{claimed("work", 1, "deliver", "hello")})

	runtime.finished <- errors.New("exit status 1")

	waitFor(t, func() bool { return len(journal.progressOf("work")) == 2 })
	if got := journal.progressOf("work"); got[1] != "delivery_uncertain" {
		t.Fatalf("the failed turn was reported %v", got)
	}
}
