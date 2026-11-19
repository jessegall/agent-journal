// Package keyscripts drives a program's menus with recorded, declarative key scripts: one key at a time, each only
// after the screen it expects is read, and never a key past a screen it did not expect. A script selects a menu entry
// by its label only. At a point it cannot be certain of, the run ends NavigationNeeded with an Uncertainty
// (uncertainty.go), sends no key and stays resumable at that step (runner.go). A library entry (entry.go) is a key
// script the same Runner replays, with a fingerprint expectation and a proof check per step; a failed check stops
// before its key. Runner.Navigate (navigation.go) takes the main agent's rounds through the input gate and checks the
// proof on screen; path.go turns a proven request's rounds into an entry's steps. Registry.Find falls back to the
// newest registered build of the program.
package keyscripts

import (
	"fmt"
	"strings"
	"time"

	"journal-agent/screen"
)

// Action is what one step of a key script does.
type Action string

const (
	// PressKey sends one key, such as an arrow or Enter.
	PressKey Action = "press-key"
	// TypeText types the text of a parameter.
	TypeText Action = "type-text"
	// Scroll sends one scroll key.
	Scroll Action = "scroll"
	// WaitForScreen sends nothing and only waits for its expected screen.
	WaitForScreen Action = "wait-for-screen"
	// WaitForHuman stops the script for the person to act, with the step named.
	WaitForHuman Action = "wait-for-human"
	// SelectEntry reads the menu on screen, finds the entry by its label and moves the highlight onto it from the
	// highlighted entry, one confirmed move at a time; a label not on screen sends nothing.
	SelectEntry Action = "select-entry"
	// ChooseEntry selects the entry as SelectEntry does, checks the highlight is on it, and only then presses Enter.
	ChooseEntry Action = "choose-entry"
)

// Expectation is the screen a step needs before it acts: a kind and, for a menu, its family; or a stable screen
// whose fingerprint is Fingerprint, as a library entry's step expects; or Shows, words that must appear together on
// one row of whatever screen is drawn, such as a typed command's echo or a confirmation. A word may name a
// parameter in braces, such as "set effort level to {effort}"; case does not count.
type Expectation struct {
	Kind        screen.Kind
	Menu        string
	Shows       []string
	Fingerprint string
}

// AnyScreen is the expectation of a step that may act on whatever stable screen it finds.
var AnyScreen = Expectation{}

// isAny is whether the expectation takes whatever stable screen is drawn.
func (expectation Expectation) isAny() bool {
	return expectation.Kind == "" && expectation.Menu == "" && expectation.Fingerprint == ""
}

// matches is whether a reading is the expected screen: a stable one of its kind or with its fingerprint, or one
// showing its words. The live fingerprint is read only for an expectation that names one.
func (expectation Expectation) matches(
	reading screen.Classification,
	rows func() []string,
	fingerprint func(reading screen.Classification) string,
	values map[string]string,
) bool {
	if len(expectation.Shows) > 0 {
		return showsTogether(rows(), expectation.Shows, values)
	}
	if !reading.Stable {
		return false
	}
	if expectation.Fingerprint != "" {
		return fingerprint(reading) == expectation.Fingerprint
	}
	if expectation.isAny() {
		return true
	}

	return reading.Kind == expectation.Kind && reading.Menu == expectation.Menu
}

// showsTogether is whether one row holds every word, each with its parameters filled in, in any case.
func showsTogether(rows []string, words []string, values map[string]string) bool {
	for _, row := range rows {
		row = strings.ToLower(row)
		all := true
		for _, word := range words {
			all = all && strings.Contains(row, strings.ToLower(filled(word, values)))
		}
		if all {
			return true
		}
	}

	return false
}

