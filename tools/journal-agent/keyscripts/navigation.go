package keyscripts

import (
	"errors"
	"time"

	"journal-agent/screen"
	"journal-agent/terminal"
)

// roundDeadline is how long a round waits for a stable screen before and after each action.
const roundDeadline = 5 * time.Second

// The refusals a round reports when it sends no key, or stops before the next one.
const (
	RefusedSecretScreen  = "secret-screen"
	RefusedScreenChanged = "screen-changed"
	RefusedKeyOnMenu     = "key-on-menu"
	RefusedUnknownKey    = "unknown-key"
	RefusedNoParameter   = "no-parameter"
	RefusedProofShown    = "proof-already-shown"
)

// movementKeys are the keys a round may press on any screen: they move or back out, and never choose an entry.
var movementKeys = map[string]string{"up": arrowUp, "down": arrowDown, "tab": "\t", "esc": "\x1b"}

// roundKeys are the keys a round may press only on a screen with no option list: they can choose or commit.
var roundKeys = map[string]string{
	"enter": enterKey, "space": " ", "y": "y", "n": "n", "left": arrowLeft, "right": arrowRight,
	"0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
}

// Round is one round of the main agent's answer as the host carries it out: the screen generation it answered, and
// exactly one of named keys, a label to choose, the label it saw highlighted to confirm, a goal parameter to type, or
// a proof to look for.
type Round struct {
	Generation    uint64
	Keys          []string
	Choose        string
	Confirm       string
	TypeParameter string
	Proof         string
	// Completes and NextStep are what a proof round completes: the goal, or the step after which the script goes on.
	Completes string
	NextStep  *int
}

// ActionRecord is one action a round carried out: a choose or a key, the label of the highlighted entry read right
// before the confirming key, the fingerprint of the stable screen before the action, and the key's name.
type ActionRecord struct {
	Kind        string
	Label       string
	Fingerprint string
	Key         string
	// Replayable is whether the screen before the action had an option list, so a replay can find it again.
	Replayable bool
}

// RoundResult is what came of a round: the screen after it (no rows on a secret screen), the actions carried out,
// the refusal that stopped it, whether its proof showed, and whether the user's keys paused it.
type RoundResult struct {
	ScreenAfter *Uncertainty
	Actions     []ActionRecord
	Refusal     string
	ProofSeen   bool
	Paused      bool
	// Path is the proven path as library entry steps, built from every round's actions once the proof showed.
	Path []EntryStep
}

// Navigate carries out one round of the main agent on a stalled screen: never on a secret screen, never on a screen
// that changed or that the user typed on since the main agent saw it (epoch is the user's input count then), a
// menu entry chosen only by its label, and a proof checked against the live rows and refused when the stalled screen
// already showed it.
func (runner *Runner) Navigate(round Round, epoch uint64, stalled Uncertainty, values map[string]string) RoundResult {
	seen, _ := runner.waitFor(AnyScreen, roundDeadline, values)
	snapshot := runner.screen.Snapshot()
	if !runner.program.Layout.Exportable(snapshot) {
		return RoundResult{Refusal: RefusedSecretScreen}
	}
	if seen.Generation != round.Generation || runner.gate.UserInputs() != epoch {
		return runner.after(RoundResult{Refusal: RefusedScreenChanged}, values)
	}

	result := runner.carryOut(round, stalled, values)
	if result.Paused {
		return result
	}

	return runner.after(result, values)
}

func (runner *Runner) carryOut(round Round, stalled Uncertainty, values map[string]string) RoundResult {
	switch {
	case len(round.Keys) > 0:
		return runner.pressKeys(round.Keys, values)
	case round.Choose != "":
		return runner.choose(round.Choose, values)
	case round.Confirm != "":
		return runner.confirm(round.Confirm)
	case round.TypeParameter != "":
		return runner.typeParameter(round.TypeParameter, values)
	}

	return runner.checkProof(round.Proof, stalled, values)
}

