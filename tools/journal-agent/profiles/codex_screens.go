package profiles

import (
	"time"

	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// Screens is how Codex 0.165.0 draws its terminal, measured from testdata/recordings/codex/0.165.0: it draws on the
// alternate buffer, its composer is the lowest › row with at most its status lines below it, empty while the cursor
// sits right after the ›, whatever placeholder it shows. No menu of it is recorded yet, so none is known.
func (Codex) Screens() screen.Layout {
	return screen.Layout{
		Buffer:            screencontracts.AlternateBuffer,
		Composer:          screen.MarkedRow{Label: "composer", Prefixes: []string{"› "}, MaxBelow: 3},
		EmptyCursorColumn: 2,
		ComposerStableFor: 300 * time.Millisecond,
		Others: []screencontracts.Region{
			screen.MarkedRow{Label: "status", Contains: "for shortcuts", MaxBelow: 1},
		},
	}
}