// KeyStep is one step: the screen it waits for, within its deadline, and the one action it then takes. An entry
// step finds its entry by the value of its Parameter when it names one, by its Marked note, or else by its fixed
// Label.
type KeyStep struct {
	Name      string
	Expect    Expectation
	Action    Action
	Keys      string
	Parameter string
	Label     string
	Deadline  time.Duration
	// Marked makes an entry step find the one entry carrying this note, such as "(current)".
	Marked string
	// Proof is text that must show on a stable screen after the step's action, such as "set model to {model}", a
	// parameter named in braces filled with the run's value; it is matched without loss (screen.Proof).
	Proof string
}

// proof is the step's proof with the run's values filled in; proves is false for a step with none.
func (step KeyStep) proof(values map[string]string) (proof screen.Proof, proves bool, err error) {
	if step.Proof == "" {
		return screen.Proof{}, false, nil
	}
	proof, err = screen.NewProof(filled(step.Proof, values))

	return proof, true, err
}

// filled is the text with each parameter named in braces replaced by the run's value.
func filled(text string, values map[string]string) string {
	for name, value := range values {
		text = strings.ReplaceAll(text, "{"+name+"}", value)
	}

	return text
}

// KeyScript is a versioned recipe for one program build: its registered name, the parameters it is given, the
// screen it starts from and its ordered steps. It holds no shell command and no credential.
type KeyScript struct {
	Name       string
	Version    int
	Profile    string
	Parameters []string
	Start      Expectation
	Steps      []KeyStep
}

// ProvesResult is whether the script's last step has a proof, so a finished run shows the change took effect; a
// script without one states that finishing it proves nothing.
func (script KeyScript) ProvesResult() bool {
	return len(script.Steps) > 0 && script.Steps[len(script.Steps)-1].Proof != ""
}

// arrowDown and arrowUp move a menu's highlight one entry down or up; enterKey chooses the highlighted entry.
const (
	arrowDown = "\x1b[B"
	arrowUp   = "\x1b[A"
	enterKey  = "\r"
)

// arrowRight and arrowLeft move a slider's marker one label across.
const (
	arrowRight = "\x1b[C"
	arrowLeft  = "\x1b[D"
)

// Choose is the step that chooses the entry with the label in the menu: it finds the entry on screen, moves the
// highlight onto it, checks it and presses Enter, and refuses when the menu shows no such entry.
func Choose(menu, label string, deadline time.Duration) KeyStep {
	expect := Expectation{Kind: screen.MenuShown, Menu: menu}

	return KeyStep{Name: "choose " + label + " in " + menu, Expect: expect, Action: ChooseEntry, Label: label,
		Deadline: deadline}
}

// target is the index of the entry the step looks for in these entries: the one carrying its marked note, or the
// one its label names; an entry no entry holds is errLabelMissing, one two entries hold errLabelAmbiguous.
func (step KeyStep) target(entries screen.MenuEntries, values map[string]string) (int, error) {
	if step.Marked != "" {
		index, match := entries.LocateMarked(step.Marked)

		return located(index, match, step.Marked)
	}
	label, err := step.label(values)
	if err != nil {
		return 0, err
	}
	index, match := entries.Locate(label)

	return located(index, match, label)
}

// located is the entry found exactly once, or the refusal that says why there is none.
func located(index int, match screen.EntryMatch, wanted string) (int, error) {
	switch match {
	case screen.NotShown:
		return 0, fmt.Errorf("%w: %q", errLabelMissing, wanted)
	case screen.Ambiguous:
		return 0, fmt.Errorf("%w: %q", errLabelAmbiguous, wanted)
	}

	return index, nil
}

// label is the entry the step looks for: its parameter's value, or its fixed label when it names no parameter.
func (step KeyStep) label(values map[string]string) (string, error) {
	if step.Parameter == "" {
		return step.Label, nil
	}

	return step.parameterValue(values)
}

// parameterValue is the value the run gives the step's parameter.
func (step KeyStep) parameterValue(values map[string]string) (string, error) {
	value, given := values[step.Parameter]
	if !given {
		return "", fmt.Errorf("the step %q needs the parameter %q", step.Name, step.Parameter)
	}

	return value, nil
}
