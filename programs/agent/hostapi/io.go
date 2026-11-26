package hostapi

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"journal-agent/recording"
	"journal-agent/screen"
)

// OutputLimit is the most bytes the host sends in one output post.
const OutputLimit = 256 * 1024

// SpoolLimit is the most bytes a pipe process's spool keeps, so a reattach after a host restart resumes from it.
const SpoolLimit = 16 * 1024 * 1024

// Frame is one screen of a terminal process, timed on the host's monotonic clock.
type Frame struct {
	Rows         []string `json:"rows"`
	CursorRow    int      `json:"cursor_row"`
	CursorColumn int      `json:"cursor_column"`
	Columns      int      `json:"columns"`
	Buffer       string   `json:"buffer"`
	Captured     int64    `json:"captured"`
	UnchangedMs  []int64  `json:"unchanged_ms"`
	Title        string   `json:"title,omitempty"`
	IsShielded   bool     `json:"is_shielded"`
}

// Chunk is bytes a process wrote on one stream from an offset, base64 encoded.
type Chunk struct {
	Stream string `json:"stream"`
	Offset int64  `json:"offset"`
	Bytes  string `json:"bytes"`
}

// Output is one post of a process's output.
type Output struct {
	Frames []Frame `json:"frames"`
	Chunks []Chunk `json:"chunks"`
}

// MarshalJSON sends a list the output has none of as an empty list, never as null, as the protocol fixes both.
func (output Output) MarshalJSON() ([]byte, error) {
	type wire Output
	sent := wire(output)
	if sent.Frames == nil {
		sent.Frames = []Frame{}
	}
	if sent.Chunks == nil {
		sent.Chunks = []Chunk{}
	}
	return json.Marshal(sent)
}

// OutputPoster sends a process's output to the journal.
type OutputPoster func(processID string, output Output) error

// Outputs keeps what each process prints: a terminal's screen, a pipe's spool, a recording when one is asked, and
// sends it to the journal. Output is never queued: while the journal is away only the latest frame is kept, and a
// gap in a pipe's bytes shows as a jump in offset.
type Outputs struct {
	stateFolder string
	post        OutputPoster
	clock       func() time.Time
	started     time.Time

	mutex     sync.Mutex
	screens   map[string]*Screen
	spools    map[string]*Spool
	streams   map[string]frameStream
	recorders map[string]*recording.Recorder
	held      map[string]Frame
	private   map[string]privateEntry
	openings  map[string]int
}

// frameStream is a process's running stream: how to stop it, and the signal that its screen changed.
type frameStream struct {
	stop    context.CancelFunc
	changed chan struct{}
}

// settleTime is how long a changed screen must stay still before its frame goes out, so one redraw sends one frame.
const settleTime = 15 * time.Millisecond

// privateEntry is how far a process's private entry has got: open, nothing of it leaves; closing, it leaves again
// once the screen redrew.
type privateEntry int

const (
	privateOpen privateEntry = iota + 1
	privateClosing
)

// NewOutputs keeps output under the state folder and posts it with post.
func NewOutputs(stateFolder string, post OutputPoster, clock func() time.Time) *Outputs {
	return &Outputs{
		stateFolder: stateFolder,
		post:        post,
		clock:       clock,
		started:     clock(),
		screens:     map[string]*Screen{},
		spools:      map[string]*Spool{},
		streams:     map[string]frameStream{},
		recorders:   map[string]*recording.Recorder{},
		held:        map[string]Frame{},
		private:     map[string]privateEntry{},
		openings:    map[string]int{},
	}
}

// privateDeadline is how long a private entry stays open with no close: one the journal forgot, because its worker
// died or its order was lost, ends by itself and takes no value after it.
var privateDeadline = time.Minute

// OpenPrivate stops every frame and recording of the terminal process from leaving, and the frame held back, until
// it redraws after ClosePrivate or the private deadline passed.
func (outputs *Outputs) OpenPrivate(processID string) error {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	if _, isTerminal := outputs.screens[processID]; !isTerminal {
		return RefusalError{Refusal: NotRunning, Reason: "the process has no terminal"}
	}
	outputs.private[processID] = privateOpen
	outputs.openings[processID]++
	opening := outputs.openings[processID]
	delete(outputs.held, processID)
	time.AfterFunc(privateDeadline, func() { outputs.closeOpening(processID, opening) })
	return nil
}

