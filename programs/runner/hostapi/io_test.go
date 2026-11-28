package hostapi

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
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

func firstStart(t *testing.T) (recording.Fixture, []RenderedFrame) {
	t.Helper()
	exchange, fixture := recorded.MustTerminal(t, "claude-code", "first-start")
	content, err := os.ReadFile(filepath.Join(exchange.Folder, FramesFileName))
	if err != nil {
		t.Fatal(err)
	}
	var frames []RenderedFrame
	if err := json.Unmarshal(content, &frames); err != nil {
		t.Fatal(err)
	}
	if len(fixture.Output) < 3 || len(frames) < 3 {
		t.Fatal("first-start must have a screen at opening, after typing and after submitting")
	}
	return fixture, frames
}

func terminalOutputs(t *testing.T, fixture recording.Fixture) (*Outputs, *fakeClock, *postedOutputs) {
	t.Helper()
	clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post, clock.Now)
	geometry := fixture.StartGeometry()
	plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096,
		Type: "terminal", Size: TerminalSize(geometry)}
	if err := outputs.Open("p", plan); err != nil {
		t.Fatal(err)
	}
	return outputs, clock, posted
}

func TestARowThatRedrawsNeverReportsUnchangedPastItsLastChange(t *testing.T) {
	fixture, frames := firstStart(t)
	outputs, clock, _ := terminalOutputs(t, fixture)
	screen, _ := outputs.ScreenOf("p")

	outputs.Printed("p", fixture.Output[0].Bytes)
	clock.advance(400 * time.Millisecond)
	outputs.Printed("p", fixture.Output[1].Bytes)
	clock.advance(100 * time.Millisecond)

	frame := screen.Frame(outputs.monotonic())
	before, after := frames[0].Frame.Rows, frames[1].Frame.Rows
	if !slices.Equal(frame.Rows, after) {
		t.Fatal("the two recorded outputs did not draw the next recorded screen")
	}
	for row, text := range after {
		want := int64(500)
		if row >= len(before) || text != before[row] {
			want = 100
		}
		if frame.UnchangedMs[row] != want {
			t.Fatalf("row %d was unchanged for %d ms, want %d", row, frame.UnchangedMs[row], want)
		}
	}
}

func TestAnUnchangedScreenIsSentAsAProofAtTheStreamRate(t *testing.T) {
	fixture, frames := firstStart(t)
	outputs, _, posted := terminalOutputs(t, fixture)
	outputs.Printed("p", fixture.Output[0].Bytes)

	if err := outputs.Stream("p", 50); err != nil {
		t.Fatal(err)
	}
	time.Sleep(120 * time.Millisecond)
	_ = outputs.Stream("p", 0)

	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	if len(posted.outputs) < 3 || !slices.Equal(posted.outputs[0].Frames[0].Rows, frames[0].Frame.Rows) {
		t.Fatalf("an unchanged screen was not sent at the rate: %d posts", len(posted.outputs))
	}
}

func TestAGuardedWriteIsRefusedOnceItsRowsOrTheInputMovedAndTheUsersWriteRaisesTheGeneration(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, _ := terminalOutputs(t, fixture)
	table := &ProcessTable{outputs: outputs, processes: map[string]*heldProcess{
		"p": {id: "p", terminal: discardingTerminal{}, exited: make(chan struct{})},
	}}
	input := NewProcessInput(table, outputs, nil)
	outputs.Printed("p", fixture.Output[0].Bytes)
	screen, _ := outputs.ScreenOf("p")
	lastRow := int(fixture.StartGeometry().Rows) - 1
	guard := RowGuard{From: 0, To: lastRow, Hash: screen.RowsHash(0, lastRow)}
	generation := uint64(0)

	if _, err := carry(testInstructions{ProcessInput: input}, "write_keys")(context.Background(), keysInstruction(t, KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &generation})); err != nil {
		t.Fatalf("a write whose guards hold is refused: %v", err)
	}
	facts, err := carry(testInstructions{ProcessInput: input}, "write_keys")(context.Background(), keysInstruction(t, KeyWrite{Bytes: []byte("x"), AsUser: true}))
	if err != nil || facts["input_generation"] != float64(1) {
		t.Fatalf("the user's write did not raise the input generation: %v, %v", facts, err)
	}
	_, err = carry(testInstructions{ProcessInput: input}, "write_keys")(context.Background(), keysInstruction(t, KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &generation}))
	var refusal RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != GuardMoved {
		t.Fatalf("a write after the user typed is not refused as guard moved: %v", err)
	}
	outputs.Printed("p", fixture.Output[1].Bytes)
	moved := uint64(1)
	_, err = carry(testInstructions{ProcessInput: input}, "write_keys")(context.Background(), keysInstruction(t, KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &moved}))
	if !errors.As(err, &refusal) || refusal.Refusal != GuardMoved {
		t.Fatalf("a write after its rows moved is not refused as guard moved: %v", err)
	}
}

