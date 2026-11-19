package keyscripts

import (
	"fmt"
	"strings"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// fakeClock is time that only moves when a run waits.
type fakeClock struct{ now time.Time }

func (clock *fakeClock) Now() time.Time { return clock.now }

func (clock *fakeClock) Sleep(duration time.Duration) { clock.now = clock.now.Add(duration) }

// modelPicker is a program that draws the Codex model picker with the given models and moves its highlight on each
// arrow key, the way the recorded picker does; keys holds every key it was sent.
type modelPicker struct {
	reader      *screen.EmulatorReader
	models      []string
	highlighted int
	keys        []string
	// afterFirstKey replaces the models once the first key arrives, as a list that changes under the moves.
	afterFirstKey []string
}

func (picker *modelPicker) Write(keys []byte) (int, error) {
	picker.keys = append(picker.keys, string(keys))
	if picker.afterFirstKey != nil {
		picker.models, picker.afterFirstKey = picker.afterFirstKey, nil
	}
	if string(keys) == arrowDown && picker.highlighted < len(picker.models)-1 {
		picker.highlighted++
	}
	if string(keys) == arrowUp && picker.highlighted > 0 {
		picker.highlighted--
	}
	picker.draw()

	return len(keys), nil
}

func (picker *modelPicker) draw() {
	rows := []string{"\x1b[H\x1b[2J", "  Select Model and Effort\r\n"}
	for index, model := range picker.models {
		marker := "  "
		if index == picker.highlighted {
			marker = "› "
		}
		rows = append(rows, fmt.Sprintf("%s%d. %-22s A model for the test.\r\n", marker, index+1, model))
	}
	rows = append(rows, "  enter select · esc back\r\n")
	picker.reader.Feed([]byte(strings.Join(rows, "")))
}

// pickerRun draws a picker of these models with the given one highlighted, and a runner that reads it.
func pickerRun(t *testing.T, models []string, highlighted int) (*Runner, *modelPicker) {
	t.Helper()
	layout := profiles.Codex{}.Screens()
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	reader.Feed([]byte("\x1b[?1049h"))
	picker := &modelPicker{reader: reader, models: models, highlighted: highlighted}
	picker.draw()
	clock := &fakeClock{now: time.Unix(0, 0)}
	gate := terminal.NewInputGate(picker, reader, layout.Composer, clock.Now)
	view := screen.NewView(layout, reader)

	return NewRunner(gate, screen.NewClassifier(layout, reader), clock, view, func(Progress) {}), picker
}

var recordedModels = []string{"GPT-6.1-Sol (current)", "GPT-6.1 Terra", "GPT-6-Astra", "GPT-6-Sol", "GPT-6-Luna"}

func TestTheEntryIsFoundByItsNameWhereverTheListPutsIt(t *testing.T) {
	reordered := []string{"GPT-6-Luna", "GPT-6-Sol", "GPT-6.1-Sol (current)", "GPT-6.1 Terra", "GPT-6-Astra"}

	for _, models := range [][]string{recordedModels, reordered} {
		runner, picker := pickerRun(t, models, 2)

		result, err := runner.Run(selectModel(10), map[string]string{"model": "GPT-6-Luna"})
		if err != nil || result.Outcome != Finished {
			t.Fatalf("selecting in %v ended %+v, %v", models, result, err)
		}
		if picker.models[picker.highlighted] != "GPT-6-Luna" {
			t.Fatalf("the highlight ended on %q in %v", picker.models[picker.highlighted], models)
		}
		if moves := len(picker.keys); moves != 2 {
			t.Fatalf("the picker got %d keys, not the two between the highlight and GPT-6-Luna", moves)
		}
	}
}

func TestAnInsertedEntryShiftsTheMovesAndIsNeverTakenInstead(t *testing.T) {
	inserted := []string{"GPT-6.1-Sol (current)", "GPT-7-Nova", "GPT-6.1 Terra", "GPT-6-Astra", "GPT-6-Sol",
		"GPT-6-Luna"}
	runner, picker := pickerRun(t, inserted, 0)

	result, err := runner.Run(selectModel(10), map[string]string{"model": "GPT-6-Luna"})
	if err != nil || result.Outcome != Finished || picker.models[picker.highlighted] != "GPT-6-Luna" {
		t.Fatalf("the selection ended %+v, %v on %q", result, err, picker.models[picker.highlighted])
	}
	if len(picker.keys) != 5 || strings.Join(picker.keys, "") != strings.Repeat(arrowDown, 5) {
		t.Fatalf("the picker got %q, not five moves down", picker.keys)
	}
}

func TestAMissingOrTwiceNamedEntryIsRefusedBeforeAnyKey(t *testing.T) {
	for _, models := range [][]string{recordedModels, {"GPT-6-Luna", "GPT-6-Sol", "GPT-6-Luna"}} {
		runner, picker := pickerRun(t, models, 0)
		wanted := map[string]string{"model": "GPT-6-Luna"}
		if len(models) == len(recordedModels) {
			wanted["model"] = "GPT-9-Nova"
		}

		result, err := runner.Run(selectModel(10), wanted)
		if err != nil || result.Outcome != EntryUnavailable || len(picker.keys) != 0 {
			t.Fatalf("selecting %q in %v ended %+v, %v after keys %q", wanted["model"], models, result, err, picker.keys)
		}
	}
}

func TestAListThatChangesUnderTheMovesStopsTheSelection(t *testing.T) {
	runner, picker := pickerRun(t, recordedModels, 0)
	picker.afterFirstKey = []string{"GPT-7-Nova", "GPT-6.1-Sol (current)", "GPT-6.1 Terra", "GPT-6-Astra", "GPT-6-Sol",
		"GPT-6-Luna"}

	result, err := runner.Run(selectModel(10), map[string]string{"model": "GPT-6-Luna"})
	if err != nil || result.Outcome != EntryUnavailable || len(picker.keys) != 1 {
		t.Fatalf("a changed list ended %+v, %v after keys %q", result, err, picker.keys)
	}
}

func TestTheHighlightMovesUpToAnEntryAboveIt(t *testing.T) {
	runner, picker := pickerRun(t, recordedModels, 4)

	result, err := runner.Run(selectModel(10), map[string]string{"model": "GPT-6.1-Sol"})
	if err != nil || result.Outcome != Finished || strings.Join(picker.keys, "") != strings.Repeat(arrowUp, 4) {
		t.Fatalf("moving up ended %+v, %v after keys %q", result, err, picker.keys)
	}
}
