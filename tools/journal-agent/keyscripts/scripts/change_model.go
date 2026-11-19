// Package scripts holds the key scripts the host may run, each only for a program build whose recordings establish
// its commands and screens (tools/journal-agent/testdata/recordings/*/keyscripts).
package scripts

import (
	"time"

	"journal-agent/keyscripts"
	"journal-agent/screen"
)

// stepDeadline is how long a step waits for its screen: the recorded pickers draw within half a second.
const stepDeadline = 3 * time.Second

// changeModel opens a build's /model picker from a ready prompt, finds the model named by the model parameter by its
// label on screen and moves the highlight onto it, never a neighbour; a model the picker does not show sends no key. It stops there: the recordings hold no confirmed choice, so choosing and the
// Applied evidence are not scripted yet.
func changeModel(profile, picker string) keyscripts.KeyScript {
	ready := keyscripts.Expectation{Kind: screen.PromptReady}
	shown := keyscripts.Expectation{Kind: screen.MenuShown, Menu: picker}

	return keyscripts.KeyScript{
		Name:       "ChangeModel",
		Version:    1,
		Profile:    profile,
		Parameters: []string{"model"},
		Start:      ready,
		Steps: []keyscripts.KeyStep{
			{Name: "type /model", Expect: ready, Action: keyscripts.PressKey, Keys: "/model", Deadline: stepDeadline},
			{Name: "open the picker", Expect: keyscripts.AnyScreen, Action: keyscripts.PressKey, Keys: "\r",
				Deadline: stepDeadline},
			{Name: "find the model", Expect: shown, Action: keyscripts.SelectEntry, Parameter: "model",
				Deadline: stepDeadline},
		},
	}
}

// Registered is every key script the host may run. Change effort and the MCP login have no recording that shows
// them through to their result, so they are not registered for any build (doc 40, section 26).
func Registered() *keyscripts.Registry {
	return keyscripts.NewRegistry(recorded()...)
}

// recorded is every key script a recording shows, for each build it was recorded on.
func recorded() []keyscripts.KeyScript {
	return []keyscripts.KeyScript{
		changeModel("claude@2.1.323", "model-picker"),
		changeModel("codex@0.165.0", "model-picker"),
	}
}