func TestAPipeReattachesAtItsSpoolOffset(t *testing.T) {
	folder := t.TempDir()
	posted := &postedOutputs{}
	outputs := NewOutputs(folder, posted.post, time.Now)
	if err := outputs.Open("pipe", OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe"}); err != nil {
		t.Fatal(err)
	}
	probe := recorded.MustProbe(t, "codex", "version")
	first, second := probe.Output[0].Bytes, probe.Output[1].Bytes
	outputs.Printed("pipe", first)
	outputs.Printed("pipe", second)

	reopened, err := OpenSpool(folder+"/spool/pipe", 1<<20)
	if err != nil {
		t.Fatal(err)
	}
	offset := int64(len(first))
	after, err := reopened.From(offset)
	if err != nil || !bytes.Equal(after, second) || posted.outputs[1].Chunks[0].Offset != offset {
		t.Fatalf("the spool does not resume at its offset: %q, %v", after, err)
	}
}

func TestAContainersLogReachesTheJournalUnderTheNameOfEachStream(t *testing.T) {
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post, time.Now)
	if err := outputs.Open("pipe", OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe"}); err != nil {
		t.Fatal(err)
	}
	table := &ProcessTable{outputs: outputs}
	version := recorded.MustProbe(t, "claude-code", "version")
	login := recorded.MustProbe(t, "codex", "login-status")
	log := bytes.NewReader(append(framed(1, string(version.Output[0].Bytes)), framed(2, string(login.Output[0].Bytes))...))

	table.copyLog("pipe", log, 0)

	if len(posted.outputs) != 2 || posted.outputs[0].Chunks[0].Stream != "stdout" || posted.outputs[1].Chunks[0].Stream != "stderr" {
		t.Fatalf("the journal was sent %+v", posted.outputs)
	}
}

// framed is one piece of a container's log as Docker frames it: the stream, the size, then the bytes.
func framed(stream byte, printed string) []byte {
	header := make([]byte, 8)
	header[0] = stream
	binary.BigEndian.PutUint32(header[4:], uint32(len(printed)))
	return append(header, printed...)
}

func TestAnOutputOverTheLimitIsSplitIntoPosts(t *testing.T) {
	chunks := chunksOf("stdout", 0, []byte(strings.Repeat("a", OutputLimit)))
	parts := split(Output{Chunks: chunks}, OutputLimit)

	if len(parts) < 2 {
		t.Fatalf("an output of %d chunks was not split: %d posts", len(chunks), len(parts))
	}
}

func keysInstruction(t *testing.T, write KeyWrite) Instruction {
	t.Helper()
	payload, err := json.Marshal(write)
	if err != nil {
		t.Fatal(err)
	}
	return Instruction{ID: "keys", Type: "write_keys", ProcessID: "p", Payload: string(payload)}
}

// discardingTerminal is a terminal that takes every write.
type discardingTerminal struct{}

func (discardingTerminal) Read([]byte) (int, error)        { return 0, nil }
func (discardingTerminal) Write(typed []byte) (int, error) { return len(typed), nil }
func (discardingTerminal) Close() error                    { return nil }
func (discardingTerminal) Resize(uint16, uint16) error     { return nil }
func (discardingTerminal) Size() (uint16, uint16, error)   { return 40, 5, nil }

// A screen the journal named as secret leaves as a shielded frame with no rows.
func TestAShieldedScreenLeavesWithoutItsRows(t *testing.T) {
	clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post, clock.Now)
	plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "terminal", Size: TerminalSize{Columns: 40, Rows: 5},
		ShieldRules: []ShieldRule{{Keywords: []string{"custom api key", "use this api key"}, MinKeywords: 2}}}
	if err := outputs.Open("p", plan); err != nil {
		t.Fatal(err)
	}
	outputs.Printed("p", []byte("Use this API key?\r\nCUSTOM API KEY: sk-1"))
	screen, _ := outputs.ScreenOf("p")

	frame := screen.Frame(outputs.monotonic())

	if !frame.IsShielded || len(frame.Rows) != 0 {
		t.Fatalf("the secret screen left with %d rows, shielded %v", len(frame.Rows), frame.IsShielded)
	}
}

// Nothing of a private entry leaves: no frame between open_private and the redraw after close_private.
func TestAPrivateEntrySendsNoFrameUntilTheRedrawAfterItCloses(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, posted := terminalOutputs(t, fixture)
	if err := outputs.OpenPrivate("p", time.Minute); err != nil {
		t.Fatal(err)
	}
	outputs.Printed("p", fixture.Output[0].Bytes)
	_ = outputs.Snapshot("p")
	outputs.ClosePrivate("p")
	_ = outputs.Snapshot("p")
	sentWhilePrivate := len(posted.outputs)
	outputs.Printed("p", fixture.Output[1].Bytes)
	_ = outputs.Snapshot("p")

	if sentWhilePrivate != 0 || len(posted.outputs) != 1 {
		t.Fatalf("a private entry sent %d frames, %d after its redraw", sentWhilePrivate, len(posted.outputs))
	}
}

