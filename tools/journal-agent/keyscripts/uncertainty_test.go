package keyscripts

import (
	"bytes"
	"slices"
	"strings"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// expectPrompt is a step that expects a ready prompt, which none of these screens shows.
var expectPrompt = KeyStep{
	Name:     "type at the prompt",
	Expect:   Expectation{Kind: screen.PromptReady},
	Action:   PressKey,
	Keys:     "x",
	Deadline: time.Second,
}

func TestAnUnknownPickerMetByAnotherStepNeedsNavigationAndSendsNoKey(t *testing.T) {
	layout := profiles.ClaudeCode{}.Screens()
	layout.Menus = slices.DeleteFunc(slices.Clone(layout.Menus), func(family screen.MenuFamily) bool {
		return family.Name == "folder-trust"
	})
	run := newRunWith(t, layout)

	result, err := run.runner.Run(trustScript(expectPrompt), nil)

	uncertainty := result.Uncertainty
	if err != nil || result.Outcome != NavigationNeeded || uncertainty == nil {
		t.Fatalf("the run ended %+v, %v", result, err)
	}
	if uncertainty.Reason != NoEntry || uncertainty.StepName != "type at the prompt" || uncertainty.Highlight != 0 {
		t.Fatalf("the uncertainty is %+v", uncertainty)
	}
	if !strings.HasPrefix(uncertainty.Fingerprint, "fp1:") || uncertainty.Generation == 0 || uncertainty.Epoch != 0 {
		t.Fatalf("the uncertainty was read as %+v", uncertainty)
	}
	shown := strings.Join(uncertainty.Rows, "\n")
	if !strings.Contains(shown, "Yes, I trust this folder") || strings.Contains(shown, "/private/tmp") {
		t.Fatalf("the rows sent are not the redacted trust menu:\n%s", shown)
	}
	if run.menu.sent() != "" {
		t.Fatalf("the program got %q", run.menu.sent())
	}
}

func TestAUserTypingAtAMenuNeedsNoNavigation(t *testing.T) {
	run := newRun(t)
	if err := run.gate.UserTyped([]byte("n")); err != nil {
		t.Fatal(err)
	}

	result, _ := run.runner.Run(trustScript(expectPrompt), nil)

	if result.Outcome == NavigationNeeded || result.Uncertainty != nil {
		t.Fatalf("a user typing was put to the main agent: %+v", result)
	}
}

// drawnRun is a runner on a screen drawn once and left as it is, read through the Claude Code layout.
func drawnRun(t *testing.T, drawing string) (*Runner, *bytes.Buffer) {
	t.Helper()
	layout := profiles.ClaudeCode{}.Screens()
	reader, err := layout.NewReader(80, 12, screen.DefaultLimits)
	if err != nil {
		t.Fatal(err)
	}
	reader.Feed([]byte(drawing))
	clock := &replayClock{now: time.Unix(0, 0), start: time.Unix(0, 0), reader: reader}
	program := &bytes.Buffer{}
	gate := terminal.NewInputGate(program, reader, layout.Composer, clock.Now)
	view := screen.NewView(layout, reader)
	runner := NewRunner(gate, screen.NewClassifier(layout, reader), clock, view, Program{Name: "claude", Layout: layout},
		func(Progress) {})

	return runner, program
}

func TestAReadyPromptOrASecretScreenEndsAsBeforeWithNoRows(t *testing.T) {
	rule := strings.Repeat("─", 40)
	expectMenu := KeyStep{Name: "pick", Expect: Expectation{Kind: screen.MenuShown, Menu: "model-picker"},
		Action: PressKey, Keys: "\r", Deadline: time.Second}
	screens := map[string]struct {
		drawing string
		step    KeyStep
	}{
		"ready prompt": {"\x1b[2;1H" + rule + "\x1b[3;1H❯ \x1b[4;1H" + rule + "\x1b[3;3H", expectMenu},
		"secret prompt": {"\x1b[1;1HDetected a custom API key in your environment\x1b[2;1HANTHROPIC_API_KEY: sk-ant-1" +
			"\x1b[3;1HDo you want to use this API key?\x1b[5;1H❯ 1. Yes\x1b[6;1H  2. No (recommended)", expectPrompt},
	}

	for name, each := range screens {
		runner, program := drawnRun(t, each.drawing)

		result, err := runner.Run(KeyScript{Name: "probe", Steps: []KeyStep{each.step}}, nil)

		if err != nil || result.Outcome != ScriptFailed || result.Uncertainty != nil || program.Len() != 0 {
			t.Fatalf("the %s ended %+v, %v, sending %q", name, result, err, program.String())
		}
	}
}
