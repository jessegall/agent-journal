package keyscripts

import (
	"testing"
	"time"
)

// modelScript presses s on whatever stable screen shows, and proves the run's model is on screen after it; a second
// step would press x.
func modelScript() KeyScript {
	return KeyScript{Name: "probe", Steps: []KeyStep{
		{Name: "set it", Expect: AnyScreen, Action: PressKey, Keys: "s", Deadline: time.Second,
			Proof: "Model: GPT-{model}"},
		{Name: "go on", Expect: AnyScreen, Action: PressKey, Keys: "x", Deadline: time.Second},
	}}
}

func TestAStepWhoseProofIsOnScreenAfterItsActionPasses(t *testing.T) {
	runner, program := drawnRun(t, "\x1b[2;1HModel: GPT-5.4 (current)")

	result, err := runner.Run(modelScript(), map[string]string{"model": "5.4"})

	if err != nil || result.Outcome != Finished || program.String() != "sx" {
		t.Fatalf("the run ended %+v, %v, sending %q", result, err, program.String())
	}
}

func TestAProofThatDiffersByOneDigitStopsForNavigationWithNoFurtherKey(t *testing.T) {
	runner, program := drawnRun(t, "\x1b[2;1HModel: GPT-5.4 (current)")

	result, err := runner.Run(modelScript(), map[string]string{"model": "5.5"})

	if err != nil || result.Outcome != NavigationNeeded || result.Uncertainty == nil {
		t.Fatalf("the run ended %+v, %v", result, err)
	}
	if result.Uncertainty.Reason != NoProof || result.Uncertainty.Step != 0 || program.String() != "s" {
		t.Fatalf("the run stopped with %+v after %q", result.Uncertainty, program.String())
	}
}

func TestOnlyAScriptWithAProofOnItsLastStepProvesItsResult(t *testing.T) {
	proven := KeyScript{Steps: []KeyStep{{Name: "see it", Proof: "Set model to GPT-6"}}}
	if modelScript().ProvesResult() || !proven.ProvesResult() || (KeyScript{}).ProvesResult() {
		t.Fatal("ProvesResult does not follow the proof of the last step")
	}
}
