package keyscripts

import (
	"errors"
	"fmt"
	"strings"
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
	gate      *terminal.InputGate
	screen    Screen
	clock     Clock
	highlight func() string
	report    func(Progress)
}

// NewRunner runs scripts through the gate; highlight reads the highlighted entry of the menu on screen.
func NewRunner(
	gate *terminal.InputGate,
	screen Screen,
	clock Clock,
	highlight func() string,
	report func(Progress),
) *Runner {
	return &Runner{gate: gate, screen: screen, clock: clock, highlight: highlight, report: report}
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

// selectEntry moves the highlight down one key at a time, each only after the highlight changed, until the
// highlighted entry holds the wanted label. A highlight that does not move, comes back to an entry it showed before
// or runs out of moves means the entry is unavailable; no other entry is ever taken in its place.
func (runner *Runner) selectEntry(step KeyStep, values map[string]string) (bool, error) {
	label, given := values[step.Parameter]
	if !given {
		return false, fmt.Errorf("the step %q needs the parameter %q", step.Name, step.Parameter)
	}
	visited := map[string]bool{}

	for move := 0; move <= step.MoveBudget; move++ {
		current := runner.highlight()
		if strings.Contains(current, label) {
			return true, nil
		}
		if visited[current] || move == step.MoveBudget {
			return false, nil
		}
		visited[current] = true

		if err := runner.gate.Keys(arrowDown); err != nil {
			return false, err
		}
		if !runner.highlightMoves(current, step.Deadline) {
			return false, nil
		}
	}

	return false, nil
}

// highlightMoves waits until the highlighted entry is another than before, within the deadline.
func (runner *Runner) highlightMoves(before string, deadline time.Duration) bool {
	until := runner.clock.Now().Add(deadline)

	for runner.clock.Now().Before(until) {
		runner.clock.Sleep(pollInterval)
		if runner.highlight() != before {
			return true
		}
	}

	return false
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
