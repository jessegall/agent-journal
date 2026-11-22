package drivers

import (
	"bytes"
	"context"
	"strings"
	"testing"
	"time"

	"journal-agent/drivers/contracts"
	"journal-agent/keyscripts"
	"journal-agent/keyscripts/scripts"
	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// The two prompts the recorded Claude Code turn typed, at twelve and twenty-eight seconds.
const (
	firstPrompt  = "Count slowly from 1 to 300, one number per line, then say done."
	secondPrompt = "Reply with only the word ok."
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

// recordedTurn replays the recorded Claude Code turn up to the given second, behind a terminal driver whose keys go
// to a buffer: the recording plays the program's side.
func recordedTurn(t *testing.T, until time.Duration) (*TerminalDriver, *replayClock, *bytes.Buffer) {
	t.Helper()
	layout := profiles.ClaudeCode{}.Screens()
	fixture, err := recording.Load("../testdata/recordings/claude-code/2.1.323/turns/terminal-turn")
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	clock := &replayClock{now: time.Unix(0, 0), reader: reader, fixture: fixture}
	clock.Sleep(until)
	program := &bytes.Buffer{}
	gate := terminal.NewInputGate(program, reader, layout.Composer, clock.Now)
	classifier := screen.NewClassifier(layout, reader)
	view := screen.NewView(layout, reader)
	runner := keyscripts.NewRunner(gate, classifier, clock, view, keyscripts.Driver{Name: "claude", Layout: layout},
		func(keyscripts.Progress) {})

	return NewTerminalDriver(TerminalRuntime{
		Profile:    "claude@2.1.323",
		Classifier: classifier,
		Gate:       gate,
		Composer:   layout.Composer.Name(),
		Generation: reader.Generation,
		Scripts:    scripts.Registered(),
		Runner:     runner,
		Clock:      clock,
	}), clock, program
}

func request(id string) contracts.RequestIdentity {
	return contracts.RequestIdentity{RuntimeID: "runtime-1", RequestID: id, Attempt: 1}
}

func TestTwoDeliveredPromptsAreTwoTurnsOfOneGeneration(t *testing.T) {
	driver, clock, program := recordedTurn(t, 11*time.Second)

	first, err := driver.Deliver(context.Background(), contracts.Delivery{Request: request("one"), Parts: contracts.TextParts(firstPrompt)})
	if err != nil || first.Progress != contracts.ProgressApplying {
		t.Fatalf("the first prompt ended %+v, %v", first, err)
	}

	clock.Sleep(27*time.Second + 500*time.Millisecond - clock.Now().Sub(time.Unix(0, 0)))
	second, err := driver.Deliver(context.Background(), contracts.Delivery{Request: request("two"), Parts: contracts.TextParts(secondPrompt)})
	if err != nil || second.Progress != contracts.ProgressApplying {
		t.Fatalf("the second prompt ended %+v, %v", second, err)
	}

	if driver.Turns() != 2 || program.String() != firstPrompt+"\r"+secondPrompt+"\r" {
		t.Fatalf("%d turns, and the program got %q", driver.Turns(), program.String())
	}
}

func TestAnInterruptHoldsTheRuntimeAndAWakeDoesNotRestartWork(t *testing.T) {
	driver, _, program := recordedTurn(t, 11*time.Second)
	driver.Deliver(context.Background(), contracts.Delivery{Request: request("one"), Parts: contracts.TextParts(firstPrompt)})

	bound := contracts.InterruptRequest{Request: request("stop"), Turn: driver.Turns()}
	interrupt, err := driver.Interrupt(context.Background(), bound)
	if err != nil || interrupt.Hold != contracts.HoldInterrupted || interrupt.Outcome == contracts.OutcomeAlreadyIdle {
		t.Fatalf("the interrupt ended %+v, %v", interrupt, err)
	}
	wake, err := driver.Wake(context.Background(), contracts.WakeRequest{Request: request("wake")})
	if err != nil || wake.Progress != contracts.ProgressStaged || wake.Hold != contracts.HoldInterrupted {
		t.Fatalf("a wake while interrupted ended %+v, %v", wake, err)
	}
	if strings.Contains(program.String(), pendingWorkPrompt) || driver.Turns() != 1 {
		t.Fatalf("the held runtime got %q", program.String())
	}
}

func TestAnInterruptBoundToAnEarlierTurnInterruptsNothing(t *testing.T) {
	driver, _, program := recordedTurn(t, 11*time.Second)
	driver.Deliver(context.Background(), contracts.Delivery{Request: request("one"), Parts: contracts.TextParts(firstPrompt)})
	typed := program.String()

	late := contracts.InterruptRequest{Request: request("late"), Turn: driver.Turns() - 1}
	interrupt, err := driver.Interrupt(context.Background(), late)
	if err != nil || interrupt.Outcome != contracts.OutcomeAlreadyIdle || interrupt.Hold != contracts.HoldInterrupted {
		t.Fatalf("the late interrupt ended %+v, %v", interrupt, err)
	}
	if program.String() != typed {
		t.Fatalf("the late interrupt typed %q", strings.TrimPrefix(program.String(), typed))
	}
}

func TestAnInterruptAfterItsTurnEndedIsAlreadyIdleAndTypesNothing(t *testing.T) {
	driver, _, program := recordedTurn(t, 11*time.Second)
	driver.turns, driver.turnEnd = 1, &turnEnd{ended: make(chan error, 1), seen: true}
	typed := program.String()

	interrupt, err := driver.Interrupt(context.Background(), contracts.InterruptRequest{Request: request("after"), Turn: driver.Turns()})

	if err != nil || interrupt.Outcome != contracts.OutcomeAlreadyIdle {
		t.Fatalf("the interrupt after the turn ended %+v, %v", interrupt, err)
	}
	if program.String() != typed {
		t.Fatalf("the interrupt after the turn typed %q", strings.TrimPrefix(program.String(), typed))
	}
}

func TestSettingChangesStayStagedWithoutARecordedLivePath(t *testing.T) {
	driver, _, program := recordedTurn(t, 11*time.Second)

	effort, err := driver.ChangeEffort(context.Background(), contracts.EffortChange{Request: request("e"), Effort: "high"})
	if err != nil || effort.Progress != contracts.ProgressStaged || program.Len() != 0 {
		t.Fatalf("an effort change ended %+v, %v, with keys %q", effort, err, program.String())
	}
}

func TestAKeyScriptToAHeadlessRuntimeNeedsATerminal(t *testing.T) {
	driver := NewHeadlessDriver(HeadlessRuntime{}, 1)

	script := contracts.KeyScriptRequest{Request: request("s"), Script: "ChangeModel"}
	result, err := driver.RunKeyScript(context.Background(), script)
	if err != nil || result.Outcome != contracts.OutcomeTerminalRequired {
		t.Fatalf("a key script to a process runtime ended %+v, %v", result, err)
	}
}

func TestATerminalTurnEndsWhenItsComposerIsEmptyAndStillAgain(t *testing.T) {
	driver, clock, _ := recordedTurn(t, 11*time.Second)
	if driver.Finished() != nil {
		t.Fatal("a driver that submitted nothing has a turn to end")
	}

	delivery := contracts.Delivery{Request: request("one"), Parts: contracts.TextParts(firstPrompt)}
	if _, err := driver.Deliver(context.Background(), delivery); err != nil {
		t.Fatal(err)
	}
	submitted := clock.Now()

	select {
	case err := <-driver.Finished():
		if err != nil {
			t.Fatal(err)
		}
	case <-time.After(10 * time.Second):
		t.Fatal("the recorded turn never ended")
	}
	if ended := clock.Now().Sub(time.Unix(0, 0)); !clock.Now().After(submitted) || ended > 27*time.Second {
		t.Fatalf("the turn submitted at %s ended at %s", submitted.Sub(time.Unix(0, 0)), ended)
	}
}

func TestAKeyScriptStepGoesToTheReceiverTheLoopSet(t *testing.T) {
	relay := &ProgressRelay{}
	relay.Report(keyscripts.Progress{Step: 0, Name: "before anyone listens"})
	var received []string
	driver := NewTerminalDriver(TerminalRuntime{Progress: relay, ProcessGeneration: 2})

	driver.ReportProgressTo(func(progress keyscripts.Progress) { received = append(received, progress.Name) })
	relay.Report(keyscripts.Progress{Step: 1, Name: "type /model"})

	if len(received) != 1 || received[0] != "type /model" || driver.Generation() != 2 {
		t.Fatalf("the receiver got %q in generation %d", received, driver.Generation())
	}
}

func TestABindingThatDoesNotMatchTheScriptIsRefusedBeforeAnyKey(t *testing.T) {
	script := keyscripts.KeyScript{Name: "ChangeModel", Version: 2, Parameters: []string{"model"}, Steps: make([]keyscripts.KeyStep, 3)}
	step := 5
	cases := map[string]contracts.KeyScriptRequest{
		"another version": {Script: "ChangeModel", Version: 1, Parameters: map[string]string{"model": "opus"}},
		"an unknown name": {Script: "ChangeModel", Version: 2, Parameters: map[string]string{"effort": "high"}},
		"a missing step":  {Script: "ChangeModel", Version: 2, ResumeStep: &step},
	}

	for name, request := range cases {
		if bindingRefusal(script, request) == nil {
			t.Errorf("%s was not refused", name)
		}
	}

	valid := contracts.KeyScriptRequest{Script: "ChangeModel", Version: 2, Parameters: map[string]string{"model": "opus"}}
	if refusal := bindingRefusal(script, valid); refusal != nil {
		t.Errorf("a matching attempt was refused: %v", refusal)
	}
}
