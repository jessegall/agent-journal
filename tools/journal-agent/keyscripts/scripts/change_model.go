// Package scripts holds the key scripts the host may run, each only for a program build whose recordings establish
// its commands and screens (tools/journal-agent/testdata/recordings/*/keyscripts).
package scripts

import (
	"time"

	"journal-agent/keyscripts"
	"journal-agent/screen"
)

// stepDeadline is how long a step waits for its screen: the recorded screens follow their key within five seconds,
// the longest being a user's pause before Codex drew its reasoning picker.
const stepDeadline = 5 * time.Second

// claudeCode and codex are the program builds the scripts are recorded for.
const (
	claudeCode = "claude@2.1.323"
	codex      = "codex@0.165.0"
)

var ready = keyscripts.Expectation{Kind: screen.PromptReady}

// menu is the expectation of a stable menu of one family.
func menu(family string) keyscripts.Expectation {
	return keyscripts.Expectation{Kind: screen.MenuShown, Menu: family}
}

// shows is the expectation of a row holding every one of the words.
func shows(words ...string) keyscripts.Expectation {
	return keyscripts.Expectation{Shows: words}
}

// command types a slash command at a ready prompt and runs it once its echo is on screen.
func command(name, echo string) []keyscripts.KeyStep {
	return []keyscripts.KeyStep{
		{Name: "type " + name, Expect: ready, Action: keyscripts.PressKey, Keys: name, Deadline: stepDeadline},
		{Name: "run " + name, Expect: shows(echo), Action: keyscripts.PressKey, Keys: "\r", Deadline: stepDeadline},
	}
}

// find is a step that moves a picker's highlight onto the entry its parameter names.
func find(name, family, parameter string) keyscripts.KeyStep {
	return keyscripts.KeyStep{Name: name, Expect: menu(family), Action: keyscripts.SelectEntry, Parameter: parameter,
		Deadline: stepDeadline}
}

// findMarked is a step that moves a picker's highlight onto the one entry carrying the note.
func findMarked(name, family, note string) keyscripts.KeyStep {
	return keyscripts.KeyStep{Name: name, Expect: menu(family), Action: keyscripts.SelectEntry, Marked: note,
		Deadline: stepDeadline}
}

// press is a step that sends one key to a stable picker, after the step before it checked the highlight.
func press(name, family, keys string) keyscripts.KeyStep {
	return keyscripts.KeyStep{Name: name, Expect: menu(family), Action: keyscripts.PressKey, Keys: keys,
		Deadline: stepDeadline}
}

// evidence is the last step: it waits for the program's own line saying the change applied.
func evidence(name string, words ...string) keyscripts.KeyStep {
	return keyscripts.KeyStep{Name: name, Expect: shows(words...), Action: keyscripts.WaitForScreen,
		Deadline: stepDeadline}
}

// claudeCodeChangeModel chooses a model in Claude Code's /model picker for this session only, and ends when Claude
// Code says it set the model (recording claude-code/2.1.323/keyscripts/model-choice).
func claudeCodeChangeModel() keyscripts.KeyScript {
	return keyscripts.KeyScript{
		Name:       "ChangeModel",
		Version:    2,
		Profile:    claudeCode,
		Parameters: []string{"model"},
		Start:      ready,
		Steps: append(command("/model", "❯ /model"),
			find("find the model", "model-picker", "model"),
			press("set it for this session only", "model-picker", "s"),
			evidence("see the model applied", "set model to {model}"),
		),
	}
}

// codexChangeModel chooses a model in Codex's /model picker, keeps the reasoning level Codex marks as its default
// for that model, and ends when Codex says the model changed (recording codex/0.165.0/keyscripts/model-choice).
func codexChangeModel() keyscripts.KeyScript {
	return keyscripts.KeyScript{
		Name:       "ChangeModel",
		Version:    2,
		Profile:    codex,
		Parameters: []string{"model"},
		Start:      ready,
		Steps: append(command("/model", "› /model"),
			find("find the model", "model-picker", "model"),
			press("choose the model", "model-picker", "\r"),
			findMarked("find the default reasoning", "reasoning-picker", "(default)"),
			press("keep the default reasoning", "reasoning-picker", "\r"),
			evidence("see the model applied", "model changed to {model}"),
		),
	}
}

// codexChangeEffort keeps the current model in Codex's /model picker and chooses the reasoning level, ending when
// Codex says the model changed with that level (recording codex/0.165.0/keyscripts/effort-change).
func codexChangeEffort() keyscripts.KeyScript {
	return keyscripts.KeyScript{
		Name:       "ChangeEffort",
		Version:    1,
		Profile:    codex,
		Parameters: []string{"effort"},
		Start:      ready,
		Steps: append(command("/model", "› /model"),
			findMarked("find the current model", "model-picker", "(current)"),
			press("keep the current model", "model-picker", "\r"),
			find("find the reasoning level", "reasoning-picker", "effort"),
			press("choose the reasoning level", "reasoning-picker", "\r"),
			evidence("see the reasoning applied", "model changed to", " {effort}"),
		),
	}
}

// claudeCodeChangeEffort moves Claude Code's /effort slider to the level, sets it for this session only, and ends
// when Claude Code says the effort level is set (recording claude-code/2.1.323/keyscripts/effort-change).
func claudeCodeChangeEffort() keyscripts.KeyScript {
	return keyscripts.KeyScript{
		Name:       "ChangeEffort",
		Version:    1,
		Profile:    claudeCode,
		Parameters: []string{"effort"},
		Start:      ready,
		Steps: append(command("/effort", "❯ /effort"),
			find("find the effort level", "effort-picker", "effort"),
			press("set it for this session only", "effort-picker", "s"),
			evidence("see the effort applied", "set effort level to {effort}"),
		),
	}
}

// Registered is every key script the host may run. The MCP login has no recording through to its result, so it is
// not registered for any build (doc 40, section 26; task 1233).
func Registered() *keyscripts.Registry {
	return keyscripts.NewRegistry(recorded()...)
}

// recorded is every key script a recording shows, for each build it was recorded on.
func recorded() []keyscripts.KeyScript {
	return []keyscripts.KeyScript{
		claudeCodeChangeModel(),
		codexChangeModel(),
		claudeCodeChangeEffort(),
		codexChangeEffort(),
	}
}
