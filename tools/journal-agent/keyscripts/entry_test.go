package keyscripts

import (
	"slices"
	"strings"
	"testing"

	"journal-agent/profiles"
	"journal-agent/screen"
)

// pickerEntry is a library entry built by hand from the recorded Codex model picker: on the picker's screen, choose
// GPT-6-Sol, proven by its label on the screen.
func pickerEntry(t *testing.T, menu *liveMenu) Entry {
	t.Helper()
	// The entry is taken on the fake menu's own drawing, which every later screen of these tests is drawn with.
	menu.draw()
	fingerprint := screen.Fingerprint(profiles.Codex{}.Screens(), "codex", menu.reader.Snapshot(), "model-picker")
	label := "GPT-6-Sol"

	return Entry{
		ID:        "entry-1",
		Driver:    "codex",
		Goal:      EntryGoal{Script: "ChangeModel", Version: 2, Parameters: []EntryParameter{{Name: "model", Value: label}}},
		Steps:     []EntryStep{{Fingerprint: fingerprint, Choose: &label}},
		Completes: "goal",
		Proof:     "GPT-6-Sol",
	}
}

func TestAnEntryFromTheRecordedPickerReplaysAndIsProven(t *testing.T) {
	runner, menu := codexPicker(t)

	result, err := runner.Replay(pickerEntry(t, menu), "codex@0.165.0")

	if err != nil || result.Outcome != Proven || result.ResumeAt != nil {
		t.Fatalf("the replay ended %+v, %v", result, err)
	}
	if !strings.HasPrefix(menu.chosen, "4. GPT-6-Sol ") || strings.Contains(menu.sent(), arrowUp) {
		t.Fatalf("the replay chose %q after %q", menu.chosen, menu.sent())
	}
}

func TestAReorderedOrLongerPickerStillGetsTheSameLabel(t *testing.T) {
	for _, change := range []func([]string) []string{
		func(labels []string) []string { slices.Reverse(labels); return labels },
		func(labels []string) []string { return slices.Insert(labels, 1, "9. GPT-7-Nova            New model.") },
	} {
		runner, menu := codexPicker(t)
		entry := pickerEntry(t, menu)
		labels := change(slices.Clone(menu.labels))
		// The fake menu draws its footer a row lower per added entry; a blank row above the list makes room, so the
		// footer stays on the 40-row screen, a blank row below the list, as the program keeps it.
		menu.above = menu.above[:len(menu.above)-(len(labels)-len(menu.labels))]
		menu.show(labels, 0)

		result, err := runner.Replay(entry, "codex@0.165.0")

		if err != nil || result.Outcome != Proven || !strings.HasPrefix(menu.chosen, "4. GPT-6-Sol ") {
			t.Fatalf("the replay ended %+v, %v, choosing %q", result, err, menu.chosen)
		}
	}
}

func TestARewordedTitleStopsTheReplayBeforeAnyKey(t *testing.T) {
	runner, menu := codexPicker(t)
	entry := pickerEntry(t, menu)
	menu.above = slices.Clone(menu.above)
	title := slices.IndexFunc(menu.above, func(row string) bool { return strings.TrimSpace(row) != "" })
	menu.above[title] = "  Pick the model for this thread"
	menu.draw()

	result, err := runner.Replay(entry, "codex@0.165.0")

	if err != nil || result.Outcome != Stale || result.Reason != NextFingerprint || result.Step != 0 {
		t.Fatalf("the reworded picker ended %+v, %v", result, err)
	}
	if result.Uncertainty == nil || len(result.Uncertainty.Rows) == 0 || menu.sent() != "" {
		t.Fatalf("the stale replay sent %q and reported %+v", menu.sent(), result.Uncertainty)
	}
}

func TestAnEntryThatCompletesAStepSaysWhereTheScriptGoesOn(t *testing.T) {
	runner, menu := codexPicker(t)
	entry := pickerEntry(t, menu)
	next := 3
	entry.Completes, entry.NextStep = "step", &next

	result, err := runner.Replay(entry, "codex@0.165.0")

	if err != nil || result.Outcome != Proven || result.ResumeAt == nil || *result.ResumeAt != 3 {
		t.Fatalf("the replay ended %+v, %v", result, err)
	}
}

func TestAnEntryWithAnUnnamedKeyIsRefused(t *testing.T) {
	arrow := "down"
	entry := Entry{ID: "entry-2", Steps: []EntryStep{{Fingerprint: "fp1:a", Key: &arrow}}}

	if _, err := entry.Script("codex@0.165.0"); err == nil {
		t.Fatal("an entry pressing an arrow was compiled")
	}
}
