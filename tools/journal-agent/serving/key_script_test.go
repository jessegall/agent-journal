package serving

import (
	"context"
	"errors"
	"reflect"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/keyscripts"
	"journal-agent/screen"
)

// scriptRuntime is a terminal runtime whose key script confirms its steps and then waits until the test ends it.
type scriptRuntime struct {
	fakeRuntime
	mutex            sync.Mutex
	runs             []contracts.KeyScriptRequest
	receiver         func(keyscripts.Progress)
	release          chan keyscripts.Result
	rereadCount      int
	screenUnreadable bool
	// replay is how a library entry's replay ends on this runtime.
	replay keyscripts.ReplayResult
}

func (runtime *scriptRuntime) ReplayEntry(keyscripts.Entry) (keyscripts.ReplayResult, error) {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()
	return runtime.replay, nil
}

func newScriptRuntime() *scriptRuntime {
	return &scriptRuntime{release: make(chan keyscripts.Result, 1)}
}

func (runtime *scriptRuntime) ReportProgressTo(receiver func(keyscripts.Progress)) {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()
	runtime.receiver = receiver
}

func (runtime *scriptRuntime) RunKeyScript(
	_ context.Context,
	request contracts.KeyScriptRequest,
) (contracts.OperationResult, error) {
	runtime.mutex.Lock()
	runtime.runs = append(runtime.runs, request)
	receiver := runtime.receiver
	runtime.mutex.Unlock()
	first := 0
	if request.ResumeStep != nil {
		first = *request.ResumeStep
	}
	for step := first; step < first+2; step++ {
		seen := screen.Classification{Kind: screen.MenuShown, Menu: "model-picker", Stable: true}
		receiver(keyscripts.Progress{Step: step, Name: "find the model", Seen: seen})
	}
	result := <-runtime.release

	return contracts.OperationResult{Request: request.Request, Progress: contracts.ProgressApplying, Script: &result}, nil
}

// Reread reads the stalled screen afresh: the same screen, counted.
func (runtime *scriptRuntime) Reread(stalled keyscripts.Uncertainty) (keyscripts.Uncertainty, bool) {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()
	runtime.rereadCount++
	return stalled, !runtime.screenUnreadable
}

func (runtime *scriptRuntime) rereads() int {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()
	return runtime.rereadCount
}

func (runtime *scriptRuntime) runCount() int {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()

	return len(runtime.runs)
}

func keyScriptClaim(id string, step *int) client.ClaimedRequest {
	script := "ChangeModel"
	return client.ClaimedRequest{
		RuntimeID:        "runtime",
		RequestID:        id,
		Sequence:         1,
		Attempt:          1,
		Operation:        "key_script",
		Script:           &script,
		ScriptParameters: []client.ScriptParameter{{Name: "model", Value: "GPT-6"}},
		ScriptStep:       step,
	}
}

func (journal *fakeJournal) reportsOf(requestID string) []client.RequestReport {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	reports := []client.RequestReport{}
	for _, report := range journal.reports {
		if report.RequestID == requestID {
			reports = append(reports, report)
		}
	}
	return reports
}

func TestAKeyScriptRunsOnceAwayFromTakeAndReportsEachStep(t *testing.T) {
	journal := &fakeJournal{}
	runtime := newScriptRuntime()
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })

	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 3 })

	reports := journal.reportsOf("script")
	if reports[0].Progress != "applying" || reports[0].Script != nil {
		t.Fatalf("the run started as %+v", reports[0])
	}
	for at, report := range reports[1:] {
		want := client.ScriptReport{Step: at, Generation: 1, Evidence: "find the model: menu model-picker"}
		if report.Progress != "applying" || report.Script == nil || *report.Script != want {
			t.Fatalf("step %d was reported %+v", at, report)
		}
	}

	runtime.release <- keyscripts.Result{Outcome: keyscripts.Finished, Step: 2, Proven: true}
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })
	if last := journal.reportsOf("script")[3]; last.Progress != "applied" || last.Outcome != nil {
		t.Fatalf("a proven run ended %+v", last)
	}
	if runtime.runCount() != 1 {
		t.Fatalf("the script ran %d times", runtime.runCount())
	}
}

