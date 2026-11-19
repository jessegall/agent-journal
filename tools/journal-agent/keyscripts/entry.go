package keyscripts

import (
	"fmt"
	"time"
)

// replayStepDeadline is how long a library entry's step waits for its screen, as a recorded script's step does.
const replayStepDeadline = 5 * time.Second

// namedKeys are the keys a library entry's step may press, by the name the main agent sent them with; arrows are
// never stored, a menu entry is chosen by its label instead.
var namedKeys = map[string]string{
	"enter": "\r", "esc": "\x1b", "tab": "\t", "space": " ", "y": "y", "n": "n",
	"0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
}

// Entry is a menu library entry as the journal hands it out (App\Agents\Models\MenuEntry): the goal it reaches, its
// steps from the screen the first one expects, what replaying it completes, and the proof that ends it.
type Entry struct {
	ID        string      `json:"id"`
	Program   string      `json:"program"`
	Goal      EntryGoal   `json:"goal"`
	Steps     []EntryStep `json:"steps"`
	Completes string      `json:"completes"`
	NextStep  *int        `json:"nextStep"`
	Proof     string      `json:"proof"`
}

// EntryGoal is the key script an entry reaches, with its version and parameters.
type EntryGoal struct {
	Script     string           `json:"script"`
	Version    int              `json:"version"`
	Parameters []EntryParameter `json:"parameters"`
}

// EntryParameter is one named value of an entry's goal.
type EntryParameter struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// values is the goal's parameters by name, as a run is given them.
func (goal EntryGoal) values() map[string]string {
	values := make(map[string]string, len(goal.Parameters))
	for _, parameter := range goal.Parameters {
		values[parameter.Name] = parameter.Value
	}

	return values
}

// EntryStep is one step of an entry: the fingerprint of the screen it expects, then a label to choose or a named
// key, and the text that proves it when it has one.
type EntryStep struct {
	Fingerprint string  `json:"fingerprint"`
	Choose      *string `json:"choose"`
	Key         *string `json:"key"`
	Proof       *string `json:"proof"`
}

// completesStep is what an entry completes when it reaches only the step its key script stalled at.
const completesStep = "step"

// Script compiles the entry for the program build: each step expects its screen's fingerprint, then chooses its
// label through the label helper or presses its named key; the last step carries the entry's proof. A key the
// entry names that is not a named key refuses the whole entry.
func (entry Entry) Script(profile string) (KeyScript, error) {
	steps := make([]KeyStep, 0, len(entry.Steps))
	for index, stored := range entry.Steps {
		step, err := stored.keyStep(index)
		if err != nil {
			return KeyScript{}, fmt.Errorf("entry %s: %w", entry.ID, err)
		}
		steps = append(steps, step)
	}
	if len(steps) > 0 {
		steps[len(steps)-1].Proof = entry.Proof
	}

	return KeyScript{
		Name:    entry.Goal.Script,
		Version: entry.Goal.Version,
		Profile: profile,
		Steps:   steps,
	}, nil
}

func (stored EntryStep) keyStep(index int) (KeyStep, error) {
	step := KeyStep{
		Name:     fmt.Sprintf("replay step %d", index+1),
		Expect:   Expectation{Fingerprint: stored.Fingerprint},
		Deadline: replayStepDeadline,
	}
	if stored.Proof != nil {
		step.Proof = *stored.Proof
	}
	if stored.Choose != nil {
		step.Action, step.Label = ChooseEntry, *stored.Choose

		return step, nil
	}
	if stored.Key == nil {
		return KeyStep{}, fmt.Errorf("step %d neither chooses a label nor presses a key", index+1)
	}
	keys, named := namedKeys[*stored.Key]
	if !named {
		return KeyStep{}, fmt.Errorf("step %d presses %q, which is no named key", index+1, *stored.Key)
	}
	step.Action, step.Keys = PressKey, keys

	return step, nil
}

// ReplayOutcome is how the replay of a library entry ended.
type ReplayOutcome string

const (
	// Proven is a replay whose every step saw its screen and whose proof showed.
	Proven ReplayOutcome = "proven"
	// Stale is a replay that stopped before a key whose check failed; the entry no longer fits this build.
	Stale ReplayOutcome = "stale"
	// ReplayPaused is a replay the person's keys stopped.
	ReplayPaused ReplayOutcome = "paused"
	// ReplayRefused is a replay that ended any other way, such as on a screen that may not leave the host.
	ReplayRefused ReplayOutcome = "refused"
)

// ReplayResult is where a replay ended: how, at which step and why, the live screen of a stale replay for its
// report, and the key script step to resume at when the entry completes only a step.
type ReplayResult struct {
	Outcome     ReplayOutcome
	Step        int
	Reason      UncertaintyReason
	Uncertainty *Uncertainty
	ResumeAt    *int
}

// Replay runs the entry through the runner as the key script it compiles to, with the goal's parameters, and reads
// how it ended. A check that fails stops the run before its key, as every run does.
func (runner *Runner) Replay(entry Entry, profile string) (ReplayResult, error) {
	script, err := entry.Script(profile)
	if err != nil {
		return ReplayResult{}, err
	}
	result, err := runner.Run(script, entry.Goal.values())
	if err != nil {
		return ReplayResult{}, err
	}

	switch result.Outcome {
	case Finished:
		proven := ReplayResult{Outcome: Proven, Step: result.Step}
		if entry.Completes == completesStep {
			proven.ResumeAt = entry.NextStep
		}
		return proven, nil
	case NavigationNeeded:
		return staleAt(result.Step, result.Uncertainty), nil
	case ScriptFailed:
		live, _ := runner.navigation(NextFingerprint, result.Step, script.Steps[result.Step], result.Seen)
		return staleAt(result.Step, live.Uncertainty), nil
	case Paused:
		return ReplayResult{Outcome: ReplayPaused, Step: result.Step}, nil
	}

	return ReplayResult{Outcome: ReplayRefused, Step: result.Step}, nil
}

// staleAt is a replay that stopped at the step for the uncertainty's reason; a screen that did not come is the next
// fingerprint failing.
func staleAt(step int, uncertainty *Uncertainty) ReplayResult {
	stale := ReplayResult{Outcome: Stale, Step: step, Reason: NextFingerprint, Uncertainty: uncertainty}
	if uncertainty != nil && uncertainty.Reason != NoEntry {
		stale.Reason = uncertainty.Reason
	}
	if uncertainty != nil {
		uncertainty.Reason = stale.Reason
	}

	return stale
}