func (runner *Runner) pressKeys(keys []string, values map[string]string) RoundResult {
	var result RoundResult
	for _, name := range keys {
		bytes, movement := movementKeys[name]
		if !movement {
			if _, onMenu := runner.program.Layout.OptionRegion(runner.screen.Snapshot()); onMenu {
				result.Refusal = RefusedKeyOnMenu
				return result
			}
			named, known := roundKeys[name]
			if !known {
				result.Refusal = RefusedUnknownKey
				return result
			}
			bytes = named
		}
		record := runner.record(ActionRecord{Kind: "key", Key: name})
		if err := runner.gate.Keys(bytes); err != nil {
			return runner.stoppedRound(result, err)
		}
		result.Actions = append(result.Actions, record)
		runner.waitFor(AnyScreen, roundDeadline, values)
	}

	return result
}

func (runner *Runner) choose(label string, values map[string]string) RoundResult {
	record := runner.record(ActionRecord{Kind: "choose", Label: label})
	if err := runner.act(KeyStep{Action: ChooseEntry, Label: label, Deadline: roundDeadline}, values); err != nil {
		return runner.stoppedRound(RoundResult{}, err)
	}

	return RoundResult{Actions: []ActionRecord{record}}
}

// confirm presses Enter only when the live highlighted entry is the one the main agent saw.
func (runner *Runner) confirm(label string) RoundResult {
	entries := runner.view.MenuEntries()
	index, match := entries.Locate(label)
	if match != screen.ShownOnce || index != entries.Highlighted {
		return RoundResult{Refusal: string(HighlightWrong)}
	}
	record := runner.record(ActionRecord{Kind: "choose", Label: entries.HighlightedLabel()})
	if err := runner.gate.Keys(enterKey); err != nil {
		return runner.stoppedRound(RoundResult{}, err)
	}

	return RoundResult{Actions: []ActionRecord{record}}
}

func (runner *Runner) typeParameter(name string, values map[string]string) RoundResult {
	if _, given := values[name]; !given {
		return RoundResult{Refusal: RefusedNoParameter}
	}
	record := runner.record(ActionRecord{Kind: "key", Key: "text:" + name})
	if err := runner.act(KeyStep{Action: TypeText, Parameter: name}, values); err != nil {
		return runner.stoppedRound(RoundResult{}, err)
	}

	return RoundResult{Actions: []ActionRecord{record}}
}

// checkProof looks for the proof on a stable screen with the one checker; a proof the stalled screen already showed
// proves nothing.
func (runner *Runner) checkProof(text string, stalled Uncertainty, values map[string]string) RoundResult {
	proof, err := screen.NewProof(text)
	if err != nil || proof.AlreadyOn(stalled.HostRows) {
		return RoundResult{Refusal: RefusedProofShown}
	}
	runner.waitFor(AnyScreen, roundDeadline, values)

	return RoundResult{ProofSeen: proof.SeenIn(runner.screen.Snapshot().Rows)}
}

// stoppedRound is a round a key failed in: the user's keys pause it, a refusal of the label helper is reported by
// its reason.
func (runner *Runner) stoppedRound(result RoundResult, err error) RoundResult {
	if errors.Is(err, terminal.ErrUserTyping) {
		result.Paused = true
		return result
	}
	if reason, uncertain := uncertaintyOf(err); uncertain {
		result.Refusal = string(reason)
		return result
	}
	result.Refusal = err.Error()

	return result
}

// after waits for a stable screen and keeps it as the screen the round left, for the journal and the next round.
func (runner *Runner) after(result RoundResult, values map[string]string) RoundResult {
	seen, _ := runner.waitFor(AnyScreen, roundDeadline, values)
	snapshot := runner.screen.Snapshot()
	if !runner.program.Layout.Exportable(snapshot) {
		result.Refusal = RefusedSecretScreen
		return result
	}
	screenAfter := runner.uncertainty("", 0, KeyStep{}, seen, snapshot)
	result.ScreenAfter = &screenAfter

	return result
}

// record is the action with the live screen's fingerprint before it, and whether that screen is replayable.
func (runner *Runner) record(action ActionRecord) ActionRecord {
	reading := runner.screen.Classify(runner.clock.Now())
	action.Fingerprint, action.Replayable = screen.FingerprintOf(
		runner.program.Layout,
		runner.program.Name,
		runner.screen.Snapshot(),
		reading.Menu,
	)

	return action
}
