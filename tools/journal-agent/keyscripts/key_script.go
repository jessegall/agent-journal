// Package keyscripts drives a program's menus with recorded, declarative key scripts: one key at a time, each only
// after the screen it expects is read, and never a key past a screen it did not expect.
package keyscripts

import (
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
	// SelectEntry moves a menu's highlight down, one confirmed move at a time, until the highlighted entry is
	// exactly the wanted one; never a neighbour.
	SelectEntry Action = "select-entry"
)

// Expectation is the screen a step needs before it acts: a kind and, for a menu, its family.
type Expectation struct {
	Kind screen.Kind
	Menu string
}

// AnyScreen is the expectation of a step that may act on whatever stable screen it finds, such as a slash command
// typed into the composer.
var AnyScreen = Expectation{}

// matches is whether a stable reading is the expected screen.
func (expectation Expectation) matches(reading screen.Classification) bool {
	if expectation == AnyScreen {
		return reading.Stable
	}

	return reading.Stable && reading.Kind == expectation.Kind && reading.Menu == expectation.Menu
}

// KeyStep is one step: the screen it waits for, within its deadline, and the one action it then takes.
type KeyStep struct {
	Name      string
	Expect    Expectation
	Action    Action
	Keys      string
	Parameter string
	Deadline  time.Duration
	// MoveBudget is how many moves a SelectEntry step may make before the entry counts as unavailable.
	MoveBudget int
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

// arrowDown moves a menu's highlight one entry down.
const arrowDown = "\x1b[B"

// MoveAndChoose is the steps that move a menu's highlight down by moves entries and choose it, one confirmed movement
// at a time: each move waits for the menu again, so a menu that changed stops the script before the next key.
func MoveAndChoose(menu string, moves int, deadline time.Duration) []KeyStep {
	expect := Expectation{Kind: screen.MenuShown, Menu: menu}
	steps := make([]KeyStep, 0, moves+1)

	for move := range moves {
		name := "move " + string(rune('1'+move)) + " down in " + menu
		steps = append(steps, KeyStep{Name: name, Expect: expect, Action: PressKey, Keys: arrowDown, Deadline: deadline})
	}

	choose := KeyStep{Name: "choose in " + menu, Expect: expect, Action: PressKey, Keys: "\r", Deadline: deadline}

	return append(steps, choose)
}