func TestAFinishedRunThatProvesNothingIsUnconfirmedAndAFailedStepIsScriptFailed(t *testing.T) {
	ends := map[keyscripts.Outcome]string{keyscripts.Finished: "unconfirmed", keyscripts.ScriptFailed: "script_failed",
		keyscripts.EntryUnavailable: "entry_unavailable"}
	for outcome, want := range ends {
		journal := &fakeJournal{}
		runtime := newScriptRuntime()
		loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
		runtime.release <- keyscripts.Result{Outcome: outcome, Step: 2}

		loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
		waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

		last := journal.reportsOf("script")[3]
		if last.Progress != "failed" || last.Outcome == nil || *last.Outcome != want {
			t.Fatalf("a run that ended %s was reported %+v", outcome, last)
		}
	}
}

func TestAResumedAttemptStartsAtItsStoppedStep(t *testing.T) {
	journal := &fakeJournal{}
	runtime := newScriptRuntime()
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	stopped := 2

	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", &stopped)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 3 })

	runtime.mutex.Lock()
	resumed := runtime.runs[0].ResumeStep
	runtime.mutex.Unlock()
	if resumed == nil || *resumed != 2 || journal.reportsOf("script")[1].Script.Step != 2 {
		t.Fatalf("the resumed attempt started at %v", resumed)
	}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.Finished, Step: 4, Proven: true}
}

func TestAStopIsTakenWhileAScriptWaitsForItsScreen(t *testing.T) {
	journal := &fakeJournal{}
	runtime := newScriptRuntime()
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 3 })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("stop", 2, "stop", "")})

	if !runtime.stopped || journal.progressOf("stop")[0] != "applied" {
		t.Fatalf("the stop was not taken while the script waited: %v", journal.progressOf("stop"))
	}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.Paused, Step: 2}
}

// navigationLoop runs a key script that stops for navigation on a picker, with the journal's replies to its raises.
func navigationLoop(t *testing.T, replies ...raiseReply) (*fakeJournal, *scriptRuntime) {
	t.Helper()
	journal := &fakeJournal{answers: replies}
	runtime := newScriptRuntime()
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.raiseRetryDelay = 0
	uncertainty := keyscripts.Uncertainty{Reason: keyscripts.LabelMissing, Step: 1, Fingerprint: "fp1:a",
		Rows: []string{"Pick a model", "> GPT-5"}, Highlight: 1, Generation: 7}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.NavigationNeeded, Step: 1, Uncertainty: &uncertainty}
	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})

	return journal, runtime
}

func (journal *fakeJournal) raiseCount() int {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	return len(journal.raises)
}

func (journal *fakeJournal) lastHold() string {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if len(journal.holds) == 0 {
		return ""
	}
	return journal.holds[len(journal.holds)-1]
}

func TestAStoppedRunRaisesOnceAndStaysApplyingWhenARequestOpens(t *testing.T) {
	journal, _ := navigationLoop(t)
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

	raise := journal.raises[0]
	want := client.NavigationRaise{OperationKey: "script:1:1", RequestID: "script", Attempt: 1, Step: 1,
		Reason: "label-missing", Fingerprint: "fp1:a", Rows: []string{"Pick a model", "> GPT-5"}, Highlight: 1,
		Generation: 7}
	if journal.raiseCount() != 1 || !reflect.DeepEqual(raise, want) {
		t.Fatalf("the host raised %+v", journal.raises)
	}
	last := journal.reportsOf("script")[3]
	evidence := client.ScriptReport{Step: 1, Generation: 1, Evidence: "navigation-needed: label-missing"}
	if last.Progress != "applying" || last.Outcome != nil || last.Script == nil || *last.Script != evidence {
		t.Fatalf("an opened request was reported %+v", last)
	}
	waitFor(t, func() bool { return journal.lastHold() == "navigation_needed" })
}

