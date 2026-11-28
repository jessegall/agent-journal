package hostapi

import (
	"encoding/base64"
	"encoding/json"
	"testing"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// recordedSecret is the secret the journal's recording finisher signs every recorded claim's instructions with again.
const recordedSecret = "recorded-instruction-secret"

// recordedInstructions are the instructions of the type the journal handed out in the recorded Codex scenario, in the
// order it handed them out, as the host claimed them.
func recordedInstructions(t *testing.T, scenario string, instructionType string) []Instruction {
	t.Helper()
	calls, err := recorded.MustLoad(t, "codex", scenario).Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	found := []Instruction{}
	for _, call := range calls {
		if call.Answered.Path != "/host/instructions/claim" {
			continue
		}
		body, _ := base64.StdEncoding.DecodeString(call.Answered.Body)
		var claim struct {
			Instructions []Instruction `json:"instructions"`
		}
		if err := json.Unmarshal(body, &claim); err != nil {
			t.Fatalf("a recorded claim answer is no claim: %v", err)
		}
		for _, instruction := range claim.Instructions {
			if instruction.Type == instructionType {
				found = append(found, instruction)
			}
		}
	}
	if len(found) == 0 {
		t.Fatalf("the recorded Codex scenario %s handed out no %s", scenario, instructionType)
	}
	return found
}