// closeOpening closes the private entry once its deadline passed, unless a later entry was opened since.
func (outputs *Outputs) closeOpening(processID string, opening int) {
	outputs.mutex.Lock()
	isSame := outputs.openings[processID] == opening
	outputs.mutex.Unlock()
	if isSame {
		outputs.ClosePrivate(processID)
	}
}

// IsPrivate is whether the process's private entry is open, so a private value may be written into it.
func (outputs *Outputs) IsPrivate(processID string) bool {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	return outputs.private[processID] == privateOpen
}

// ClosePrivate lets the process's output leave again once the screen redraws.
func (outputs *Outputs) ClosePrivate(processID string) {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	if outputs.private[processID] == privateOpen {
		outputs.private[processID] = privateClosing
	}
}

// Open starts keeping a process's output: a screen for a terminal, a spool for pipes.
func (outputs *Outputs) Open(processID string, plan OpenPlan) error {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	if plan.Type == "terminal" {
		shown, err := newScreen(int(plan.Size.Columns), int(plan.Size.Rows), plan.ShieldRules)
		if err != nil {
			return err
		}
		outputs.screens[processID] = shown
		// A process opened again, as a healed one is, starts with no private entry of the one before it.
		delete(outputs.private, processID)
		return nil
	}
	spool, err := OpenSpool(filepath.Join(outputs.stateFolder, "spool", processID))
	if err != nil {
		return err
	}
	outputs.spools[processID] = spool
	return nil
}

// Printed takes what the process printed.
func (outputs *Outputs) Printed(processID string, printed []byte) {
	outputs.mutex.Lock()
	screen, isTerminal := outputs.screens[processID]
	spool := outputs.spools[processID]
	recorder := outputs.recorders[processID]
	entry, isPrivate := outputs.private[processID]
	outputs.mutex.Unlock()
	if isPrivate {
		recorder = nil
	}
	if isTerminal {
		screen.Feed(printed, outputs.monotonic())
		outputs.screenChanged(processID)
		if entry == privateClosing {
			outputs.mutex.Lock()
			delete(outputs.private, processID)
			outputs.mutex.Unlock()
		}
		// A shielded screen's bytes are kept by no recording, as its frames reach no one.
		if recorder != nil && !screen.IsShielded() {
			recorder.Output("stdout", printed)
		}
		return
	}
	if recorder != nil {
		recorder.Output("stdout", printed)
	}
	if spool == nil {
		return
	}
	offset, err := spool.Append(printed)
	if err != nil {
		return
	}
	outputs.send(processID, Output{Chunks: chunksOf("stdout", offset, printed)})
}

// ScreenOf is the process's screen, when it has a terminal.
func (outputs *Outputs) ScreenOf(processID string) (*Screen, bool) {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	screen, found := outputs.screens[processID]
	return screen, found
}

// SpoolOffset is how many bytes the pipe process printed, kept or not; 0 for a terminal.
func (outputs *Outputs) SpoolOffset(processID string) int64 {
	outputs.mutex.Lock()
	spool, found := outputs.spools[processID]
	outputs.mutex.Unlock()
	if !found {
		return 0
	}
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	return spool.offset
}

// Snapshot sends one full frame of the process's screen now.
func (outputs *Outputs) Snapshot(processID string) error {
	screen, found := outputs.ScreenOf(processID)
	if !found {
		return RefusalError{Refusal: NotRunning, Reason: "the process has no screen"}
	}
	outputs.send(processID, Output{Frames: []Frame{screen.Frame(outputs.monotonic())}})
	return nil
}

// Stream sends the process's frame at the rate asked, changed or not: an unchanged frame is the proof that the
// screen held still. A rate of 0 ends the stream.
func (outputs *Outputs) Stream(processID string, framesPerSecond int) error {
	if _, found := outputs.ScreenOf(processID); !found {
		return RefusalError{Refusal: NotRunning, Reason: "the process has no screen"}
	}
	outputs.mutex.Lock()
	if running, isRunning := outputs.streams[processID]; isRunning {
		running.stop()
		delete(outputs.streams, processID)
	}
	if framesPerSecond <= 0 {
		outputs.mutex.Unlock()
		return nil
	}
	ctx, stop := context.WithCancel(context.Background())
	stream := frameStream{stop: stop, changed: make(chan struct{}, 1)}
	outputs.streams[processID] = stream
	outputs.mutex.Unlock()
	go outputs.streamFrames(ctx, processID, stream.changed, time.Second/time.Duration(framesPerSecond))
	return nil
}