func TestALostAnswerRereadsTheScreenAndSendsTheSameRaiseAgain(t *testing.T) {
	lost := raiseReply{err: errors.New("connection reset")}
	journal, runtime := navigationLoop(t, lost)
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

	if journal.raiseCount() != 2 || journal.raises[0].OperationKey != journal.raises[1].OperationKey {
		t.Fatalf("the host raised %+v", journal.raises)
	}
	if runtime.rereads() != 1 || runtime.stopped {
		t.Fatalf("the screen was read afresh %d times before the raise was sent again", runtime.rereads())
	}
}

type cancelOnRaiseJournal struct {
	*fakeJournal
	cancel context.CancelFunc
}

func (journal cancelOnRaiseJournal) RaiseNavigation(
	ctx context.Context, runtimeID string, raise client.NavigationRaise,
) (client.NavigationAnswer, error) {
	answer, err := journal.fakeJournal.RaiseNavigation(ctx, runtimeID, raise)
	journal.cancel()
	return answer, err
}

func TestCancellingALostRaiseEndsTheRetryAndKeepsTheHold(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	journal := &fakeJournal{answers: []raiseReply{{err: errors.New("connection reset")}}}
	driver := newScriptRuntime()
	runtime := &liveRuntime{id: "runtime-1", driver: driver}
	loop := NewLoop(cancelOnRaiseJournal{journal, cancel}, nil, nil)
	loop.raiseRetryDelay = time.Minute
	loop.runtimes[runtime.id] = runtime
	nav := newNavigation(loop, runtime, keyScriptClaim("script", nil), keyscripts.Uncertainty{})

	done := make(chan struct{})
	go func() {
		defer close(done)
		nav.raise(ctx)
	}()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("the lost raise stayed in its retry delay after cancellation")
	}

	if journal.raiseCount() != 1 || driver.rereads() != 0 || !loop.heldForNavigation(runtime) {
		t.Fatal("the cancelled raise retried, reread the screen, or released the runtime")
	}
}

func TestAnUnreadableScreenStopsBothWaysOfRaisingAgain(t *testing.T) {
	cases := []struct {
		name   string
		run    func(navigation)
		raises int
	}{
		{"lost answer", func(nav navigation) { nav.raise(context.Background()) }, 1},
		{"journal wait", func(nav navigation) { nav.askAgainAfter(context.Background(), 0) }, 0},
	}
	for _, test := range cases {
		t.Run(test.name, func(t *testing.T) {
			journal := &fakeJournal{answers: []raiseReply{{err: errors.New("connection reset")}}}
			driver := newScriptRuntime()
			driver.screenUnreadable = true
			runtime := &liveRuntime{id: "runtime-1", driver: driver, hold: contracts.HoldNavigationNeeded}
			loop := NewLoop(journal, nil, nil)
			loop.raiseRetryDelay = 0
			loop.runtimes[runtime.id] = runtime

			test.run(newNavigation(loop, runtime, keyScriptClaim("script", nil), keyscripts.Uncertainty{}))

			if journal.raiseCount() != test.raises || driver.rereads() != 1 || !loop.heldForNavigation(runtime) {
				t.Fatal("an unreadable screen was raised again or the runtime was released")
			}
		})
	}
}

func TestWithoutARereaderOnlyTheJournalWaitCanRaiseAgain(t *testing.T) {
	journal := &fakeJournal{answers: []raiseReply{{err: errors.New("connection reset")}}}
	runtime := &liveRuntime{id: "runtime-1", driver: &fakeRuntime{}}
	loop := NewLoop(journal, nil, nil)
	loop.runtimes[runtime.id] = runtime
	seen := keyscripts.Uncertainty{Step: 1, Fingerprint: "fp1:a", Generation: 7}
	nav := newNavigation(loop, runtime, keyScriptClaim("script", nil), seen)

	nav.raise(context.Background())
	if journal.raiseCount() != 1 {
		t.Fatal("a lost raise was retried without a rereader")
	}

	nav.askAgainAfter(context.Background(), 0)
	if journal.raiseCount() != 2 || journal.raises[1].Generation != 7 ||
		journal.raises[1].OperationKey != "script:1:1:ask:1" {
		t.Fatalf("the journal wait did not reuse the last screen: %+v", journal.raises)
	}
}

