package terminal

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"
	"slices"
	"sync"
	"testing"
	"time"

	"journal-runner/hostapi"
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
	outputs []hostapi.Output
}

func (posted *postedOutputs) post(output hostapi.Output) error {
	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	posted.outputs = append(posted.outputs, output)
	return nil
}

func firstStart(t *testing.T) (recording.Fixture, []RenderedFrame) {
	t.Helper()
	exchange, fixture := recorded.MustTerminal(t, "first-start")
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

func terminalOutputs(t *testing.T, fixture recording.Fixture) (*Session, *fakeClock, *postedOutputs) {
	t.Helper()
	clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
	posted := &postedOutputs{}
	geometry := fixture.StartGeometry()
	plan := hostapi.OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096,
		Type: "terminal", Size: hostapi.TerminalSize(geometry)}
	outputs, err := newSession(plan, posted.post, clock.Now)
	if err != nil {
		t.Fatal(err)
	}
	return outputs, clock, posted
}

func TestARowThatRedrawsNeverReportsUnchangedPastItsLastChange(t *testing.T) {
	fixture, frames := firstStart(t)
	outputs, clock, _ := terminalOutputs(t, fixture)
	screen := outputs.screen

	outputs.printed(fixture.Output[0].Bytes)
	clock.advance(400 * time.Millisecond)
	outputs.printed(fixture.Output[1].Bytes)
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
	outputs.printed(fixture.Output[0].Bytes)

	if _, err := outputs.Stream(hostapi.StreamPlan{FramesPerSecond: 50}); err != nil {
		t.Fatal(err)
	}
	time.Sleep(120 * time.Millisecond)
	_, _ = outputs.Stream(hostapi.StreamPlan{FramesPerSecond: 0})

	posted.mutex.Lock()
	defer posted.mutex.Unlock()
	if len(posted.outputs) < 3 || !slices.Equal(posted.outputs[0].Frames[0].Rows, frames[0].Frame.Rows) {
		t.Fatalf("an unchanged screen was not sent at the rate: %d posts", len(posted.outputs))
	}
}

func TestAGuardedWriteIsRefusedOnceItsRowsOrTheInputMovedAndTheUsersWriteRaisesTheGeneration(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, _ := terminalOutputs(t, fixture)
	outputs.terminal = discardingTerminal{}
	outputs.printed(fixture.Output[0].Bytes)
	screen := outputs.screen
	lastRow := int(fixture.StartGeometry().Rows) - 1
	guard := hostapi.RowGuard{From: 0, To: lastRow, Hash: screen.RowsHash(0, lastRow)}
	generation := uint64(0)
	write := hostapi.KeyWrite{Bytes: []byte("hi"), IfRows: &guard, IfInputGeneration: &generation}

	if _, err := outputs.WriteKeys(write); err != nil {
		t.Fatalf("a write whose guards hold is refused: %v", err)
	}
	if _, err := outputs.Write([]byte("x")); err != nil || screen.InputGeneration() != 1 {
		t.Fatalf("the person's write did not raise the input generation: %v", err)
	}

	seen, err := outputs.WriteKeys(write)
	var refusal hostapi.RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != hostapi.GuardMoved || seen.InputGeneration != 1 {
		t.Fatalf("a write after the person typed returned %+v, %v", seen, err)
	}
	generation = 1
	if _, err := outputs.WriteKeys(write); err != nil {
		t.Fatalf("a write with the person's new generation was refused: %v", err)
	}
	outputs.printed(fixture.Output[1].Bytes)
	_, err = outputs.WriteKeys(write)
	if !errors.As(err, &refusal) || refusal.Refusal != hostapi.GuardMoved {
		t.Fatalf("a write after its rows moved is not refused as guard moved: %v", err)
	}
}

// discardingTerminal is a terminal that takes every write.
type discardingTerminal struct{}

func (discardingTerminal) Read([]byte) (int, error)        { return 0, io.EOF }
func (discardingTerminal) Write(typed []byte) (int, error) { return len(typed), nil }
func (discardingTerminal) Close() error                    { return nil }
func (discardingTerminal) Resize(uint16, uint16) error     { return nil }
func (discardingTerminal) Size() (uint16, uint16, error)   { return 40, 5, nil }

// A screen the journal named as secret leaves as a shielded frame with no rows.
func TestAShieldedScreenLeavesWithoutItsRows(t *testing.T) {
	clock := &fakeClock{now: time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)}
	posted := &postedOutputs{}
	plan := hostapi.OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "terminal", Size: hostapi.TerminalSize{Columns: 40, Rows: 5},
		ShieldRules: []hostapi.ShieldRule{{Keywords: []string{"custom api key", "use this api key"}, MinKeywords: 2}}}
	outputs, err := newSession(plan, posted.post, clock.Now)
	if err != nil {
		t.Fatal(err)
	}
	outputs.printed([]byte("Use this API key?\r\nCUSTOM API KEY: sk-1"))
	screen := outputs.screen

	frame := screen.Frame(outputs.monotonic())

	if !frame.IsShielded || len(frame.Rows) != 0 {
		t.Fatalf("the secret screen left with %d rows, shielded %v", len(frame.Rows), frame.IsShielded)
	}
}

