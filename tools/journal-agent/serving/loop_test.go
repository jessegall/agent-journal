package serving

import (
	"context"
	"sync"
	"sync/atomic"
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
	// sequences are the numbers of every request and activity report, in the order they were sent.
	sequences []uint64
	exits     int
	// beats are the runtimes a heartbeat was reported for, in order.
	beats  []string
	raises []client.NavigationRaise
	// interrupts are the navigation requests the host reported the user took over.
	interrupts []string
	// replayed are the library entries the host reported it replayed.
	replayed []string
	// stale are the library entries the host reported stale, by entry id.
	stale map[string]client.EntryStaleReport
	// answers are the replies to the raises in turn; past the last one a raise is opened.
	answers []raiseReply
}

// exitsReported is how many runtime exits were reported so far.
func (journal *fakeJournal) exitsReported() int {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()

	return journal.exits
}

// activities are the activity reports so far, each with the hold it carried.
func (journal *fakeJournal) activities() []string {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	reported := make([]string, len(journal.activity))
	for index, activity := range journal.activity {
		reported[index] = activity + " " + journal.holds[index]
	}

	return reported
}

// raiseReply is one reply of the journal to a raise: an answer, or the error its call ended with.
type raiseReply struct {
	answer client.NavigationAnswer
	err    error
}

func (journal *fakeJournal) NotifyReplayed(_ context.Context, entryID, _, _ string) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.replayed = append(journal.replayed, entryID)
	return nil
}

func (journal *fakeJournal) NotifyStale(_ context.Context, entryID string, report client.EntryStaleReport) error {
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
	return client.Grant{Token: "token", Runtime: client.RuntimeStart{DriverBuild: "0.165.0"}}, nil
}

func (journal *fakeJournal) NotifyRequest(_ context.Context, report client.RequestReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.reports = append(journal.reports, report)
	journal.sequences = append(journal.sequences, report.Sequence)
	return nil
}

func (journal *fakeJournal) NotifyActivity(_ context.Context, report client.ActivityReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.activity = append(journal.activity, report.Activity)
	journal.holds = append(journal.holds, report.Hold)
	journal.sequences = append(journal.sequences, report.Sequence)
	return nil
}

func (journal *fakeJournal) NotifyHeartbeat(_ context.Context, report client.LivenessReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.beats = append(journal.beats, report.RuntimeID)
	return nil
}

// beatsOf is how many beats were sent for a runtime so far.
func (journal *fakeJournal) beatsOf(runtimeID string) int {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	count := 0
	for _, beat := range journal.beats {
		if beat == runtimeID {
			count++
		}
	}
	return count
}

func (journal *fakeJournal) NotifyExit(context.Context, client.LivenessReport) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.exits++
	return nil
}

func (journal *fakeJournal) turnEndOf(requestID string) *contracts.TurnEnd {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	for _, report := range journal.reports {
		if report.RequestID == requestID && report.TurnEnd != nil {
			return report.TurnEnd
		}
	}
	return nil
}

func (journal *fakeJournal) progressOf(requestID string) []string {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	progress := []string{}
	for _, report := range journal.reports {
		if report.RequestID == requestID && report.TurnEnd != nil {
			progress = append(progress, "ended")
		} else if report.RequestID == requestID {
			progress = append(progress, report.Progress)
		}
	}
	return progress
}

// fakeRuntime runs every turn until the test ends it.
type fakeRuntime struct {
	prompts  []string
	finished chan contracts.TurnEnd
	stopped  bool
}

func (runtime *fakeRuntime) Deliver(_ context.Context, delivery contracts.Delivery) (contracts.OperationResult, error) {
	runtime.prompts = append(runtime.prompts, contracts.PromptOf(delivery.Parts))
	runtime.finished = make(chan contracts.TurnEnd, 1)
	return contracts.OperationResult{Request: delivery.Request, Progress: contracts.ProgressApplying}, nil
}

func (runtime *fakeRuntime) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return runtime.Deliver(context.Background(), contracts.Delivery{Request: wake.Request, Parts: contracts.TextParts(wake.Prompt)})
}

func (runtime *fakeRuntime) ChangeModel(_ context.Context, change contracts.ModelChange) (contracts.OperationResult, error) {
	return contracts.OperationResult{Request: change.Request, Progress: contracts.ProgressStaged}, nil
}

