package serving

import (
	"context"
	"sync"
	"testing"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/keyscripts"
)

// roundRuntime is a stalled terminal runtime whose rounds end as the test sets.
type roundRuntime struct {
	fakeRuntime
	mutex  sync.Mutex
	rounds []keyscripts.Round
	result keyscripts.RoundResult
}

func (runtime *roundRuntime) NavigateRound(round keyscripts.Round) keyscripts.RoundResult {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()
	runtime.rounds = append(runtime.rounds, round)
	return runtime.result
}

func (runtime *roundRuntime) roundCount() int {
	runtime.mutex.Lock()
	defer runtime.mutex.Unlock()
	return len(runtime.rounds)
}

func navigateClaim(id string, sequence int) client.ClaimedRequest {
	navigation := "navigation-1"
	choose := "low"
	return client.ClaimedRequest{
		RuntimeID:           "runtime",
		RequestID:           id,
		Sequence:            sequence,
		Attempt:             1,
		Operation:           "navigate",
		NavigationRequestID: &navigation,
		NavigationRound: &client.NavigationRound{
			NavigationRequestID: navigation,
			RowVersion:          2,
			Generation:          7,
			Choose:              &choose,
		},
	}
}

// heldLoop is a loop whose runtime is held for a navigation, as a stalled key script leaves it.
func heldLoop(runtime Runtime) (*Loop, *fakeJournal) {
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(string, host.PreparedStart) (Runtime, error) { return runtime, nil })
	live, _ := loop.runtimeOf(context.Background(), "runtime")
	loop.holdRuntime(live)

	return loop, journal
}

func TestARoundIsAdmittedWhileHeldAndReportedWithTheScreenAfterIt(t *testing.T) {
	runtime := &roundRuntime{result: keyscripts.RoundResult{
		ScreenAfter: &keyscripts.Uncertainty{Rows: []string{"Effort: low"}, Highlight: 2, Generation: 8},
		Actions:     []keyscripts.ActionRecord{{Kind: "choose", Label: "low", Fingerprint: "fp1:a"}},
	}}
	loop, journal := heldLoop(runtime)

	requests := []client.ClaimedRequest{claimed("held", 1, "deliver", "waits"), navigateClaim("round", 2)}
	loop.Take(context.Background(), requests)
	waitFor(t, func() bool { return len(journal.reportsOf("round")) == 1 })

	report := journal.reportsOf("round")[0]
	if report.Progress != "applied" || report.Navigation == nil || report.Navigation.Generation != 8 ||
		report.Navigation.Actions[0].Label != "low" {
		t.Fatalf("the round was reported %+v", report)
	}
	if runtime.rounds[0].Choose != "low" || runtime.rounds[0].Generation != 7 || len(runtime.prompts) != 0 {
		t.Fatalf("the round ran as %+v and the held delivery got %q", runtime.rounds, runtime.prompts)
	}
}

func TestATypingUserInterruptsTheNavigation(t *testing.T) {
	runtime := &roundRuntime{result: keyscripts.RoundResult{Paused: true}}
	loop, journal := heldLoop(runtime)

	loop.Take(context.Background(), []client.ClaimedRequest{navigateClaim("round", 1)})
	waitFor(t, func() bool { return len(journal.reportsOf("round")) == 1 })

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if len(journal.interrupts) != 1 || journal.interrupts[0] != "navigation-1" {
		t.Fatalf("the interrupts reported were %v", journal.interrupts)
	}
}

func TestAStalledRuntimeBlocksNeitherAnotherRuntimeNorAStop(t *testing.T) {
	stalled := &roundRuntime{}
	other := &fakeRuntime{}
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, func(runtimeID string, _ host.PreparedStart) (Runtime, error) {
		if runtimeID == "stalled" {
			return stalled, nil
		}
		return other, nil
	})
	held, _ := loop.runtimeOf(context.Background(), "stalled")
	loop.holdRuntime(held)
	waiting := claimed("waiting", 1, "deliver", "behind the menu")
	waiting.RuntimeID = "stalled"
	delivery := claimed("delivery", 1, "deliver", "go on")
	delivery.RuntimeID = "other"
	stop := claimed("stop", 2, "stop", "")
	stop.RuntimeID = "stalled"

	loop.Take(context.Background(), []client.ClaimedRequest{waiting, delivery})
	loop.Take(context.Background(), []client.ClaimedRequest{stop})

	if len(other.prompts) != 1 || other.prompts[0] != "go on" || !stalled.stopped || len(stalled.prompts) != 0 {
		t.Fatalf("the other runtime got %q, the stalled one was stopped %v and got %q", other.prompts, stalled.stopped,
			stalled.prompts)
	}
	if stalled.roundCount() != 0 {
		t.Fatal("a round ran that nobody sent")
	}
}