func TestAHeldAnswerEndsTheRunEntryUnavailableAndAWaitKeepsTheHold(t *testing.T) {
	held := raiseReply{answer: client.NavigationAnswer{Answer: client.NavigationHeld}}
	journal, _ := navigationLoop(t, held)
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })
	last := journal.reportsOf("script")[3]
	if last.Progress != "failed" || last.Outcome == nil || *last.Outcome != "entry_unavailable" {
		t.Fatalf("a held answer was reported %+v", last)
	}

	waiting := raiseReply{answer: client.NavigationAnswer{Answer: client.NavigationWait}}
	journal, _ = navigationLoop(t, waiting)
	waitFor(t, func() bool { return journal.lastHold() == "navigation_needed" })
	if reports := journal.reportsOf("script"); len(reports) != 3 {
		t.Fatalf("a wait was reported %+v", reports)
	}
}

// entryAnswer is the journal's answer naming a library entry to replay.
func entryAnswer(guarded bool) raiseReply {
	entry := `{"id":"entry-1","driver":"codex","goal":{"script":"ChangeModel","version":2,"parameters":[]},` +
		`"steps":[{"fingerprint":"fp1:a","choose":"GPT-6","key":null,"proof":null}],"completes":"goal",` +
		`"nextStep":null,"proof":"GPT-6"}`
	answer := client.NavigationAnswer{Answer: client.NavigationEntry, Entry: []byte(entry), Guarded: guarded}
	return raiseReply{answer: answer}
}

func TestAProvenEntryReplayIsCountedAndEndsTheScriptWithNoRequest(t *testing.T) {
	journal := &fakeJournal{answers: []raiseReply{entryAnswer(false)}}
	runtime := newScriptRuntime()
	runtime.replay = keyscripts.ReplayResult{Outcome: keyscripts.Proven}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	uncertainty := keyscripts.Uncertainty{Reason: keyscripts.LabelMissing, Step: 1, Fingerprint: "fp1:a"}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.NavigationNeeded, Step: 1, Uncertainty: &uncertainty}

	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

	last := journal.reportsOf("script")[3]
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if last.Progress != "applied" || len(journal.replayed) != 1 || journal.replayed[0] != "entry-1" ||
		len(journal.raises) != 1 {
		t.Fatalf("the replay ended %+v after %d raises, replayed %v", last, len(journal.raises), journal.replayed)
	}
}

func TestAGuardedEntryThatFailsIsDeclinedAndTheJournalAskedAgain(t *testing.T) {
	// The runtime's replay result is left empty: a replay that does not end proven.
	journal, _ := navigationLoop(t, entryAnswer(true))
	waitFor(t, func() bool { return journal.raiseCount() == 2 })

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if declined := journal.raises[1].DeclinedEntries; len(declined) != 1 || declined[0] != "entry-1" ||
		len(journal.replayed) != 0 {
		t.Fatalf("the second raise declined %v and the host replayed %v", declined, journal.replayed)
	}
}

// twoStepEntryAnswer names a library entry that presses a key, then chooses a label.
func twoStepEntryAnswer() raiseReply {
	entry := `{"id":"entry-2","driver":"codex","goal":{"script":"ChangeModel","version":2,"parameters":[]},` +
		`"steps":[{"fingerprint":"fp1:a","choose":null,"key":"down","proof":null},` +
		`{"fingerprint":"fp1:b","choose":"GPT-6","key":null,"proof":null}],"completes":"goal",` +
		`"nextStep":null,"proof":"GPT-6"}`
	return raiseReply{answer: client.NavigationAnswer{Answer: client.NavigationEntry, Entry: []byte(entry)}}
}

