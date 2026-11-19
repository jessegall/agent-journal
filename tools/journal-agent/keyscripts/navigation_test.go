package keyscripts

import (
	"strings"
	"testing"
)

// liveGeneration is the generation of the screen as the round's runner reads it now, as a round would answer it.
func liveGeneration(runner *Runner) uint64 {
	return runner.screen.Classify(runner.clock.Now()).Generation
}

func TestAChooseIsSentThroughTheLabelHelperAndRecordedByItsLabel(t *testing.T) {
	runner, menu := codexPicker(t)

	result := runner.Navigate(Round{Generation: liveGeneration(runner), Choose: "GPT-6-Sol"}, 0, Uncertainty{}, nil)

	if result.Refusal != "" || !strings.HasPrefix(menu.chosen, "4. GPT-6-Sol ") || len(result.Actions) != 1 {
		t.Fatalf("the choose ended %+v, choosing %q", result, menu.chosen)
	}
	if action := result.Actions[0]; action.Kind != "choose" || action.Label != "GPT-6-Sol" || action.Fingerprint == "" {
		t.Fatalf("the choose was recorded as %+v", action)
	}
	if result.ScreenAfter == nil || len(result.ScreenAfter.Rows) == 0 {
		t.Fatalf("the round reported no screen after it: %+v", result.ScreenAfter)
	}
}

func TestAConfirmOfAnotherEntryThanTheHighlightedOneSendsNoKey(t *testing.T) {
	runner, menu := codexPicker(t)

	result := runner.Navigate(Round{Generation: liveGeneration(runner), Confirm: "GPT-6-Sol"}, 0, Uncertainty{}, nil)

	if result.Refusal != string(HighlightWrong) || menu.sent() != "" {
		t.Fatalf("the confirm ended %+v after %q", result, menu.sent())
	}
}

func TestARawEnterOnAMenuIsRefusedAndAnArrowIsSent(t *testing.T) {
	runner, menu := codexPicker(t)

	refused := runner.Navigate(Round{Generation: liveGeneration(runner), Keys: []string{"enter"}}, 0, Uncertainty{}, nil)
	if refused.Refusal != RefusedKeyOnMenu || menu.sent() != "" {
		t.Fatalf("a raw enter on the picker ended %+v after %q", refused, menu.sent())
	}

	moved := runner.Navigate(Round{Generation: liveGeneration(runner), Keys: []string{"down"}}, 0, Uncertainty{}, nil)
	if moved.Refusal != "" || menu.sent() != arrowDown || moved.Actions[0].Key != "down" {
		t.Fatalf("a down arrow ended %+v after %q", moved, menu.sent())
	}
}

func TestAChangedScreenOrThePersonsInputSendsNoKey(t *testing.T) {
	runner, menu := codexPicker(t)
	stale := Round{Generation: liveGeneration(runner) + 1, Keys: []string{"down"}}
	if result := runner.Navigate(stale, 0, Uncertainty{}, nil); result.Refusal != RefusedScreenChanged {
		t.Fatalf("an older generation ended %+v", result)
	}

	current := Round{Generation: liveGeneration(runner), Keys: []string{"down"}}
	if result := runner.Navigate(current, 1, Uncertainty{}, nil); result.Refusal != RefusedScreenChanged {
		t.Fatalf("a round the person's input came after ended %+v", result)
	}
	if menu.sent() != "" {
		t.Fatalf("the program got %q", menu.sent())
	}
}

func TestAPersonTypingPausesTheRound(t *testing.T) {
	runner, menu := codexPicker(t)
	if err := runner.gate.Human([]byte("x")); err != nil {
		t.Fatal(err)
	}
	epoch := runner.gate.HumanInputs()

	result := runner.Navigate(Round{Generation: liveGeneration(runner), Keys: []string{"down"}}, epoch, Uncertainty{}, nil)

	if !result.Paused || strings.Contains(menu.sent(), arrowDown) {
		t.Fatalf("a typing person left the round %+v after %q", result, menu.sent())
	}
}

func TestAProofIsSeenOnlyWhenTheLiveRowsShowItAndTheStalledScreenDidNot(t *testing.T) {
	runner, _ := drawnRun(t, "\x1b[2;1HModel: GPT-6 (current)")
	generation := liveGeneration(runner)

	seen := runner.Navigate(Round{Generation: generation, Proof: "GPT-6"}, 0, Uncertainty{}, nil)
	missing := runner.Navigate(Round{Generation: liveGeneration(runner), Proof: "GPT-5"}, 0, Uncertainty{}, nil)
	already := Uncertainty{HostRows: []string{"Model: GPT-6"}}
	shown := runner.Navigate(Round{Generation: liveGeneration(runner), Proof: "GPT-6"}, 0, already, nil)

	if !seen.ProofSeen || missing.ProofSeen || shown.ProofSeen || shown.Refusal != RefusedProofShown {
		t.Fatalf("the proofs ended %+v, %+v and %+v", seen, missing, shown)
	}
}
