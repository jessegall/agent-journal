package keyscripts

import (
	"errors"
	"fmt"
	"slices"
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
	// EntryUnavailable is a run whose wanted entry was not in the menu: the highlight reached the end, wrapped round
	// or used up its move budget, and nothing was chosen.
	EntryUnavailable Outcome = "entry-unavailable"
)

// Result is where a run stopped: its outcome, the step it stopped at and the last reading it saw.
type Result struct {
	Outcome Outcome
	Step    int
	Name    string
	Seen    screen.Classification
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

// pollInterval is how often a waiting step reads the screen again.
const pollInterval = 50 * time.Millisecond

// Runner runs key scripts one step at a time through the input gate, reporting each confirmed step.
type Runner struct {
	gate   *terminal.InputGate
	screen Screen
	clock  Clock
	menu   func() (screen.MenuEntries, bool)
	report func(Progress)
}

// NewRunner runs scripts through the gate; menu reads the entries of the menu on screen and its highlighted one.
func NewRunner(
	gate *terminal.InputGate,
	screen Screen,
	clock Clock,
	menu func() (screen.MenuEntries, bool),
	report func(Progress),
) *Runner {
	return &Runner{gate: gate, screen: screen, clock: clock, menu: menu, report: report}
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
		seen, matched := runner.waitFor(step.Expect, step.Deadline)
		if !matched {
			return Result{Outcome: ScriptFailed, Step: index, Name: step.Name, Seen: seen}, nil
		}
		if step.Action == WaitForHuman {
			return Result{Outcome: WaitingForHuman, Step: index, Name: step.Name, Seen: seen}, nil
		}
		if step.Action == SelectEntry {
			if selected, err := runner.selectEntry(step, values); err != nil || !selected {
				return Result{Outcome: EntryUnavailable, Step: index, Name: step.Name, Seen: seen}, err
			}
			runner.report(Progress{Step: index, Name: step.Name, Seen: seen})

			continue
		}

		err := runner.act(step, values)
		if errors.Is(err, terminal.ErrPersonTyping) {
			return Result{Outcome: Paused, Step: index, Name: step.Name, Seen: seen}, nil
		}
		if err != nil {
			return Result{Outcome: ScriptFailed, Step: index, Name: step.Name, Seen: seen}, err
		}
		runner.report(Progress{Step: index, Name: step.Name, Seen: seen})
	}

	return Result{Outcome: Finished, Step: len(script.Steps)}, nil
}

// waitFor reads the screen until it is the expected one or the deadline passes; it never sleeps without reading.
func (runner *Runner) waitFor(expect Expectation, deadline time.Duration) (screen.Classification, bool) {
	until := runner.clock.Now().Add(deadline)

	for {
		seen := runner.screen.Classify(runner.clock.Now())
		if expect.matches(seen) {
			return seen, true
		}
		if !runner.clock.Now().Before(until) {
			return seen, false
		}
		runner.clock.Sleep(pollInterval)
	}
}

// selectEntry finds the entry named by its parameter among the menu's entries on screen and moves the highlight
// straight to it, up or down, one key at a time, each only after the highlight reached the next entry. It never
// counts keys in advance of the screen: an entry that is not on screen, or named twice, is unavailable and no key
// is sent; a list that changes under the moves, or a highlight that does not follow, stops it. It ends only with
// the wanted entry highlighted.
func (runner *Runner) selectEntry(step KeyStep, values map[string]string) (bool, error) {
	label, given := values[step.Parameter]
	if !given {
		return false, fmt.Errorf("the step %q needs the parameter %q", step.Name, step.Parameter)
	}
	entries, drawn := runner.menu()
	if !drawn {
		return false, nil
	}
	target := entries.IndexOf(label)
	if target < 0 {
		return false, nil
	}

	for move := 0; entries.Highlighted != target; move++ {
		if move == step.MoveBudget {
			return false, nil
		}
		next, key := entries.Highlighted+1, arrowDown
		if target < entries.Highlighted {
			next, key = entries.Highlighted-1, arrowUp
		}
		if err := runner.gate.Keys(key); err != nil {
			return false, err
		}
		moved, followed := runner.highlightReaches(entries, next, step.Deadline)
		if !followed {
			return false, nil
		}
		entries = moved
	}

	return entries.HighlightedIs(label), nil
}

// highlightReaches waits, within the deadline, until the same list of entries shows its highlight on the next one.
func (runner *Runner) highlightReaches(
	before screen.MenuEntries,
	next int,
	deadline time.Duration,
) (screen.MenuEntries, bool) {
	until := runner.clock.Now().Add(deadline)

	for runner.clock.Now().Before(until) {
		runner.clock.Sleep(pollInterval)
		entries, drawn := runner.menu()
		if drawn && entries.Highlighted == next && slices.Equal(entries.Labels, before.Labels) {
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
		value, given := values[step.Parameter]
		if !given {
			return fmt.Errorf("the step %q needs the parameter %q", step.Name, step.Parameter)
		}

		return runner.gate.Keys(value)
	default:
		return nil
	}
}
