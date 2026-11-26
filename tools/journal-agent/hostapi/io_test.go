package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-agent/recording"
)

// fakeClock is a host clock a test moves by hand.
type fakeClock struct {
	mutex sync.Mutex
	now   time.Time
}

func (clock *fakeClock) Now() time.Time {
	clock.mutex.Lock()
	defer clock.mutex.Unlock()
	return clock.now
}

func (clock *fakeClock) advance(by time.Duration) {
	clock.mutex.Lock()
	defer clock.mutex.Unlock()
	clock.now = clock.now.Add(by)
}

// postedOutputs keeps what a test's host posted.
type postedOutputs struct {
	mutex   sync.Mutex
	outputs []Output
	refuse  bool
}

func (posted *postedOutputs) post(_ string, output Output) error {
	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	if posted.refuse {
		return errors.New("the journal is away")
	}
	posted.outputs = append(posted.outputs, output)
	return nil
}

func terminalOutputs(t *testing.T) (*Outputs, *fakeClock, *postedOutputs) {
	t.Helper()
	clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post, clock.Now)
	if err := outputs.Open("p", OpenPlan{Type: "terminal", Size: TerminalSize{Columns: 40, Rows: 5}}); err != nil {
		t.Fatal(err)
	}
	return outputs, clock, posted
}

func TestARowThatRedrawsNeverReportsUnchangedPastItsLastChange(t *testing.T) {
	outputs, clock, _ := terminalOutputs(t)
	screen, _ := outputs.ScreenOf("p")

	outputs.Printed("p", []byte("thinking 1\r\nstill"))
	clock.advance(400 * time.Millisecond)
	outputs.Printed("p", []byte("\x1b[1;1Hthinking 2"))
	clock.advance(100 * time.Millisecond)

	frame := screen.Frame(outputs.monotonic())
	if frame.UnchangedMs[0] != 100 || frame.UnchangedMs[1] != 500 {
		t.Fatalf("the redrawn row reads %d ms unchanged and the still one %d ms", frame.UnchangedMs[0], frame.UnchangedMs[1])
	}
}

func TestAnUnchangedScreenIsSentAsAProofAtTheStreamRate(t *testing.T) {
	outputs, _, posted := terminalOutputs(t)
	outputs.Printed("p", []byte("ready"))

	if err := outputs.Stream("p", 50); err != nil {
		t.Fatal(err)
	}
	time.Sleep(120 * time.Millisecond)
	_ = outputs.Stream("p", 0)

	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	if len(posted.outputs) < 3 || posted.outputs[0].Frames[0].Rows[0] != "ready" {
		t.Fatalf("an unchanged screen was not sent at the rate: %d posts", len(posted.outputs))
	}
}

func TestAGuardedWriteIsRefusedOnceItsRowsOrTheInputMovedAndTheUsersWriteRaisesTheGeneration(t *testing.T) {
	outputs, _, _ := terminalOutputs(t)
	table := &ProcessTable{outputs: outputs, processes: map[string]*heldProcess{
		"p": {id: "p", terminal: discardingTerminal{}, exited: make(chan struct{})},
	}}
	input := NewProcessInput(table, outputs)
	outputs.Printed("p", []byte("> "))
	screen, _ := outputs.ScreenOf("p")
	guard := RowGuard{From: 0, To: 0, Hash: screen.RowsHash(0, 0)}
	generation := uint64(0)

	if _, err := input.writeKeys(context.Background(), keysOrder(t, KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &generation})); err != nil {
		t.Fatalf("a write whose guards hold is refused: %v", err)
	}
	facts, err := input.writeKeys(context.Background(), keysOrder(t, KeyWrite{Bytes: []byte("x"), AsUser: true}))
	if err != nil || facts["input_generation"] != uint64(1) {
		t.Fatalf("the user's write did not raise the input generation: %v, %v", facts, err)
	}
	_, err = input.writeKeys(context.Background(), keysOrder(t, KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &generation}))
	var refusal RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != GuardMoved {
		t.Fatalf("a write after the user typed is not refused as guard moved: %v", err)
	}
	outputs.Printed("p", []byte("\x1b[1;1Hchanged"))
	moved := uint64(1)
	_, err = input.writeKeys(context.Background(), keysOrder(t, KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &moved}))
	if !errors.As(err, &refusal) || refusal.Refusal != GuardMoved {
		t.Fatalf("a write after its rows moved is not refused as guard moved: %v", err)
	}
}

func TestAPipeReattachesAtItsSpoolOffset(t *testing.T) {
	folder := t.TempDir()
	posted := &postedOutputs{}
	outputs := NewOutputs(folder, posted.post, time.Now)
	if err := outputs.Open("pipe", OpenPlan{Type: "pipe"}); err != nil {
		t.Fatal(err)
	}
	outputs.Printed("pipe", []byte("first "))
	outputs.Printed("pipe", []byte("second"))

	reopened, err := OpenSpool(folder + "/spool/pipe")
	if err != nil {
		t.Fatal(err)
	}
	after, err := reopened.From(6)
	if err != nil || string(after) != "second" || posted.outputs[1].Chunks[0].Offset != 6 {
		t.Fatalf("the spool does not resume at its offset: %q, %v", after, err)
	}
}

func TestAnOutputOverTheLimitIsSplitIntoPosts(t *testing.T) {
	chunks := chunksOf("stdout", 0, []byte(strings.Repeat("a", OutputLimit)))
	parts := split(Output{Chunks: chunks}, OutputLimit)

	if len(parts) < 2 {
		t.Fatalf("an output of %d chunks was not split: %d posts", len(chunks), len(parts))
	}
}

func TestARecordingIsSavedAsAFixture(t *testing.T) {
	outputs, _, _ := terminalOutputs(t)
	outputs.Record("p", OpenPlan{Type: "terminal", Size: TerminalSize{Columns: 40, Rows: 5}})
	outputs.Printed("p", []byte("hello"))

	folder, err := outputs.StopRecording("p")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := loadFixture(folder); err != nil {
		t.Fatalf("the recording does not load as a fixture: %v", err)
	}
}

func keysOrder(t *testing.T, write KeyWrite) Order {
	t.Helper()
	payload, err := json.Marshal(write)
	if err != nil {
		t.Fatal(err)
	}
	return Order{ID: "keys", Type: "write_keys", ProcessID: "p", Payload: payload}
}

// discardingTerminal is a terminal that takes every write.
type discardingTerminal struct{}

func (discardingTerminal) Read([]byte) (int, error)        { return 0, nil }
func (discardingTerminal) Write(typed []byte) (int, error) { return len(typed), nil }
func (discardingTerminal) Close() error                    { return nil }
func (discardingTerminal) Resize(uint16, uint16) error     { return nil }
func (discardingTerminal) Size() (uint16, uint16, error)   { return 40, 5, nil }

func loadFixture(folder string) (recording.Fixture, error) {
	return recording.Load(folder)
}
