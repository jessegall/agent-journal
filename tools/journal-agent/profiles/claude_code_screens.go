package profiles

import (
	"time"

	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// claudeCodeSpinnerGlyphs are the glyphs Claude Code 2.1.323 cycles through before its working line, read from the
// recorded turns.
var claudeCodeSpinnerGlyphs = []string{"✻ ", "✶ ", "✳ ", "✢ ", "· ", "* ", "✽ "}

// Screens is how Claude Code 2.1.323 draws its terminal, measured from testdata/recordings/claude-code/2.1.323: the
// composer is the ❯ row fenced by two rules on the normal buffer, empty while the cursor sits right after the ❯, and
// the folder-trust menu is a ❯ option list under a workspace safety question. A spinner redraw lands about every
// 100 ms, so 300 ms of stillness is three missed frames.
func (ClaudeCode) Screens() screen.Layout {
	return screen.Layout{
		Buffer:            screencontracts.NormalBuffer,
		Composer:          screen.FencedRow{Label: "composer", Marker: "❯ "},
		EmptyCursorColumn: 2,
		ComposerStableFor: 300 * time.Millisecond,
		Menus: []screen.MenuFamily{{
			Name:        "folder-trust",
			Options:     screen.OptionList{Label: "menu", Markers: []string{"❯ "}},
			Keywords:    []string{"trust", "folder", "safety", "workspace", "security"},
			MinKeywords: 2,
			StableFor:   300 * time.Millisecond,
		}},
		Others: []screencontracts.Region{
			screen.MarkedRow{Label: "spinner", Prefixes: claudeCodeSpinnerGlyphs, Contains: "…"},
			screen.MarkedRow{Label: "status", Prefixes: []string{"  "}, Contains: "shift+tab", MaxBelow: 3},
		},
	}
}
