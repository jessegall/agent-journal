package keyscripts

import (
	"bytes"
	"strings"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// codexPicker replays the recorded Codex /model picker until it is drawn and still, before the first recorded arrow
// at seven seconds, so each recorded move answers one of the runner's keys.
func codexPicker(t *testing.T) (*Runner, *bytes.Buffer) {
	t.Helper()
	layout := profiles.Codex{}.Screens()
	fixture, err := recording.Load("../testdata/recordings/codex/0.165.0/keyscripts/model-and-status")
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	clock := &replayClock{now: time.Unix(0, 0), start: time.Unix(0, 0), reader: reader, fixture: fixture}
	clock.Sleep(6500 * time.Millisecond)
	program := &bytes.Buffer{}
	gate := terminal.NewInputGate(program, reader, layout.Composer, clock.Now)
	options := screen.OptionList{Markers: []string{"› "}}
	highlight := func() string {
		text, _ := options.Highlighted(reader.Snapshot())

		return text
	}

	return NewRunner(gate, screen.NewClassifier(layout, reader), clock, highlight, func(Progress) {}), program
}

func selectModel(budget int) KeyScript {
	picker := Expectation{Kind: screen.MenuShown, Menu: "model-picker"}

	return KeyScript{Name: "select-model", Version: 1, Profile: "codex@0.165.0", Steps: []KeyStep{{
		Name:       "find the model",
		Expect:     picker,
		Action:     SelectEntry,
		Parameter:  "model",
		Deadline:   2 * time.Second,
		MoveBudget: budget,
	}}}
}

func TestSelectingAnEntryMovesOneKeyPerConfirmedMoveUntilTheEntryIsHighlighted(t *testing.T) {
	runner, program := codexPicker(t)

	result, err := runner.Run(selectModel(10), map[string]string{"model": "GPT-5.6-Luna"})
	if err != nil || result.Outcome != Finished {
		t.Fatalf("the selection ended %+v, %v", result, err)
	}
	if moves := strings.Count(program.String(), arrowDown); moves != 7 || program.Len() != 7*len(arrowDown) {
		t.Fatalf("the program got %q, not the seven recorded down arrows", program.String())
	}
}

func TestAMissingEntryIsUnavailableAndNoNeighbourIsTaken(t *testing.T) {
	runner, program := codexPicker(t)

	result, err := runner.Run(selectModel(10), map[string]string{"model": "GPT-9-Nova"})
	if err != nil || result.Outcome != EntryUnavailable {
		t.Fatalf("a missing entry ended %+v, %v", result, err)
	}
	if strings.Contains(program.String(), "\r") {
		t.Fatalf("a neighbour was chosen: the program got %q", program.String())
	}
}
