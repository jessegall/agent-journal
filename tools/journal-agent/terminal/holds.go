package terminal

import (
	"time"

	"journal-agent/screen"
)

// Hold reasons the screen raises besides a menu family's own, as the server names them
// (app/Enums/HoldReason.php).
const (
	// HoldNone is a screen that holds nothing: a ready prompt or a turn being drawn.
	HoldNone = "none"
	// HoldUnknownScreen is a screen nobody recognised: nothing is guessed and no Escape is sent.
	HoldUnknownScreen = "unknown_screen"
	// HoldNavigationNeeded is a key script stopped on a menu it could not be certain of, for the main agent.
	HoldNavigationNeeded = "navigation_needed"
)

// HoldReport is what the host reports for a screen: the reason it holds the runtime, the menu family, the program
// build, the request it held and how old the observation is.
type HoldReport struct {
	Reason         string
	Menu           string
	Build          string
	RequestID      string
	ObservationAge time.Duration
}

// Holds turns a stable reading of the screen into the hold it raises. It answers no menu, except the recorded Later
// of a family that has one, which it sends through the input gate like any driver key.
type Holds struct {
	layout screen.Layout
	build  string
	gate   *InputGate
}

func NewHolds(layout screen.Layout, build string, gate *InputGate) *Holds {
	return &Holds{layout: layout, build: build, gate: gate}
}

// Observe gives the hold of a reading for a request, with the age of the observation. A menu family with a recorded
// Later is answered with it and holds nothing; any other menu holds its reason; an unrecognised screen holds as
// unknown; a ready prompt holds nothing.
func (holds *Holds) Observe(reading screen.Classification, requestID string, age time.Duration) (HoldReport, error) {
	report := HoldReport{Reason: HoldNone, Build: holds.build, RequestID: requestID, ObservationAge: age}

	switch reading.Kind {
	case screen.MenuShown:
		family := holds.family(reading.Menu)
		report.Menu = family.Name
		if family.LaterKeys != "" {
			return report, holds.gate.TypeKeys(family.LaterKeys)
		}
		report.Reason = family.Hold
	case screen.Unknown:
		report.Reason = HoldUnknownScreen
	}

	return report, nil
}

func (holds *Holds) family(name string) screen.MenuFamily {
	for _, family := range holds.layout.Menus {
		if family.Name == name {
			return family
		}
	}

	return screen.MenuFamily{Name: name, Hold: HoldUnknownScreen}
}