// streamFrames sends a changed screen once it stayed still for the settle time, at most once an interval over a
// burst of changes, and an unchanged screen once an interval as the proof that it did not change.
func (outputs *Outputs) streamFrames(ctx context.Context, processID string, changed <-chan struct{}, interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	settled := time.NewTimer(time.Hour)
	settled.Stop()
	lastChangeSent := time.Time{}
	send := func() {
		_ = outputs.Snapshot(processID)
		ticker.Reset(interval)
	}
	for {
		select {
		case <-ctx.Done():
			return
		case <-changed:
			settled.Reset(max(settleTime, interval-time.Since(lastChangeSent)))
		case <-settled.C:
			lastChangeSent = time.Now()
			send()
		case <-ticker.C:
			send()
		}
	}
}

// screenChanged tells the process's stream, when one runs, that its screen took output.
func (outputs *Outputs) screenChanged(processID string) {
	outputs.mutex.Lock()
	stream, running := outputs.streams[processID]
	outputs.mutex.Unlock()
	if !running {
		return
	}
	select {
	case stream.changed <- struct{}{}:
	default:
	}
}

// Record starts a raw recording of the process.
func (outputs *Outputs) Record(processID string, plan OpenPlan) {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	mode := recording.ProcessMode
	if plan.Type == "terminal" {
		mode = recording.TerminalMode
	}
	fixture := recording.Fixture{
		Mode:       mode,
		Geometry:   recording.Geometry{Columns: plan.Size.Columns, Rows: plan.Size.Rows},
		RecordedAt: outputs.clock(),
	}
	outputs.recorders[processID] = recording.NewRecorder(fixture, outputs.clock)
}

// StopRecording saves the process's recording into the state folder and answers its folder.
func (outputs *Outputs) StopRecording(processID string) (string, error) {
	outputs.mutex.Lock()
	recorder, found := outputs.recorders[processID]
	delete(outputs.recorders, processID)
	outputs.mutex.Unlock()
	if !found {
		return "", RefusalError{Refusal: NotRunning, Reason: "the process is not being recorded"}
	}
	folder := filepath.Join(outputs.stateFolder, "recordings", processID+"-"+outputs.clock().UTC().Format("20060102T150405"))
	return folder, recorder.Finish(0).Save(folder)
}

// Typed records what was written into the process, a secret as a secret.
func (outputs *Outputs) Typed(processID string, bytes []byte, isSecret bool) {
	outputs.mutex.Lock()
	recorder := outputs.recorders[processID]
	outputs.mutex.Unlock()
	if recorder != nil {
		recorder.Input(bytes, isSecret)
	}
}

// Flush sends the frame held back while the journal was away.
func (outputs *Outputs) Flush(processID string) {
	outputs.mutex.Lock()
	frame, held := outputs.held[processID]
	delete(outputs.held, processID)
	outputs.mutex.Unlock()
	if held {
		outputs.send(processID, Output{Frames: []Frame{frame}})
	}
}

// send posts the output in parts no larger than OutputLimit; when a post fails only its latest frame is held back.
func (outputs *Outputs) send(processID string, output Output) {
	outputs.mutex.Lock()
	_, isPrivate := outputs.private[processID]
	screen, isTerminal := outputs.screens[processID]
	outputs.mutex.Unlock()
	if isPrivate {
		return
	}
	// A shielded screen's bytes on any stream, a side socket's too, stay on the machine as its frames do.
	if isTerminal && screen.IsShielded() {
		output.Chunks = nil
	}
	for _, part := range split(output, OutputLimit) {
		if outputs.post(processID, part) == nil || len(part.Frames) == 0 {
			continue
		}
		outputs.mutex.Lock()
		outputs.held[processID] = part.Frames[len(part.Frames)-1]
		outputs.mutex.Unlock()
	}
}

func (outputs *Outputs) monotonic() int64 {
	return outputs.clock().Sub(outputs.started).Milliseconds()
}

// split cuts an output into posts whose chunk bytes stay within the limit; frames go in the first post.
func split(output Output, limit int) []Output {
	parts := []Output{{Frames: output.Frames}}
	size := 0
	for _, chunk := range output.Chunks {
		if size+len(chunk.Bytes) > limit && (len(parts[len(parts)-1].Chunks) > 0 || len(parts[len(parts)-1].Frames) > 0) {
			parts = append(parts, Output{})
			size = 0
		}
		last := &parts[len(parts)-1]
		last.Chunks = append(last.Chunks, chunk)
		size += len(chunk.Bytes)
	}
	return parts
}

