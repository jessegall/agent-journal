package keyscripts

import (
	"errors"
	"time"

	"journal-agent/screen"
	"journal-agent/terminal"
)

// Outcome is how a script run ended.
type Outcome string

const (
	// Finished is a run whose every step saw its screen and took its action.
	Finished Outcome = "finished"
	// Paused is a run the person's keys stopped; it resumes only from a freshly matched checkpoint.
	Paused Outcome = "paused"
	// ScriptFailed is a run whose step did not see its screen in time; no later key was sent.
	ScriptFailed Outcome = "script-failed"
	// WaitingForHuman is a run that reached a step for the person to act.
	WaitingForHuman Outcome = "waiting-for-human"
	// EntryUnavailable is a run whose wanted entry the menu on screen did not show by its label, or showed more than
	// once: no key was sent for it and nothing was chosen.
	EntryUnavailable Outcome = "entry-unavailable"
)

// Result is where a run stopped: its outcome, the step it stopped at and the last reading it saw; Proven is set on a
// finished run of a script that proves its result.
type Result struct {
	Outcome Outcome
	Step    int
	Name    string
	Seen    screen.Classification
	Proven  bool
}

// Progress is one confirmed step, as the run reports it under its driver request: no key text, only what was seen.
type Progress struct {
	Step int
	Name string
	Seen screen.Classification
}

// Screen is what the runner reads a program's screen with.
type Screen interface {
	Classify(now time.Time) screen.Classification
	Forget()
}

// Clock is the time a run waits on; a replay advances it by feeding the recording.
type Clock interface {
	Now() time.Time
	Sleep(duration time.Duration)
}

// errEntryNotShown is a label the menu on screen shows on no entry, or on more than one.
var errEntryNotShown = errors.New("the menu on screen shows no single entry with that label")

// errHighlightAstray is a highlight that did not move one entry toward the wanted entry after a key.
var errHighlightAstray = errors.New("the highlight did not move one entry toward the wanted entry")

// pollInterval is how often a waiting step reads the screen again.
const pollInterval = 50 * time.Millisecond

// Runner runs key scripts one step at a time through the input gate, reporting each confirmed step.
type Runner struct {
	gate   *terminal.InputGate
	screen Screen
	clock  Clock
	view   View
	report func(Progress)
}

// View is what a run reads besides the screen's kind: the screen's rows and the entries of the menu on it, none
// while no readable menu is drawn.
type View interface {
	Rows() []string
	MenuEntries() screen.MenuEntries
}

// NewRunner runs scripts through the gate, reading the screen's kind from screen and its words and menus from view.
func NewRunner(gate *terminal.InputGate, screen Screen, clock Clock, view View, report func(Progress)) *Runner {
	return &Runner{gate: gate, screen: screen, clock: clock, view: view, report: report}
}

// Run starts the script from its first step with the given parameter values.
func (runner *Runner) Run(script KeyScript, values map[string]string) (Result, error) {
	return runner.from(script, 0, values)
}

// Resume goes on from a stopped step, but only once that step's screen is read afresh; nothing it saw before counts.
func (runner *Runner) Resume(script KeyScript, step int, values map[string]string) (Result, error) {
	runner.screen.Forget()

	return runner.from(script, step, values)
}

func (runner *Runner) from(script KeyScript, first int, values map[string]string) (Result, error) {
	for index := first; index < len(script.Steps); index++ {
		step := script.Steps[index]
		seen, matched := runner.waitFor(step.Expect, step.Deadline, values)
		if !matched {
			return Result{Outcome: ScriptFailed, Step: index, Name: step.Name, Seen: seen}, nil
		}
		if step.Action == WaitForHuman {
			return Result{Outcome: WaitingForHuman, Step: index, Name: step.Name, Seen: seen}, nil
		}

		if err := runner.act(step, values); err != nil {
			outcome, cause := stoppedBy(err)

			return Result{Outcome: outcome, Step: index, Name: step.Name, Seen: seen}, cause
		}
		runner.report(Progress{Step: index, Name: step.Name, Seen: seen})
	}

	return Result{Outcome: Finished, Step: len(script.Steps), Proven: script.ProvesResult}, nil
}

