package serving

import (
	"context"
	"sync"
	"testing"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/keyscripts"
	"journal-agent/screen"
)

// scriptRuntime is a terminal runtime whose key script confirms its steps and then waits until the test ends it.
type scriptRuntime struct {
	fakeRuntime
	mutex    sync.Mutex
	runs     []contracts.KeyScriptRequest
	receiver func(keyscripts.Progress)
	release  chan keyscripts.Result
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
	loop := NewLoop(journal, func(string, client.Grant) (Runtime, error) { return runtime, nil })

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
		loop := NewLoop(journal, func(string, client.Grant) (Runtime, error) { return runtime, nil })
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
	loop := NewLoop(journal, func(string, client.Grant) (Runtime, error) { return runtime, nil })
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
	loop := NewLoop(journal, func(string, client.Grant) (Runtime, error) { return runtime, nil })
	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 3 })

	loop.Take(context.Background(), []client.ClaimedRequest{claimed("stop", 2, "stop", "")})

	if !runtime.stopped || journal.progressOf("stop")[0] != "applied" {
		t.Fatalf("the stop was not taken while the script waited: %v", journal.progressOf("stop"))
	}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.Paused, Step: 2}
}

func TestARunThatNeedsNavigationEndsEntryUnavailableAndHoldsTheRuntimeWithoutRows(t *testing.T) {
	journal := &fakeJournal{}
	runtime := newScriptRuntime()
	loop := NewLoop(journal, func(string, client.Grant) (Runtime, error) { return runtime, nil })
	uncertainty := keyscripts.Uncertainty{Reason: keyscripts.NoEntry, Step: 1, Rows: []string{"Pick a colour"}}
	runtime.release <- keyscripts.Result{Outcome: keyscripts.NavigationNeeded, Step: 1, Uncertainty: &uncertainty}

	loop.Take(context.Background(), []client.ClaimedRequest{keyScriptClaim("script", nil)})
	waitFor(t, func() bool { return len(journal.reportsOf("script")) == 4 })

	last := journal.reportsOf("script")[3]
	want := client.ScriptReport{Step: 1, Generation: 1, Evidence: "navigation-needed: no-entry"}
	if last.Progress != "failed" || last.Outcome == nil || *last.Outcome != "entry_unavailable" ||
		last.Script == nil || *last.Script != want {
		t.Fatalf("a run that needs navigation was reported %+v", last)
	}
	waitFor(t, func() bool {
		journal.mutex.Lock()
		defer journal.mutex.Unlock()
		return len(journal.holds) == 2
	})
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if journal.holds[1] != "navigation_needed" || journal.activity[1] != "idle" {
		t.Fatalf("the runtime was reported %v holding %v", journal.activity, journal.holds)
	}
}
