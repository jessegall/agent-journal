package keyscripts

import (
	"slices"
	"strings"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// codexPicker replays the recorded Codex /model picker until it is drawn and still, before the first recorded arrow
// at seven seconds, and from there the menu answers the runner's keys itself.
func codexPicker(t *testing.T) (*Runner, *liveMenu) {
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
	clock.next = len(fixture.Output)
	options := screen.OptionList{Markers: []string{"› "}}
	menu := newLiveMenu(t, reader, options)
	gate := terminal.NewInputGate(menu, reader, layout.Composer, clock.Now)
	view := optionsView{reader: reader, options: options}

	return NewRunner(gate, screen.NewClassifier(layout, reader), clock, view, Driver{Name: "codex", Layout: layout},
		func(Progress) {}), menu
}

func selectModel() KeyScript {
	picker := Expectation{Kind: screen.MenuShown, Menu: "model-picker"}

	return KeyScript{Name: "select-model", Version: 1, Profile: "codex@0.165.0", Steps: []KeyStep{{
		Name:      "find the model",
		Expect:    picker,
		Action:    SelectEntry,
		Parameter: "model",
		Deadline:  2 * time.Second,
	}}}
}

func chooseModel(label string) KeyScript {
	return KeyScript{Name: "choose-model", Version: 1, Profile: "codex@0.165.0", Steps: []KeyStep{
		Choose("model-picker", label, 2*time.Second),
	}}
}

func selected(t *testing.T, runner *Runner, model string) Result {
	t.Helper()
	result, err := runner.Run(selectModel(), map[string]string{"model": model})
	if err != nil {
		t.Fatalf("the selection of %s failed: %v", model, err)
	}

	return result
}

func TestSelectingAnEntryMovesFromTheHighlightToTheEntryWithItsLabel(t *testing.T) {
	runner, menu := codexPicker(t)

	result := selected(t, runner, "GPT-5.6-Luna")
	if result.Outcome != Finished || !strings.HasPrefix(menu.highlightedLabel(), "8. GPT-5.6-Luna") {
		t.Fatalf("the selection ended %+v on %q", result, menu.highlightedLabel())
	}
	if menu.sent() != strings.Repeat(arrowDown, 7) {
		t.Fatalf("the program got %q, not the seven down arrows between the highlight and the entry", menu.sent())
	}
}

func TestAnEntryAboveTheHighlightIsReachedWithUpArrows(t *testing.T) {
	runner, menu := codexPicker(t)
	menu.show(menu.labels, 7)

	result := selected(t, runner, "GPT-6.1 Terra")
	if result.Outcome != Finished || menu.highlighted != 1 || menu.sent() != strings.Repeat(arrowUp, 6) {
		t.Fatalf("the selection ended %+v on %q after %q", result, menu.highlightedLabel(), menu.sent())
	}
}

func TestAReorderedListIsFollowedByLabelNotByPosition(t *testing.T) {
	runner, menu := codexPicker(t)
	reordered := slices.Clone(menu.labels)
	slices.Reverse(reordered)
	menu.show(reordered, 0)

	result := selected(t, runner, "GPT-6-Sol")
	if result.Outcome != Finished || !strings.HasPrefix(menu.highlightedLabel(), "4. GPT-6-Sol ") {
		t.Fatalf("the selection ended %+v on %q", result, menu.highlightedLabel())
	}
	if menu.sent() != strings.Repeat(arrowDown, 4) {
		t.Fatalf("the program got %q, not the four down arrows of the reordered list", menu.sent())
	}
}

func TestAnInsertedEntryShiftsTheMovesAndCanItselfBeChosen(t *testing.T) {
	runner, menu := codexPicker(t)
	inserted := slices.Insert(slices.Clone(menu.labels), 1, "9. GPT-7-Nova            New model for everything.")
	menu.show(inserted, 0)

	moved := selected(t, runner, "GPT-5.6-Luna")
	if moved.Outcome != Finished || menu.sent() != strings.Repeat(arrowDown, 8) {
		t.Fatalf("the selection ended %+v after %q, not eight down arrows", moved, menu.sent())
	}

	result, err := runner.Run(chooseModel("GPT-7-Nova"), nil)
	if err != nil || result.Outcome != Finished || menu.chosen != inserted[1] {
		t.Fatalf("choosing the inserted entry ended %+v, %v and chose %q", result, err, menu.chosen)
	}
}

// neededNavigation fails the test unless the run stopped for navigation for the reason, with no Enter sent.
func neededNavigation(t *testing.T, result Result, err error, reason UncertaintyReason, menu *liveMenu) {
	t.Helper()
	if err != nil || result.Outcome != NavigationNeeded || result.Uncertainty == nil {
		t.Fatalf("the run ended %+v, %v", result, err)
	}
	if result.Uncertainty.Reason != reason || len(result.Uncertainty.Rows) == 0 {
		t.Fatalf("the run stopped with %+v, not %s", result.Uncertainty, reason)
	}
	if strings.Contains(menu.sent(), enterKey) || menu.chosen != "" {
		t.Fatalf("the program got %q and chose %q", menu.sent(), menu.chosen)
	}
}

func TestAMissingLabelSendsNoKeyAndNoNeighbourIsTaken(t *testing.T) {
	for _, missing := range []string{"GPT-9-Nova", "GPT-6", "Luna"} {
		runner, menu := codexPicker(t)

		result, err := runner.Run(chooseModel(missing), nil)
		neededNavigation(t, result, err, LabelMissing, menu)
		if menu.sent() != "" {
			t.Fatalf("the missing %q sent %q", missing, menu.sent())
		}
	}
}

func TestALabelTwoEntriesHoldNeedsNavigationAndSendsNoKey(t *testing.T) {
	runner, menu := codexPicker(t)
	twice := slices.Insert(slices.Clone(menu.labels), 1, "9. GPT-6-Sol             The same name again.")
	menu.show(twice, 0)

	result, err := runner.Run(chooseModel("GPT-6-Sol"), nil)
	neededNavigation(t, result, err, Ambiguous, menu)
	if menu.sent() != "" {
		t.Fatalf("an ambiguous label sent %q", menu.sent())
	}
}

func TestAHighlightThatSkipsPastTheEntryIsNeverConfirmed(t *testing.T) {
	runner, menu := codexPicker(t)
	menu.stride = 2

	result, err := runner.Run(chooseModel("GPT-6-Sol"), nil)
	neededNavigation(t, result, err, HighlightWrong, menu)
	if menu.sent() != arrowDown {
		t.Fatalf("the skipping highlight got %q", menu.sent())
	}
}
