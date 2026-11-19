package scripts

import (
	"strings"
	"testing"

	"journal-agent/keyscripts"
)

func TestOnlyTheRecordedScriptsAreRegistered(t *testing.T) {
	registry := Registered()

	for _, profile := range []string{"claude@2.1.323", "codex@0.165.0"} {
		if _, err := registry.Find(profile, "ChangeModel"); err != nil {
			t.Fatalf("ChangeModel is not registered for %s: %v", profile, err)
		}
		for _, unrecorded := range []string{"ChangeEffort", "LoginMcp"} {
			if _, err := registry.Find(profile, unrecorded); err == nil {
				t.Fatalf("%s is registered for %s without a recording", unrecorded, profile)
			}
		}
	}
}

func TestNoScriptTypesACredential(t *testing.T) {
	for _, script := range recorded() {
		for _, step := range script.Steps {
			if step.Action == keyscripts.TypeText {
				t.Fatalf("%s types a parameter at %q; only menu keys and slash commands are scripted", script.Name, step.Name)
			}
		}
	}
}

func TestNoScriptMovesThroughAMenuByCountedArrowKeys(t *testing.T) {
	for _, script := range recorded() {
		for _, step := range script.Steps {
			if strings.Contains(step.Keys, "\x1b[A") || strings.Contains(step.Keys, "\x1b[B") {
				t.Fatalf("%s for %s presses an arrow at %q; a menu entry is found by its label", script.Name,
					script.Profile, step.Name)
			}
		}
	}
}
