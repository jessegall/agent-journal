package profiles

import (
	"time"

	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// claudeCodeSpinnerGlyphs are the glyphs Claude Code 2.1.323 cycles through before its working line, read from the
// recorded turns.
var claudeCodeSpinnerGlyphs = []string{"✻ ", "✶ ", "✳ ", "✢ ", "· ", "* ", "✽ "}

// claudeCodeHighlights are how Claude Code 2.1.323 marks the highlighted option: ❯ alone, or ❯ with the ✔ of the
// entry in use where a list keeps a column for it, as the welcome screen's text styles do (screens/welcome-theme).
var claudeCodeHighlights = []string{"❯ ✔ ", "❯ "}

// claudeCodeMenu is one menu family of Claude Code: its ❯ option list, its keywords and the hold it raises.
func claudeCodeMenu(name, hold string, keywords ...string) screen.MenuFamily {
	return screen.MenuFamily{
		Name:        name,
		Options:     screen.OptionList{Label: "menu", Markers: claudeCodeHighlights},
		Keywords:    keywords,
		MinKeywords: 2,
		StableFor:   300 * time.Millisecond,
		Hold:        hold,
	}
}

// acceptedWith marks a family whose highlighted entry is harmless and is accepted with the recorded keys, so the
// screen is passed instead of holding the runtime: the welcome screen's text style, in screens/welcome-theme-accepted.
func acceptedWith(family screen.MenuFamily, keys string) screen.MenuFamily {
	family.LaterKeys = keys

	return family
}

// asksForSecret marks a family whose screen asks the user for a key or password, so no text of it leaves the host.
func asksForSecret(family screen.MenuFamily) screen.MenuFamily {
	family.Secret = true

	return family
}

// Screens is how Claude Code 2.1.323 draws its terminal, measured from testdata/recordings/claude-code/2.1.323: the
// composer is the ❯ row fenced by two rules on the normal buffer, empty while the cursor sits after the ❯. A spinner
// redraw lands about every 100 ms, so 300 ms of stillness is three missed frames. The menu families come from report
// 175 (the program's own dialog code): each is known by its ❯ option list and two of its keywords, and holds the
// runtime for a user; only the welcome screen's text style is answered, with its recorded Enter. The effort picker is a slider instead, recorded in
// keyscripts/effort-change.
func (ClaudeCode) Screens() screen.Layout {
	return screen.Layout{
		Buffer:            screencontracts.NormalBuffer,
		Composer:          screen.FencedRow{Label: "composer", Marker: "❯ "},
		EmptyCursorColumn: 2,
		ComposerStableFor: 300 * time.Millisecond,
		Menus: []screen.MenuFamily{
			claudeCodeMenu("bypass-warning", "trust_required", "bypass permissions", "dangerous commands",
				"accept all responsibility", "sandboxed"),
			claudeCodeMenu("folder-trust", "trust_required", "trust", "folder", "safety", "workspace", "security"),
			claudeCodeMenu("login-method", "login_required", "select login method", "subscription", "console account",
				"3rd-party platform"),
			asksForSecret(claudeCodeMenu("api-key", "login_required", "custom api key", "anthropic_api_key",
				"use this api key")),
			acceptedWith(claudeCodeMenu("theme", "onboarding_required", "text style", "dark mode", "light mode",
				"colorblind"), "\r"),
			claudeCodeMenu("terms", "onboarding_required", "consumer terms", "policies", "help improve",
				"accept terms"),
			claudeCodeMenu("usage-limit", "usage_limited", "wait for limit to reset", "spend limit", "hit your",
				"upgrade"),
			claudeCodeMenu("resume-conversation", "user_input", "resume this conversation", "inactive",
				"tokens long", "summary"),
			claudeCodeMenu("question", "user_input", "chat about this", "type something", "review your answers",
				"submit answers"),
			claudeCodeMenu("model-picker", "user_input", "select model", "switch between claude models",
				"default for new sessions", "effort"),
			{
				Name:        "effort-picker",
				Options:     screen.Slider{Label: "slider", Marker: "▲"},
				Keywords:    []string{"faster", "smarter", "to adjust", "for this session only"},
				MinKeywords: 2,
				StableFor:   300 * time.Millisecond,
				Hold:        "user_input",
			},
			claudeCodeMenu("tool-permission", "permission_required", "do you want to", "don't ask again",
				"what to do differently", "allow all edits", "allow this connection"),
		},
		Others: []screencontracts.Region{
			screen.MarkedRow{Label: "spinner", Prefixes: claudeCodeSpinnerGlyphs, Contains: "…"},
			screen.MarkedRow{Label: "status", Prefixes: []string{"  "}, Contains: "shift+tab", MaxBelow: 3},
		},
		BracketedPaste: true,
	}
}
