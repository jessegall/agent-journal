package profiles

import (
	"time"

	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// codexMenu is one menu family of Codex: its › option list, its keywords and the hold it raises.
func codexMenu(name, hold string, keywords ...string) screen.MenuFamily {
	return screen.MenuFamily{
		Name:        name,
		Options:     screen.OptionList{Label: "menu", Markers: []string{"› "}},
		Keywords:    keywords,
		MinKeywords: 2,
		StableFor:   300 * time.Millisecond,
		Hold:        hold,
	}
}

// Screens is how Codex 0.165.0 draws its terminal, measured from testdata/recordings/codex/0.165.0: it draws on the
// alternate buffer, its composer is the lowest › row with at most its status lines below it, empty while the cursor
// sits right after the ›, whatever placeholder it shows. The menu families come from report 175 (the binary's
// strings): each is known by its › option list and two of its keywords and holds the runtime for a person. No Later
// of the update prompt is recorded, so it is held too.
func (Codex) Screens() screen.Layout {
	return screen.Layout{
		Buffer:            screencontracts.AlternateBuffer,
		Composer:          screen.MarkedRow{Label: "composer", Prefixes: []string{"› "}, MaxBelow: 3},
		EmptyCursorColumn: 2,
		ComposerStableFor: 300 * time.Millisecond,
		Menus: []screen.MenuFamily{
			codexMenu("folder-trust", "trust_required", "trust this folder", "open restricted", "trust and continue",
				"folder settings"),
			codexMenu("hooks-review", "trust_required", "hooks need review", "trust all", "continue without trusting"),
			codexMenu("sign-in", "login_required", "sign in with chatgpt", "device code", "provide your own api key",
				"welcome to codex"),
			codexMenu("update", "update_required", "update now", "skip until next version", "update available"),
			codexMenu("rate-limit", "usage_limited", "approaching rate limits", "keep current model"),
			codexMenu("question", "human_input", "question requested", "none of the above", "free-form"),
			codexMenu("resume-session", "human_input", "resume a previous session", "fork a previous session",
				"current directory"),
			codexMenu("model-picker", "human_input", "select model and effort", "(current)", "enter select",
				"esc back"),
			codexMenu("approval", "permission_required", "would you like to", "yes, proceed",
				"what to do differently", "grant these permissions", "this host"),
		},
		Others: []screencontracts.Region{
			screen.MarkedRow{Label: "status", Contains: "for shortcuts", MaxBelow: 1},
		},
	}
}