// chunksOf cuts bytes into base64 chunks that each fit one post.
func chunksOf(stream string, offset int64, bytes []byte) []Chunk {
	piece := OutputLimit / 4 * 3
	chunks := []Chunk{}
	for start := 0; start < len(bytes); start += piece {
		end := min(start+piece, len(bytes))
		chunks = append(chunks, Chunk{
			Stream: stream,
			Offset: offset + int64(start),
			Bytes:  base64.StdEncoding.EncodeToString(bytes[start:end]),
		})
	}
	return chunks
}

// Screen is a terminal process's screen as its emulator draws it, with when each row last changed.
type Screen struct {
	reader          *screen.EmulatorReader
	mutex           sync.Mutex
	rows            []string
	changedAt       []int64
	inputGeneration uint64
	shields         []ShieldRule
}

// IsShielded is whether the screen now shows one the journal named as never to leave the machine.
func (screen *Screen) IsShielded() bool {
	return isShielded(screen.shields, screen.reader.Snapshot().Rows)
}

// Feed draws the printed bytes and marks the rows they changed at the host's monotonic time.
func (screen *Screen) Feed(printed []byte, now int64) {
	_ = screen.reader.Feed(printed)
	snapshot := screen.reader.Snapshot()
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	for len(screen.changedAt) < len(snapshot.Rows) {
		screen.changedAt = append(screen.changedAt, now)
		screen.rows = append(screen.rows, "")
	}
	for row, text := range snapshot.Rows {
		if screen.rows[row] != text {
			screen.rows[row] = text
			screen.changedAt[row] = now
		}
	}
}

// Frame is the screen now, each row with how long it has not changed.
func (screen *Screen) Frame(now int64) Frame {
	snapshot := screen.reader.Snapshot()
	if isShielded(screen.shields, snapshot.Rows) {
		return Frame{Rows: []string{}, Columns: snapshot.Columns, Buffer: string(snapshot.Buffer), Captured: now,
			UnchangedMs: []int64{}, IsShielded: true}
	}
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	unchanged := make([]int64, len(snapshot.Rows))
	for row := range snapshot.Rows {
		if row < len(screen.changedAt) {
			unchanged[row] = now - screen.changedAt[row]
		}
	}
	return Frame{
		Rows:         snapshot.Rows,
		CursorRow:    snapshot.Cursor.Row,
		CursorColumn: snapshot.Cursor.Column,
		Columns:      snapshot.Columns,
		Buffer:       string(snapshot.Buffer),
		Captured:     now,
		UnchangedMs:  unchanged,
	}
}

// RowsHash is the SHA-256 hex of the rows' text from one row to another, joined by newlines.
func (screen *Screen) RowsHash(from, to int) string {
	rows := screen.reader.Snapshot().Rows
	from, to = max(0, from), min(to, len(rows)-1)
	digest := sha256.Sum256([]byte(strings.Join(rows[from:to+1], "\n")))
	return hex.EncodeToString(digest[:])
}

// InputGeneration is raised by every write the user makes.
func (screen *Screen) InputGeneration() uint64 {
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	return screen.inputGeneration
}

// RaiseInputGeneration marks a write of the user's, so a guarded write made before it is refused.
func (screen *Screen) RaiseInputGeneration() uint64 {
	screen.mutex.Lock()
	defer screen.mutex.Unlock()
	screen.inputGeneration++
	return screen.inputGeneration
}

// Spool keeps a pipe process's output on disk up to SpoolLimit, so a reattach resumes at its offset.
type Spool struct {
	path   string
	mutex  sync.Mutex
	offset int64
}

// OpenSpool opens the spool file, going on at its end.
func OpenSpool(path string) (*Spool, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return nil, err
	}
	spool := &Spool{path: path}
	if info, err := os.Stat(path); err == nil {
		spool.offset = info.Size()
	}
	return spool, nil
}

// Append adds the bytes and answers the offset they start at; past the limit they are counted, not kept.
func (spool *Spool) Append(bytes []byte) (int64, error) {
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	start := spool.offset
	spool.offset += int64(len(bytes))
	if start >= SpoolLimit {
		return start, nil
	}
	file, err := os.OpenFile(spool.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return start, err
	}
	defer file.Close()
	_, err = file.Write(bytes[:min(len(bytes), int(SpoolLimit-start))])
	return start, err
}

// From is what the spool kept from the offset on.
func (spool *Spool) From(offset int64) ([]byte, error) {
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	content, err := os.ReadFile(spool.path)
	if err != nil {
		return nil, err
	}
	if offset >= int64(len(content)) {
		return []byte{}, nil
	}
	return content[offset:], nil
}