func (runtime *fakeRuntime) ChangeEffort(_ context.Context, change contracts.EffortChange) (contracts.OperationResult, error) {
	return contracts.OperationResult{Request: change.Request, Progress: contracts.ProgressStaged}, nil
}

func (runtime *fakeRuntime) Interrupt(_ context.Context, interrupt contracts.InterruptRequest) (contracts.OperationResult, error) {
	return contracts.OperationResult{Request: interrupt.Request, Progress: contracts.ProgressApplying}, nil
}

func (runtime *fakeRuntime) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	runtime.stopped = true
	return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed}, nil
}

func (runtime *fakeRuntime) Generation() int { return 1 }

func (runtime *fakeRuntime) Finished() <-chan contracts.TurnEnd { return runtime.finished }

func (runtime *fakeRuntime) NativeIdentity() string { return "conversation-1" }

func claimed(id string, sequence int, operation string, message string) client.ClaimedRequest {
	return client.ClaimedRequest{RuntimeID: "runtime", RequestID: id, Sequence: sequence, Operation: operation, Message: &message, Parts: contracts.TextParts(message)}
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

// The journal builds each turn's whole prompt: the program gets each delivery and each wake's prompt as it was sent,
// one turn at a time, and the host joins and invents nothing.
func TestEachTurnGivesTheProgramThePromptTheJournalSent(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{
		claimed("a", 1, "deliver", "one"), claimed("b", 2, "deliver", "two"), claimed("c", 3, "wake", "New messages."),
	})
	runtime.finished <- contracts.TurnEnd{}
	waitFor(t, func() bool { return len(journal.progressOf("b")) == 1 })
	runtime.finished <- contracts.TurnEnd{}
	waitFor(t, func() bool { return len(journal.progressOf("c")) == 1 })

	prompts := runtime.prompts
	if len(prompts) != 3 || prompts[0] != "one" || prompts[1] != "two" || prompts[2] != "New messages." {
		t.Fatalf("the program got %q", prompts)
	}
}

func TestAWakeTheJournalSentNoPromptWithIsRefusedAndNeverFilledIn(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "wake", "")})

	waitFor(t, func() bool { return len(journal.progressOf("a")) == 1 })
	if got := journal.progressOf("a"); got[0] != string(contracts.ProgressFailed) || len(runtime.prompts) != 0 {
		t.Fatalf("the empty wake was reported %v and the program got %q", got, runtime.prompts)
	}
}

func TestEveryReportOfARuntimeIsNumberedOneAfterTheLast(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "deliver", "one")})
	runtime.finished <- contracts.TurnEnd{}
	waitFor(t, func() bool { return len(journal.progressOf("a")) == 2 })

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	for index, sequence := range journal.sequences {
		if sequence != uint64(index+1) {
			t.Fatalf("the reports were numbered %v; want 1, 2, 3 and so on", journal.sequences)
		}
	}
}

func TestAnEndedTurnReportsTheConversationItsProgramRuns(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "wake", "Check your work.")})
	runtime.finished <- contracts.TurnEnd{}
	waitFor(t, func() bool { return len(journal.progressOf("a")) == 2 })

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	applied := journal.reports[len(journal.reports)-1]
	if applied.ActualBinding == nil || *applied.ActualBinding != runtime.NativeIdentity() {
		t.Fatalf("the ended turn reported the conversation %v; want %q", applied.ActualBinding, runtime.NativeIdentity())
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
	runtime.finished <- contracts.TurnEnd{Problem: "signal: interrupt"}

	waitFor(t, func() bool { return len(journal.progressOf("stop-turn")) == 2 })
	journal.mutex.Lock()
	last := journal.activity[len(journal.activity)-1]
	journal.mutex.Unlock()
	if got := journal.progressOf("stop-turn"); got[1] != "ended" || last != "idle" {
		t.Fatalf("the interrupt was reported %v, the runtime %s", got, last)
	}
}

