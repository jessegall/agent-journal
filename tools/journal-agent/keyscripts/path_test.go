package keyscripts

import (
	"errors"
	"testing"
)

func TestAChoiceThenAConfirmationKeyGiveTwoStepsAndNoArrow(t *testing.T) {
	path := ProvenPath{Proof: "Effort: low", Completes: "goal", Actions: []ActionRecord{
		{Kind: "key", Key: "down", Fingerprint: "fp1:a", Replayable: true},
		{Kind: "choose", Label: "low", Fingerprint: "fp1:a", Replayable: true},
		{Kind: "key", Key: "enter", Fingerprint: "fp1:b"},
	}}

	entry, err := path.Entry()

	if err != nil || len(entry.Steps) != 2 {
		t.Fatalf("the path gave %+v, %v", entry, err)
	}
	if *entry.Steps[0].Choose != "low" || entry.Steps[0].Fingerprint != "fp1:a" || *entry.Steps[1].Key != "enter" {
		t.Fatalf("the steps are %+v and %+v", entry.Steps[0], entry.Steps[1])
	}
	if entry.Steps[0].Proof != nil || *entry.Steps[1].Proof != "Effort: low" || entry.Proof != "Effort: low" {
		t.Fatalf("the proof went to %+v", entry)
	}
}

func TestMovesOfTheHighlightBeforeAConfirmGiveOneChooseStep(t *testing.T) {
	path := ProvenPath{Proof: "low", Actions: []ActionRecord{
		{Kind: "key", Key: "down", Fingerprint: "fp1:a", Replayable: true},
		{Kind: "key", Key: "down", Fingerprint: "fp1:a", Replayable: true},
		{Kind: "choose", Label: "low", Fingerprint: "fp1:a", Replayable: true},
	}}

	entry, err := path.Entry()

	if err != nil || len(entry.Steps) != 1 || *entry.Steps[0].Choose != "low" {
		t.Fatalf("the path gave %+v, %v", entry, err)
	}
}

func TestAnEmptySecretOrUnreplayablePathIsRefused(t *testing.T) {
	unreplayable := ProvenPath{Actions: []ActionRecord{{Kind: "choose", Label: "low", Fingerprint: "fp1:a"}}}
	cases := map[error]ProvenPath{
		ErrEmptyPath:        {Actions: []ActionRecord{{Kind: "key", Key: "down"}}},
		ErrSecretPath:       {Secret: true, Actions: []ActionRecord{{Kind: "key", Key: "enter"}}},
		ErrUnreplayablePath: unreplayable,
	}
	for want, path := range cases {
		if _, err := path.Entry(); !errors.Is(err, want) {
			t.Fatalf("the path %+v gave %v, not %v", path, err, want)
		}
	}
}

func TestAnEntryBuiltFromARecordedChoiceReplaysProvenOnTheSameScreen(t *testing.T) {
	runner, _ := codexPicker(t)
	round := runner.Navigate(Round{Generation: liveGeneration(runner), Choose: "GPT-6-Sol"}, 0, Uncertainty{}, nil)
	entry, err := ProvenPath{Actions: round.Actions, Proof: "GPT-6-Sol", Completes: "goal"}.Entry()
	if err != nil {
		t.Fatal(err)
	}
	entry.ID, entry.Goal = "entry-1", EntryGoal{Script: "ChangeModel", Version: 2}

	replayer, menu := codexPicker(t)
	result, err := replayer.Replay(entry, "codex@0.165.0")

	if err != nil || result.Outcome != Proven || menu.chosen == "" {
		t.Fatalf("the built entry replayed %+v, %v, choosing %q", result, err, menu.chosen)
	}
}