// replayLoop runs a key script that stalls, is answered with the two-step entry and replays it to the given end.
func replayLoop(t *testing.T, replay keyscripts.ReplayResult) *fakeJournal {
	t.Helper()
	return replayLoopAnswered(t, twoStepEntryAnswer(), replay, 2)
}

// replayLoopAnswered runs a key script that stalls, is answered with the entry and replays it to the given end,
// until the journal heard the given number of raises.
func replayLoopAnswered(t *testing.T, entry raiseReply, replay keyscripts.ReplayResult, raises int) *fakeJournal {
	t.Helper()
	journal := &fakeJournal{answers: []raiseReply{entry}}
	runtime := newScriptRuntime()
	runtime.replay = replay
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.raiseRetryDelay = 0
	uncertainty := keyscripts.Uncertainty{Reason: keyscripts.NoEntry, Step: 1, Fingerprint: "fp1:a"}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.NavigationNeeded, Step: 1, Uncertainty: &uncertainty}
	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return journal.raiseCount() == raises })

	return journal
}

func TestAReplayThatFailsAfterItsFirstStepIsReportedStaleAndRaisesAStaleEntryRequest(t *testing.T) {
	live := &keyscripts.Uncertainty{Fingerprint: "fp1:c", Rows: []string{"Pick a model", "> GPT-7"}, Highlight: 1}
	cases := map[keyscripts.UncertaintyReason]int{
		keyscripts.NextFingerprint: 1,
		keyscripts.LabelMissing:    1,
		keyscripts.NoProof:         2,
	}
	for reason, step := range cases {
		journal := replayLoop(t, keyscripts.ReplayResult{
			Outcome: keyscripts.Stale, Step: step, Reason: reason, Uncertainty: live,
		})

		journal.mutex.Lock()
		report, reported := journal.stale["entry-2"]
		raise := journal.raises[1]
		journal.mutex.Unlock()
		if !reported || report.Reason != string(reason) || report.Step != step || report.Build != "0.165.0" ||
			len(report.Rows) != 2 || len(journal.stale) != 1 {
			t.Fatalf("%s: the stale report was %+v (%v)", reason, report, reported)
		}
		if raise.Reason != string(keyscripts.StaleEntry) || raise.StaleEntry != "entry-2" ||
			raise.Fingerprint != "fp1:c" || len(raise.SentSteps) == 0 || raise.SentSteps[0] != "step 1: key down" {
			t.Fatalf("%s: the stale raise was %+v", reason, raise)
		}
		if step == 2 && (len(raise.SentSteps) != 2 || raise.SentSteps[1] != "step 2: choose") {
			t.Fatalf("%s: the sent steps were %v", reason, raise.SentSteps)
		}
	}
}

func TestAReplayThatFailsAtItsFirstStepDeclinesTheEntryAndReportsNothingStale(t *testing.T) {
	journal := replayLoop(t, keyscripts.ReplayResult{
		Outcome: keyscripts.Stale, Step: 0, Reason: keyscripts.Ambiguous,
		Uncertainty: &keyscripts.Uncertainty{Fingerprint: "fp1:a"},
	})

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	raise := journal.raises[1]
	if len(journal.stale) != 0 || raise.Reason != string(keyscripts.NoEntry) || raise.StaleEntry != "" ||
		len(raise.DeclinedEntries) != 1 || raise.DeclinedEntries[0] != "entry-2" || len(raise.SentSteps) != 0 {
		t.Fatalf("a first-step failure reported %v stale and raised %+v", journal.stale, raise)
	}
}

// guardedEntryAnswer is the two-step entry answered as proven on another build only.
func guardedEntryAnswer() raiseReply {
	reply := twoStepEntryAnswer()
	reply.answer.Guarded = true
	return reply
}