// The host judges no turn: what it saw of the end goes to the journal as it was, which decides whether it failed.
func TestATurnsEndIsReportedAsTheHostSawIt(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &fakeRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.Take(context.Background(), []client.ClaimedRequest{claimed("work", 1, "deliver", "hello")})

	failed := 1
	runtime.finished <- contracts.TurnEnd{ExitCode: &failed, IsResultRead: true, ResultSubtype: "error_during_execution"}

	waitFor(t, func() bool { return len(journal.progressOf("work")) == 2 })
	end := journal.turnEndOf("work")
	if end == nil || *end.ExitCode != 1 || end.ResultSubtype != "error_during_execution" || end.Problem != "" {
		t.Fatalf("the turn's end was reported as %+v", end)
	}
}

// menuRuntime is a program whose screen shows a menu: no prompt gets in until a user answers it.
type menuRuntime struct {
	fakeRuntime
	answered atomic.Bool
	asked    atomic.Int32
}

func (runtime *menuRuntime) Wake(ctx context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	runtime.asked.Add(1)
	if !runtime.answered.Load() {
		return contracts.OperationResult{Request: wake.Request, Progress: contracts.ProgressStaged, Hold: "onboarding_required"}, nil
	}

	return runtime.fakeRuntime.Wake(ctx, wake)
}

// The host decides nothing about a turn the screen refuses: it reports the screen's hold once and the turn staged,
// tries no more, and the wake gets in when the journal offers it again after the menu was answered.
func TestATurnTheScreenRefusesIsReportedOnceAndGetsInWhenTheJournalOffersItAgain(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &menuRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "wake", "Check your work.")})
	waitFor(t, func() bool { return len(journal.progressOf("a")) == 1 })
	if held := journal.activities(); len(held) != 1 || held[0] != "idle onboarding_required" {
		t.Fatalf("the held start was reported as %v, not once as idle and held by the menu", held)
	}
	if reported := journal.progressOf("a"); reported[0] != string(contracts.ProgressStaged) {
		t.Fatalf("the refused wake was reported %v, not staged", reported)
	}
	time.Sleep(50 * time.Millisecond)
	if asked := runtime.asked.Load(); asked != 1 {
		t.Fatalf("the host tried the refused wake %d times on its own", asked)
	}

	runtime.answered.Store(true)
	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 2, "wake", "Check your work.")})
	waitFor(t, func() bool { return len(journal.progressOf("a")) == 2 })

	if started := journal.activities()[1]; started != "running "+string(contracts.HoldNone) {
		t.Fatalf("the turn after the menu was reported as %q", started)
	}
	if reported := journal.progressOf("a"); reported[1] != string(contracts.ProgressApplying) {
		t.Fatalf("the wake the journal offered again was reported %v", reported)
	}
}

// An idle runtime reported nothing between two turns, so the journal called its state unknown after a minute.
func TestARuntimeTheLoopServesIsReportedAliveFromTheMomentItOpens(t *testing.T) {
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return &fakeRuntime{}, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "wake", "Check your work.")})

	waitFor(t, func() bool { return journal.beatsOf("runtime") == 1 })
}

// endingRuntime is a runtime whose program can end on its own, as a session container that is removed does, while a
// menu keeps its wake waiting.
type endingRuntime struct {
	menuRuntime
	ended chan string
}

func (runtime *endingRuntime) Ended() <-chan string { return runtime.ended }

// A session container removed under a refused wake leaves the loop and is never tried again.
func TestARuntimeWhoseProgramEndsOnItsOwnLeavesTheLoopAndItsWaitingWakeIsGivenUp(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &endingRuntime{ended: make(chan string, 1)}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "wake", "Check your work.")})
	waitFor(t, func() bool { return len(journal.progressOf("a")) == 1 })
	runtime.ended <- "the session container's program exited with 137"

	waitFor(t, func() bool { return journal.exitsReported() == 1 })
	asked := runtime.asked.Load()
	time.Sleep(50 * time.Millisecond)

	if journal.exitsReported() != 1 || runtime.stopped {
		t.Fatalf("%d exits reported, stopped %v", journal.exitsReported(), runtime.stopped)
	}
	if reported := journal.progressOf("a"); reported[0] != string(contracts.ProgressStaged) {
		t.Fatalf("the waiting wake was reported %v", reported)
	}
	if again := runtime.asked.Load(); again != asked {
		t.Fatalf("the wake was tried %d more times on the ended runtime", again-asked)
	}
}