// waitFor reads the screen until it is the expected one or the deadline passes; it never sleeps without reading.
func (runner *Runner) waitFor(
	expect Expectation,
	deadline time.Duration,
	values map[string]string,
) (screen.Classification, bool) {
	until := runner.clock.Now().Add(deadline)

	for {
		seen := runner.screen.Classify(runner.clock.Now())
		if expect.matches(seen, runner.view.Rows, values) {
			return seen, true
		}
		if !runner.clock.Now().Before(until) {
			return seen, false
		}
		runner.clock.Sleep(pollInterval)
	}
}

// stoppedBy is the outcome of a run whose step failed with err, and the error the run gives back, if any.
func stoppedBy(err error) (Outcome, error) {
	switch {
	case errors.Is(err, terminal.ErrPersonTyping):
		return Paused, nil
	case errors.Is(err, errEntryNotShown):
		return EntryUnavailable, nil
	case errors.Is(err, errHighlightAstray):
		return ScriptFailed, nil
	default:
		return ScriptFailed, err
	}
}

// selectEntry reads the menu on screen, finds the step's entry and presses the arrow toward it once per entry
// between it and the highlighted one: down or up in a list, right or left on a slider. Each move waits for the
// highlight to move one entry closer, read afresh, so it ends only on a reading whose highlighted entry is the
// wanted one. An entry the menu does not show sends no key, and a highlight that goes anywhere else stops the
// moves; no other entry is ever taken in its place.
func (runner *Runner) selectEntry(step KeyStep, values map[string]string) error {
	entries := runner.view.MenuEntries()
	distance, err := distanceTo(step, entries, values)
	if err != nil {
		return err
	}

	for distance != 0 {
		move, key := towards(entries, distance)
		if err := runner.gate.Keys(key); err != nil {
			return err
		}
		moved, found := runner.highlightMoves(entries.HighlightedLabel(), step.Deadline)
		if !found {
			return errHighlightAstray
		}
		next, err := distanceTo(step, moved, values)
		if err != nil {
			return err
		}
		if next != distance-move {
			return errHighlightAstray
		}
		entries, distance = moved, next
	}

	return nil
}

// distanceTo is how many entries the step's entry lies after the highlighted entry; before it is negative.
func distanceTo(step KeyStep, entries screen.MenuEntries, values map[string]string) (int, error) {
	target, err := step.target(entries, values)
	if err != nil {
		return 0, err
	}

	return target - entries.Highlighted, nil
}

// towards is the move one entry nearer an entry that lies distance away, and the key that makes it.
func towards(entries screen.MenuEntries, distance int) (int, string) {
	forward, backward := arrowDown, arrowUp
	if entries.Across {
		forward, backward = arrowRight, arrowLeft
	}
	if distance < 0 {
		return -1, backward
	}

	return 1, forward
}

// highlightMoves waits until the menu shows another highlighted entry than before, within the deadline, and gives
// that reading.
func (runner *Runner) highlightMoves(before string, deadline time.Duration) (screen.MenuEntries, bool) {
	until := runner.clock.Now().Add(deadline)

	for runner.clock.Now().Before(until) {
		runner.clock.Sleep(pollInterval)
		entries := runner.view.MenuEntries()
		if len(entries.Labels) > 0 && entries.HighlightedLabel() != before {
			return entries, true
		}
	}

	return screen.MenuEntries{}, false
}

func (runner *Runner) act(step KeyStep, values map[string]string) error {
	switch step.Action {
	case PressKey, Scroll:
		return runner.gate.Keys(step.Keys)
	case TypeText:
		value, err := step.parameterValue(values)
		if err != nil {
			return err
		}

		return runner.gate.Keys(value)
	case SelectEntry:
		return runner.selectEntry(step, values)
	case ChooseEntry:
		if err := runner.selectEntry(step, values); err != nil {
			return err
		}

		return runner.gate.Keys(enterKey)
	default:
		return nil
	}
}