func TestAGuardedEntryThatPassesEveryCheckIsReportedReplayedWithNoRequest(t *testing.T) {
	journal := replayLoopAnswered(t, guardedEntryAnswer(), keyscripts.ReplayResult{Outcome: keyscripts.Proven}, 1)
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if len(journal.replayed) != 1 || journal.replayed[0] != "entry-2" || len(journal.raises) != 1 ||
		len(journal.stale) != 0 {
		t.Fatalf("a guarded replay was reported %v after %d raises, stale %v", journal.replayed, len(journal.raises),
			journal.stale)
	}
}

func TestAGuardedEntryThatFailsAfterItsFirstStepIsDeclinedAndNeverReportedStale(t *testing.T) {
	failed := keyscripts.ReplayResult{
		Outcome: keyscripts.Stale, Step: 1, Reason: keyscripts.LabelMissing,
		Uncertainty: &keyscripts.Uncertainty{Fingerprint: "fp1:c"},
	}
	journal := replayLoopAnswered(t, guardedEntryAnswer(), failed, 2)

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	raise := journal.raises[1]
	if len(journal.stale) != 0 || raise.StaleEntry != "" || raise.Reason != string(keyscripts.NoEntry) ||
		len(raise.DeclinedEntries) != 1 || raise.DeclinedEntries[0] != "entry-2" {
		t.Fatalf("a guarded entry's failure reported %v stale and raised %+v", journal.stale, raise)
	}
}

func TestAStepRunByAnOlderBuildsScriptSaysWhichBuildItWas(t *testing.T) {
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return newScriptRuntime(), nil })
	runtime := &liveRuntime{id: "runtime-1", driver: newScriptRuntime(), build: "0.166.0"}
	progress := keyscripts.Progress{Step: 0, Name: "open", Profile: "codex@0.165.0"}

	loop.reportStep(context.Background(), runtime, keyScriptClaim("script", nil), progress)
	progress.Profile = "codex@0.166.0"
	loop.reportStep(context.Background(), runtime, keyScriptClaim("script", nil), progress)

	reports := journal.reportsOf("script")
	if len(reports) != 2 || !strings.Contains(reports[0].Script.Evidence, "(script of codex@0.165.0)") ||
		strings.Contains(reports[1].Script.Evidence, "script of") {
		t.Fatalf("the step evidence was %+v", reports)
	}
}

func TestAWaitingRuntimeAsksAgainUnderANewKeyAndItsOwnReplayFinishesTheScript(t *testing.T) {
	retry := 0
	wait := raiseReply{answer: client.NavigationAnswer{Answer: client.NavigationWait, RetryAfterSeconds: &retry}}
	journal := &fakeJournal{answers: []raiseReply{wait, twoStepEntryAnswer()}}
	runtime := newScriptRuntime()
	runtime.replay = keyscripts.ReplayResult{Outcome: keyscripts.Proven}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	loop.raiseRetryDelay = 0
	uncertainty := keyscripts.Uncertainty{Reason: keyscripts.NoEntry, Step: 1, Fingerprint: "fp1:a"}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.NavigationNeeded, Step: 1, Uncertainty: &uncertainty}

	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if len(journal.raises) != 2 || journal.raises[1].OperationKey != journal.raises[0].OperationKey+":ask:1" ||
		len(journal.replayed) != 1 || journal.reports[len(journal.reports)-1].Progress != "applied" {
		t.Fatalf("after a wait the host raised %+v and replayed %v", journal.raises, journal.replayed)
	}
}

func TestAWaitEndsWhenTheRuntimeIsNoLongerHeld(t *testing.T) {
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return newScriptRuntime(), nil })
	runtime := &liveRuntime{id: "runtime-1", driver: newScriptRuntime(), hold: contracts.HoldNone}
	loop.runtimes[runtime.id] = runtime

	nav := newNavigation(loop, runtime, keyScriptClaim("script", nil), keyscripts.Uncertainty{})
	nav.askAgainAfter(context.Background(), 0)

	if journal.raiseCount() != 0 {
		t.Fatalf("a runtime no longer held raised again")
	}
}
