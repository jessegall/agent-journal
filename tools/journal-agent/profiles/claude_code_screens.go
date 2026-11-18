package profiles

import (
	"time"

	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// claudeCodeSpinnerGlyphs are the glyphs Claude Code 2.1.323 cycles through before its working line, read from the
// recorded turns.
var claudeCodeSpinnerGlyphs = []string{"✻ ", "✶ ", "✳ ", "✢ ", "· ", "* ", "✽ "}

// claudeCodeMenu is one menu family of Claude Code: its ❯ option list, its keywords and the hold it raises.
func claudeCodeMenu(name, hold string, keywords ...string) screen.MenuFamily {
	return screen.MenuFamily{
		Name:        name,
		Options:     screen.OptionList{Label: "menu", Markers: []string{"❯ "}},
		Keywords:    keywords,
		MinKeywords: 2,
		StableFor:   300 * time.Millisecond,
		Hold:        hold,
	}
}

// Screens is how Claude Code 2.1.323 draws its terminal, measured from testdata/recordings/claude-code/2.1.323: the
// composer is the ❯ row fenced by two rules on the normal buffer, empty while the cursor sits after the ❯. A spinner
// redraw lands about every 100 ms, so 300 ms of stillness is three missed frames. The menu families come from report
// 175 (the program's own dialog code): each is known by its ❯ option list and two of its keywords, and holds the
// runtime for a person; none is answered automatically.
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
			claudeCodeMenu("api-key", "login_required", "custom api key", "anthropic_api_key", "use this api key"),
			claudeCodeMenu("theme", "onboarding_required", "text style", "dark mode", "light mode", "colorblind"),
			claudeCodeMenu("terms", "onboarding_required", "consumer terms", "policies", "help improve",
				"accept terms"),
			claudeCodeMenu("usage-limit", "usage_limited", "wait for limit to reset", "spend limit", "hit your",
				"upgrade"),
			claudeCodeMenu("resume-conversation", "human_input", "resume this conversation", "inactive",
				"tokens long", "summary"),
			claudeCodeMenu("question", "human_input", "chat about this", "type something", "review your answers",
				"submit answers"),
			claudeCodeMenu("model-picker", "human_input", "select model", "switch between claude models",
				"default for new sessions", "effort"),
			claudeCodeMenu("tool-permission", "permission_required", "do you want to", "don't ask again",
				"what to do differently", "allow all edits", "allow this connection"),
		},
		Others: []screencontracts.Region{
			screen.MarkedRow{Label: "spinner", Prefixes: claudeCodeSpinnerGlyphs, Contains: "…"},
			screen.MarkedRow{Label: "status", Prefixes: []string{"  "}, Contains: "shift+tab", MaxBelow: 3},
		},
	}
}
