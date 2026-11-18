package keyscripts

import (
	"bytes"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// replayClock advances through a recording: every sleep feeds the chunks recorded up to the new time.
type replayClock struct {
	now     time.Time
	start   time.Time
	reader  *screen.EmulatorReader
	fixture recording.Fixture
	next    int
}

func (clock *replayClock) Now() time.Time { return clock.now }

func (clock *replayClock) Sleep(duration time.Duration) {
	clock.now = clock.now.Add(duration)
	for clock.next < len(clock.fixture.Output) {
		chunk := clock.fixture.Output[clock.next]
		if clock.start.Add(chunk.Offset).After(clock.now) {
			return
		}
		clock.reader.Feed(chunk.Bytes)
		clock.next++
	}
}

type run struct {
	runner  *Runner
	gate    *terminal.InputGate
	program *bytes.Buffer
	clock   *replayClock
	steps   []Progress
}

// newRun replays the Claude Code folder-trust recording until the trust menu is drawn and holds still.
func newRun(t *testing.T) *run {
	t.Helper()
	layout := profiles.ClaudeCode{}.Screens()
	fixture, err := recording.Load("../testdata/recordings/claude-code/2.1.323/screens/folder-trust")
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	clock := &replayClock{now: time.Unix(0, 0), start: time.Unix(0, 0), reader: reader, fixture: fixture}
	clock.Sleep(fixture.Output[len(fixture.Output)-1].Offset)
	program := &bytes.Buffer{}
	gate := terminal.NewInputGate(program, reader, layout.Composer, clock.Now)
	result := &run{gate: gate, program: program, clock: clock}
	result.runner = NewRunner(gate, screen.NewClassifier(layout, reader), clock, func(step Progress) {
		result.steps = append(result.steps, step)
	})

	return result
}

func trustScript(steps ...KeyStep) KeyScript {
	return KeyScript{Name: "accept-trust", Version: 1, Profile: "claude@2.1.323", Steps: steps}
}

func TestEachConfirmedStepSendsExactlyOneKey(t *testing.T) {
	run := newRun(t)
	script := trustScript(SelectEntry("folder-trust", 1, 2*time.Second)...)

	result, err := run.runner.Run(script, nil)
	if err != nil || result.Outcome != Finished {
		t.Fatalf("the run ended %+v, %v", result, err)
	}
	if run.program.String() != "\x1b[B\r" || len(run.steps) != 2 {
		t.Fatalf("the program got %q after %d confirmed steps, not one arrow and one Enter", run.program.String(), len(run.steps))
	}
}

func TestAScreenThatIsNotTheExpectedOneStopsTheScriptAtItsStep(t *testing.T) {
	run := newRun(t)
	trust := Expectation{Kind: screen.MenuShown, Menu: "folder-trust"}
	prompt := Expectation{Kind: screen.PromptReady}
	script := trustScript(
		KeyStep{Name: "move down", Expect: trust, Action: PressKey, Keys: "\x1b[B", Deadline: time.Second},
		KeyStep{Name: "type at the prompt", Expect: prompt, Action: PressKey, Keys: "x", Deadline: time.Second},
		KeyStep{Name: "never reached", Expect: trust, Action: PressKey, Keys: "\r", Deadline: time.Second},
	)

	result, err := run.runner.Run(script, nil)
	if err != nil || result.Outcome != ScriptFailed || result.Name != "type at the prompt" {
		t.Fatalf("the run ended %+v, %v, not failed at its second step", result, err)
	}
	if run.program.String() != "\x1b[B" {
		t.Fatalf("the program got %q: no key may follow the failed step", run.program.String())
	}
}

func TestAPersonsKeyPausesTheScriptAndResumeStartsFromAFreshCheckpoint(t *testing.T) {
	run := newRun(t)
	script := trustScript(SelectEntry("folder-trust", 1, 2*time.Second)...)
	run.gate.Human([]byte("\x1b[A"))

	result, err := run.runner.Run(script, nil)
	if err != nil || result.Outcome != Paused || result.Step != 0 {
		t.Fatalf("the run ended %+v, %v, not paused at its first step", result, err)
	}
	if run.program.String() != "\x1b[A" {
		t.Fatalf("the program got %q: only the person's key may have gone through", run.program.String())
	}

	run.gate.Choose(terminal.CancelPendingWork, "")
	run.gate.Human([]byte("\r"))
	before := run.clock.Now()
	result, err = run.runner.Resume(script, 0, nil)
	if err != nil || result.Outcome != Finished || !run.clock.Now().After(before) {
		t.Fatalf("the resumed run ended %+v, %v, without reading its checkpoint afresh", result, err)
	}
}

func TestOnlyRegisteredScriptsRun(t *testing.T) {
	registry := NewRegistry(trustScript())

	if _, err := registry.Find("claude@2.1.323", "accept-trust"); err != nil {
		t.Fatal(err)
	}
	if _, err := registry.Find("claude@2.1.323", "rm -rf"); err == nil {
		t.Fatal("an unregistered script name was found")
	}
}