// bootstrappingRuntime proves its conversation without a turn.
type bootstrappingRuntime struct {
	fakeRuntime
	bootstraps int
}

func (runtime *bootstrappingRuntime) Bootstrap(_ context.Context, request contracts.RequestIdentity) (contracts.OperationResult, error) {
	runtime.bootstraps++
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplied, Outcome: contracts.OutcomeConfirmed, ActualBinding: "thread-1"}, nil
}

func TestABootstrapWakeIsAppliedWithItsBindingAndStartsNoTurn(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &bootstrappingRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	bootstrap := claimed("a", 1, "wake", "")
	bootstrap.ShouldBootstrap = true

	loop.Take(context.Background(), []client.ClaimedRequest{bootstrap})
	loop.Take(context.Background(), []client.ClaimedRequest{claimed("b", 2, "deliver", "hello")})

	journal.mutex.Lock()
	applied := journal.reports[0]
	journal.mutex.Unlock()
	if runtime.bootstraps != 1 || applied.Progress != "applied" || applied.ActualBinding == nil || *applied.ActualBinding != "thread-1" {
		t.Fatalf("the bootstrap ran %d times and was reported %+v", runtime.bootstraps, applied)
	}
	if len(runtime.prompts) != 1 || runtime.prompts[0] != "hello" {
		t.Fatalf("the program got %q; want only the delivery after the bootstrap", runtime.prompts)
	}
}

func TestAWakeThatIsNoBootstrapStillStartsATurn(t *testing.T) {
	journal := &fakeJournal{}
	runtime := &bootstrappingRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("a", 1, "wake", "Check your work.")})

	if runtime.bootstraps != 0 || len(runtime.prompts) != 1 {
		t.Fatalf("a plain wake bootstrapped %d times and ran %d turns", runtime.bootstraps, len(runtime.prompts))
	}
}

func bootstrapped(t *testing.T, folder string, journal *fakeJournal) *Loop {
	t.Helper()
	runtime := &bootstrappingRuntime{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	if err := loop.KeepUnsentReports(context.Background(), folder); err != nil {
		t.Fatal(err)
	}
	return loop
}

func checkStatus(generation int) client.ClaimedRequest {
	check := claimed("check", 2, "resend_readiness", "")
	check.ProcessGeneration = generation
	return check
}

func TestCheckStatusSendsTheKeptReadyReportAgainExactly(t *testing.T) {
	folder := t.TempDir()
	journal := &fakeJournal{}
	loop := bootstrapped(t, folder, journal)
	bootstrap := claimed("a", 1, "wake", "")
	bootstrap.ShouldBootstrap = true
	loop.Take(context.Background(), []client.ClaimedRequest{bootstrap})

	restarted := bootstrapped(t, folder, journal)
	restarted.Take(context.Background(), []client.ClaimedRequest{checkStatus(0)})

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if len(journal.reports) != 3 {
		t.Fatalf("the journal got %d reports; want the ready report, it again and the check", len(journal.reports))
	}
	original, resent, check := journal.reports[0], journal.reports[1], journal.reports[2]
	if resent.RequestID != original.RequestID || resent.Sequence != original.Sequence || *resent.ActualBinding != *original.ActualBinding {
		t.Fatalf("the resent report %+v differs from the first %+v", resent, original)
	}
	if check.RequestID != "check" || check.Progress != "applied" {
		t.Fatalf("the check was reported %+v", check)
	}
}

func TestCheckStatusWithoutAReadyReportOfThatGenerationAnswersNoObservation(t *testing.T) {
	journal := &fakeJournal{}
	loop := bootstrapped(t, t.TempDir(), journal)
	bootstrap := claimed("a", 1, "wake", "")
	bootstrap.ShouldBootstrap = true
	loop.Take(context.Background(), []client.ClaimedRequest{bootstrap})

	loop.Take(context.Background(), []client.ClaimedRequest{checkStatus(7)})

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	check := journal.reports[len(journal.reports)-1]
	if len(journal.reports) != 2 || check.Progress != "failed" || check.RefusalReason == nil || *check.RefusalReason != "no_observation" {
		t.Fatalf("a check of another generation was reported %+v after %d reports", check, len(journal.reports))
	}
}
