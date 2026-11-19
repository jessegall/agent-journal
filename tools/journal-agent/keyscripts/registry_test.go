package keyscripts

import "testing"

func TestTheNewestBuildIsChosenByItsDottedNumbers(t *testing.T) {
	registry := NewRegistry(
		KeyScript{Name: "ChangeModel", Profile: "claude@2.1.9"},
		KeyScript{Name: "ChangeModel", Profile: "claude@2.1.323"},
		KeyScript{Name: "ChangeModel", Profile: "claude@2.10.0"},
	)

	script, err := registry.Find("claude@3.0.0", "ChangeModel")

	if err != nil || script.Profile != "claude@2.10.0" {
		t.Fatalf("the fallback found %q, %v", script.Profile, err)
	}
}