// A changed screen goes out once it settles, long before the stream's tick, and a screen that keeps changing goes
// out no more often than the stream rate.
func TestAChangedScreenIsSentOnceItSettlesAndABurstAtMostAtTheStreamRate(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, posted := terminalOutputs(t, fixture)
	if err := outputs.Stream("p", 4); err != nil {
		t.Fatal(err)
	}
	defer func() { _ = outputs.Stream("p", 0) }()
	sentCount := func() int {
		posted.mutex.Lock()
		defer posted.mutex.Unlock()
		return len(posted.outputs)
	}

	outputs.Printed("p", fixture.Output[0].Bytes)
	time.Sleep(60 * time.Millisecond)
	afterOneChange := sentCount()
	for at := 0; at < 120; at++ {
		outputs.Printed("p", fixture.Output[1+at%2].Bytes)
		time.Sleep(5 * time.Millisecond)
	}
	duringBurst := sentCount() - afterOneChange

	if afterOneChange != 1 || duringBurst > 4 {
		t.Fatalf("one change sent %d frames within 60 ms and a 600 ms burst %d", afterOneChange, duringBurst)
	}
}

// A private entry nobody closes ends by itself at its deadline: a private value is refused after it and its output
// leaves again once the screen redraws.
func TestAPrivateEntryNobodyClosesEndsAtItsDeadline(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, posted := terminalOutputs(t, fixture)
	if err := outputs.OpenPrivate("p", 20*time.Millisecond); err != nil {
		t.Fatal(err)
	}
	wasPrivate := outputs.IsPrivate("p")

	time.Sleep(60 * time.Millisecond)
	isPrivate := outputs.IsPrivate("p")
	outputs.Printed("p", fixture.Output[0].Bytes)
	_ = outputs.Snapshot("p")

	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	if !wasPrivate || isPrivate || len(posted.outputs) != 1 {
		t.Fatalf("the entry was private %v, still private %v after its deadline, and sent %d frames after the redraw",
			wasPrivate, isPrivate, len(posted.outputs))
	}
}

// While a shield rule matches the screen, no chunk of the process leaves either: a side socket's bytes are withheld
// with its frames, and they flow again once the screen no longer matches.
func TestAShieldedScreenWithholdsTheProcesssChunksOnEveryStream(t *testing.T) {
	clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post, clock.Now)
	plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "terminal", Size: TerminalSize{Columns: 40, Rows: 5},
		ShieldRules: []ShieldRule{{Keywords: []string{"custom api key", "use this api key"}, MinKeywords: 2}}}
	if err := outputs.Open("p", plan); err != nil {
		t.Fatal(err)
	}
	outputs.Printed("p", []byte("Use this API key?\r\nCustom API key:"))
	outputs.send("p", Output{Chunks: chunksOf("status", 0, []byte("sk-1"))})
	outputs.Printed("p", []byte("\x1b[2J\x1b[Hready"))
	outputs.send("p", Output{Chunks: chunksOf("status", 4, []byte("ok"))})

	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	chunks := 0
	for _, output := range posted.outputs {
		chunks += len(output.Chunks)
	}
	if chunks != 1 {
		t.Fatalf("%d side socket chunks left the machine, want only the one sent after the shielded screen", chunks)
	}
}

// A terminal asked for its raw bytes sends what it prints as chunks from the first byte; the same terminal opened
// without them sends no chunk, only its frames.
func TestATerminalAskedForItsRawBytesSendsThemFromTheFirstOne(t *testing.T) {
	fixture, _ := firstStart(t)
	printed := fixture.Output[0].Bytes
	sent := map[bool]int{}
	for _, isRaw := range []bool{true, false} {
		clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
		posted := &postedOutputs{}
		outputs := NewOutputs(t.TempDir(), posted.post, clock.Now)
		plan := OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096,
			Type: "terminal", Size: TerminalSize(fixture.StartGeometry()), RawBytes: isRaw}
		if err := outputs.Open("p", plan); err != nil {
			t.Fatal(err)
		}
		outputs.Printed("p", printed)
		for _, output := range posted.outputs {
			for _, chunk := range output.Chunks {
				printed, _ := base64.StdEncoding.DecodeString(chunk.Bytes)
				sent[isRaw] += len(printed)
			}
		}
	}
	if sent[true] != len(printed) || sent[false] != 0 {
		t.Fatalf("a raw terminal sent %d bytes and a plain one %d", sent[true], sent[false])
	}
}
