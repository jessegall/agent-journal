package scripts

import (
	"bytes"
	"strings"
	"testing"
	"time"

	"journal-agent/keyscripts"
	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// replayClock advances through a recording: every sleep feeds the chunks recorded up to the new time.
type replayClock struct {
	now     time.Time
	reader  *screen.EmulatorReader
	fixture recording.Fixture
	next    int
}

func (clock *replayClock) Now() time.Time { return clock.now }

func (clock *replayClock) Sleep(duration time.Duration) {
	clock.now = clock.now.Add(duration)
	for clock.next < len(clock.fixture.Output) {
		chunk := clock.fixture.Output[clock.next]
		if time.Unix(0, 0).Add(chunk.Offset).After(clock.now) {
			return
		}
		clock.reader.Feed(chunk.Bytes)
		clock.next++
	}
}

// replayScript plays the recording up to from, runs the script against the rest of it and gives how the run ended
// and every key it sent. The recording answers at its own recorded times, as the program did.
func replayScript(
	t *testing.T,
	layout screen.Layout,
	recordingFolder string,
	from time.Duration,
	script keyscripts.KeyScript,
	values map[string]string,
) (keyscripts.Result, string) {
	t.Helper()
	fixture, err := recording.Load("../../testdata/recordings/" + recordingFolder)
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	clock := &replayClock{now: time.Unix(0, 0), reader: reader, fixture: fixture}
	clock.Sleep(from)
	program := &bytes.Buffer{}
	gate := terminal.NewInputGate(program, reader, layout.Composer, clock.Now)
	view := screen.NewView(layout, reader)
	scriptProgram := keyscripts.Program{Name: "program", Layout: layout}
	runner := keyscripts.NewRunner(gate, screen.NewClassifier(layout, reader), clock, view, scriptProgram,
		func(keyscripts.Progress) {})

	result, err := runner.Run(script, values)
	if err != nil {
		t.Fatalf("%s ended with %v", script.Name, err)
	}

	return result, program.String()
}

const (
	down  = "\x1b[B"
	up    = "\x1b[A"
	left  = "\x1b[D"
	enter = "\r"
)

func TestClaudeCodeChangeModelChoosesTheModelForTheSessionAndEndsWhenClaudeCodeSaysItIsSet(t *testing.T) {
	result, keys := replayScript(t, profiles.ClaudeCode{}.Screens(), "claude-code/2.1.323/keyscripts/model-choice",
		7500*time.Millisecond, claudeCodeChangeModel(), map[string]string{"model": "Haiku 5.5"})

	if result.Outcome != keyscripts.Finished {
		t.Fatalf("ChangeModel ended %+v", result)
	}
	if want := "/model" + enter + strings.Repeat(down, 4) + "s"; keys != want {
		t.Fatalf("Claude Code got %q, not %q", keys, want)
	}
}

func TestCodexChangeModelChoosesTheModelAndEndsWhenCodexSaysItChanged(t *testing.T) {
	result, keys := replayScript(t, profiles.Codex{}.Screens(), "codex/0.165.0/keyscripts/model-choice",
		24500*time.Millisecond, codexChangeModel(), map[string]string{"model": "GPT-6-Luna"})

	if result.Outcome != keyscripts.Finished {
		t.Fatalf("ChangeModel ended %+v", result)
	}
	if want := "/model" + enter + strings.Repeat(down, 4) + enter + enter; keys != want {
		t.Fatalf("Codex got %q, not %q", keys, want)
	}
}

func TestCodexChangeEffortKeepsTheCurrentModelAndEndsWhenCodexSaysTheLevelChanged(t *testing.T) {
	result, keys := replayScript(t, profiles.Codex{}.Screens(), "codex/0.165.0/keyscripts/effort-change",
		10500*time.Millisecond, codexChangeEffort(), map[string]string{"effort": "low"})

	if result.Outcome != keyscripts.Finished {
		t.Fatalf("ChangeEffort ended %+v", result)
	}
	if want := "/model" + enter + enter + up + enter; keys != want {
		t.Fatalf("Codex got %q, not %q", keys, want)
	}
}

func TestClaudeCodeChangeEffortMovesTheSliderAndEndsWhenClaudeCodeSaysItIsSet(t *testing.T) {
	result, keys := replayScript(t, profiles.ClaudeCode{}.Screens(), "claude-code/2.1.323/keyscripts/effort-change",
		21*time.Second, claudeCodeChangeEffort(), map[string]string{"effort": "low"})

	if result.Outcome != keyscripts.Finished {
		t.Fatalf("ChangeEffort ended %+v", result)
	}
	if want := "/effort" + enter + left + "s"; keys != want {
		t.Fatalf("Claude Code got %q, not %q", keys, want)
	}
}

func TestALevelTheSliderDoesNotShowIsRefusedBeforeAnyMove(t *testing.T) {
	result, keys := replayScript(t, profiles.ClaudeCode{}.Screens(), "claude-code/2.1.323/keyscripts/effort-change",
		21*time.Second, claudeCodeChangeEffort(), map[string]string{"effort": "turbo"})

	if result.Outcome != keyscripts.EntryUnavailable || keys != "/effort"+enter {
		t.Fatalf("an unknown level ended %+v after keys %q", result, keys)
	}
}

func TestTheRecordedScriptsAreRegisteredAndTheMcpLoginIsNot(t *testing.T) {
	registry := Registered()

	for _, profile := range []string{claudeCode, codex} {
		for _, recorded := range []string{"ChangeModel", "ChangeEffort"} {
			if _, err := registry.Find(profile, recorded); err != nil {
				t.Fatalf("%s is not registered for %s: %v", recorded, profile, err)
			}
		}
		if _, err := registry.Find(profile, "LoginMcp"); err == nil {
			t.Fatalf("LoginMcp is registered for %s without a recording", profile)
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
