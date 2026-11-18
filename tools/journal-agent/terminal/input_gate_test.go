package terminal

import (
	"bytes"
	"errors"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
)

// readyClaudeCode replays the recorded Claude Code turn up to its first empty, ready composer.
func readyClaudeCode(t *testing.T) (*screen.EmulatorReader, screen.Layout) {
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
	classifier := screen.NewClassifier(layout, reader)

	for _, chunk := range fixture.Output {
		if err := reader.Feed(chunk.Bytes); err != nil {
			t.Fatal(err)
		}
		if classifier.Classify(time.Unix(0, 0)).Kind == screen.PromptReady && reader.Snapshot().Cursor.Row > 6 {
			return reader, layout
		}
	}
	t.Fatal("the recording never reached a ready prompt")

	return nil, layout
}

func newGate(t *testing.T) (*InputGate, *screen.EmulatorReader, *bytes.Buffer) {
	t.Helper()
	reader, layout := readyClaudeCode(t)
	program := &bytes.Buffer{}

	return NewInputGate(program, reader, layout.Composer, func() time.Time { return time.Unix(100, 0) }), reader, program
}

func TestThePersonTypingDuringADriverWriteWinsAndTheDriverLineIsNotSubmitted(t *testing.T) {
	gate, reader, program := newGate(t)
	line, err := gate.Type("request-1", 1, "run the tests", reader.Generation("composer"))
	if err != nil {
		t.Fatal(err)
	}

	if err := gate.Human([]byte("x")); err != nil {
		t.Fatal(err)
	}
	reader.Feed([]byte("run the tests"))

	if _, err := gate.Submit(line, 1); !errors.Is(err, ErrLineInvalidated) {
		t.Fatalf("a typed-over driver line was submitted: %v", err)
	}
	if program.String() != "run the testsx" {
		t.Fatalf("the program got %q: the person's key must pass through and no Enter may follow", program.String())
	}
}

func TestADriverLineWithItsEchoIsSubmittedOnce(t *testing.T) {
	gate, reader, program := newGate(t)
	line, err := gate.Type("request-1", 1, "hello", reader.Generation("composer"))
	if err != nil {
		t.Fatal(err)
	}
	reader.Feed([]byte("hello"))

	if delivery, err := gate.Submit(line, 1); err != nil || delivery != Delivered {
		t.Fatalf("an echoed line read as %s, %v", delivery, err)
	}
	if delivery, _ := gate.Submit(line, 1); delivery != DeliveryUncertain {
		t.Fatalf("a second submit of the same line read as %s", delivery)
	}
	if program.String() != "hello\r" {
		t.Fatalf("the program got %q, not the line and one Enter", program.String())
	}
}

func TestALostEchoIsDeliveryUncertainNeverHumanInput(t *testing.T) {
	gate, reader, program := newGate(t)
	line, err := gate.Type("request-1", 1, "hello", reader.Generation("composer"))
	if err != nil {
		t.Fatal(err)
	}

	if delivery, err := gate.Submit(line, 1); err != nil || delivery != DeliveryUncertain {
		t.Fatalf("a line with no echo read as %s, %v", delivery, err)
	}
	if _, found := gate.Draft(); found {
		t.Fatal("the driver's own unechoed line was taken for the person's draft")
	}
	if program.String() != "hello" {
		t.Fatalf("the program got %q: no Enter may follow a lost echo", program.String())
	}
}

func TestThePersonsDraftIsNeverErasedOrRetyped(t *testing.T) {
	gate, reader, program := newGate(t)
	gate.Human([]byte("my draft"))
	reader.Feed([]byte("my draft"))

	if _, err := gate.Type("request-1", 1, "journal work", reader.Generation("composer")); !errors.Is(err, ErrComposerHeld) {
		t.Fatalf("a driver line was typed over the person's draft: %v", err)
	}
	draft, found := gate.Draft()
	if !found || draft.Text == "" || draft.Age(time.Unix(160, 0)) != time.Minute {
		t.Fatalf("the draft read as %+v, %v", draft, found)
	}
	if program.String() != "my draft" {
		t.Fatalf("the gate wrote %q to the program on its own", program.String())
	}

	saved, err := gate.Choose(SaveAndClearDraft, "\x15")
	if err != nil || saved == "" || program.String() != "my draft\x15" {
		t.Fatalf("saving the draft gave %q, %v, and the program got %q", saved, err, program.String())
	}
}

func TestADriverLineIsRefusedOnAComposerThatChangedSinceItWasRead(t *testing.T) {
	gate, reader, _ := newGate(t)
	read := reader.Generation("composer")
	reader.Feed([]byte("z"))

	if _, err := gate.Type("request-1", 1, "hello", read); !errors.Is(err, ErrComposerHeld) {
		t.Fatalf("a line was typed on a composer that changed since it was read: %v", err)
	}
}