// Nothing of a private entry leaves: no frame between open_private and the redraw after close_private.
func TestAPrivateEntrySendsNoFrameUntilTheRedrawAfterItCloses(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, posted := terminalOutputs(t, fixture)
	if _, err := outputs.OpenPrivate(hostapi.PrivateEntry{DeadlineMs: int(time.Minute.Milliseconds())}); err != nil {
		t.Fatal(err)
	}
	outputs.printed(fixture.Output[0].Bytes)
	_, _ = outputs.Snapshot()
	_, _ = outputs.ClosePrivate()
	_, _ = outputs.Snapshot()
	sentWhilePrivate := len(posted.outputs)
	outputs.printed(fixture.Output[1].Bytes)
	_, _ = outputs.Snapshot()

	if sentWhilePrivate != 0 || len(posted.outputs) != 1 {
		t.Fatalf("a private entry sent %d frames, %d after its redraw", sentWhilePrivate, len(posted.outputs))
	}
}

// A changed screen goes out once it settles, long before the stream's tick, and a screen that keeps changing goes
// out no more often than the stream rate.
func TestAChangedScreenIsSentOnceItSettlesAndABurstAtMostAtTheStreamRate(t *testing.T) {
	fixture, _ := firstStart(t)
	outputs, _, posted := terminalOutputs(t, fixture)
	if _, err := outputs.Stream(hostapi.StreamPlan{FramesPerSecond: 4}); err != nil {
		t.Fatal(err)
	}
	defer func() { _, _ = outputs.Stream(hostapi.StreamPlan{FramesPerSecond: 0}) }()
	sentCount := func() int {
		posted.mutex.Lock()
		defer posted.mutex.Unlock()
		return len(posted.outputs)
	}

	outputs.printed(fixture.Output[0].Bytes)
	time.Sleep(60 * time.Millisecond)
	afterOneChange := sentCount()
	for at := 0; at < 120; at++ {
		outputs.printed(fixture.Output[1+at%2].Bytes)
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
	if _, err := outputs.OpenPrivate(hostapi.PrivateEntry{DeadlineMs: 20}); err != nil {
		t.Fatal(err)
	}
	wasPrivate := outputs.isPrivate()

	time.Sleep(60 * time.Millisecond)
	isPrivate := outputs.isPrivate()
	outputs.printed(fixture.Output[0].Bytes)
	_, _ = outputs.Snapshot()

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
	plan := hostapi.OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "terminal", Size: hostapi.TerminalSize{Columns: 40, Rows: 5},
		ShieldRules: []hostapi.ShieldRule{{Keywords: []string{"custom api key", "use this api key"}, MinKeywords: 2}}}
	outputs, err := newSession(plan, posted.post, clock.Now)
	if err != nil {
		t.Fatal(err)
	}
	outputs.printed([]byte("Use this API key?\r\nCustom API key:"))
	_ = outputs.PostSide("status", 0, []byte("sk-1"))
	outputs.printed([]byte("\x1b[2J\x1b[Hready"))
	_ = outputs.PostSide("status", 4, []byte("ok"))

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
		plan := hostapi.OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096,
			Type: "terminal", Size: hostapi.TerminalSize(fixture.StartGeometry()), RawBytes: isRaw}
		outputs, err := newSession(plan, posted.post, clock.Now)
		if err != nil {
			t.Fatal(err)
		}
		outputs.printed(printed)
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

// shortTerminal takes one byte at a time, holding the first byte until another write has been offered.
type shortTerminal struct {
	discardingTerminal
	mutex   sync.Mutex
	read    []byte
	first   chan struct{}
	release chan struct{}
}

func (terminal *shortTerminal) Write(typed []byte) (int, error) {
	terminal.mutex.Lock()
	first := len(terminal.read) == 0
	terminal.read = append(terminal.read, typed[0])
	terminal.mutex.Unlock()
	if first {
		close(terminal.first)
		<-terminal.release
	}
	return 1, nil
}

func TestThePersonsAndJournalsKeysNeverInterleaveInsideAWrite(t *testing.T) {
	fixture, _ := firstStart(t)
	session, _, _ := terminalOutputs(t, fixture)
	stream := &shortTerminal{first: make(chan struct{}), release: make(chan struct{})}
	session.terminal = stream
	finished := make(chan error, 2)
	go func() {
		_, err := session.Write([]byte("person"))
		finished <- err
	}()
	<-stream.first
	offered := make(chan struct{})
	go func() {
		close(offered)
		_, err := session.WriteKeys(hostapi.KeyWrite{Bytes: []byte("journal"), AsUser: true})
		finished <- err
	}()
	<-offered
	select {
	case err := <-finished:
		close(stream.release)
		<-finished
		t.Fatalf("the journal's keys bypassed the unfinished write: %v", err)
	case <-time.After(20 * time.Millisecond):
	}
	close(stream.release)
	for range 2 {
		if err := <-finished; err != nil {
			t.Fatal(err)
		}
	}
	if string(stream.read) != "personjournal" {
		t.Fatalf("the two writes arrived as %q", stream.read)
	}
}
