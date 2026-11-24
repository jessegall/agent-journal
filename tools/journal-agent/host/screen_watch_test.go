package host

import (
	"context"
	"errors"
	"io"
	"reflect"
	"sync"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/screen"
	"journal-agent/screen/contracts"
	inputs "journal-agent/terminal"
)

// sentFrame is one report the fake journal took.
type sentFrame struct {
	runtimeID string
	frame     screen.Frame
}

// fakeJournal takes screen reports, and fails or refuses them while told to.
type fakeJournal struct {
	mutex    sync.Mutex
	sent     []sentFrame
	attempts int
	failing  error
}

func (journal *fakeJournal) NotifyScreen(_ context.Context, runtimeID string, frame screen.Frame) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.attempts++
	if journal.failing != nil {
		return journal.failing
	}
	journal.sent = append(journal.sent, sentFrame{runtimeID: runtimeID, frame: frame})
	return nil
}

func (journal *fakeJournal) failWith(err error) {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.failing = err
}

func (journal *fakeJournal) frames(runtimeID string) []screen.Frame {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	var frames []screen.Frame
	for _, sent := range journal.sent {
		if sent.runtimeID == runtimeID {
			frames = append(frames, sent.frame)
		}
	}
	return frames
}

func (journal *fakeJournal) attemptCount() int {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	return journal.attempts
}

// fakeReaders holds the screens of the programs the host runs, by runtime.
type fakeReaders struct {
	mutex   sync.Mutex
	readers map[string]*screen.EmulatorReader
}

// passwordLayout is a driver's layout whose one menu family asks for a password, so no text of it leaves the host.
var passwordLayout = screen.Layout{
	Menus: []screen.MenuFamily{{Name: "password", Keywords: []string{"password"}, MinKeywords: 1, Secret: true}},
}

func (readers *fakeReaders) ScreenFor(runtimeID string) (RuntimeScreen, bool) {
	readers.mutex.Lock()
	defer readers.mutex.Unlock()
	reader, found := readers.readers[runtimeID]
	if !found {
		return RuntimeScreen{}, false
	}
	composer := screen.FencedRow{Label: "composer", Marker: ">"}
	gate := inputs.NewInputGate(io.Discard, reader, composer, time.Now)

	return RuntimeScreen{Reader: reader, Layout: passwordLayout, Gate: gate, Barrier: inputs.NewCaptureBarrier()}, true
}

func (readers *fakeReaders) LostConnection(string) bool { return false }

func (readers *fakeReaders) run(t *testing.T, runtimeID, text string) *screen.EmulatorReader {
	t.Helper()
	reader, err := screen.NewEmulatorReader(20, 3, screen.DefaultLimits, nil)
	if err != nil {
		t.Fatal(err)
	}
	reader.Feed([]byte(text))
	readers.mutex.Lock()
	defer readers.mutex.Unlock()
	readers.readers[runtimeID] = reader
	return reader
}

func (readers *fakeReaders) end(runtimeID string) {
	readers.mutex.Lock()
	defer readers.mutex.Unlock()
	delete(readers.readers, runtimeID)
}

func newWatcher(t *testing.T, signOfLife time.Duration) (*ScreenWatcher, *fakeJournal, *fakeReaders) {
	t.Helper()
	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	journal := &fakeJournal{}
	readers := &fakeReaders{readers: map[string]*screen.EmulatorReader{}}
	watcher, err := NewScreenWatcher(ctx, journal, readers)
	if err != nil {
		t.Fatal(err)
	}
	watcher.signOfLife = signOfLife
	return watcher, journal, readers
}

func watch(runtimeIDs ...string) []client.Watch {
	watched := []client.Watch{}
	for _, runtimeID := range runtimeIDs {
		watched = append(watched, client.Watch{RuntimeID: runtimeID, IntervalMs: 10})
	}
	return watched
}

// waitUntil waits for the condition for at most a second.
func waitUntil(t *testing.T, what string, condition func() bool) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if condition() {
			return
		}
		time.Sleep(2 * time.Millisecond)
	}
	t.Fatalf("never: %s", what)
}

func rowText(frame screen.Frame) string {
	if len(frame.Rows) == 0 || len(frame.Rows[0]) == 0 {
		return ""
	}
	return frame.Rows[0][0].Text
}

func TestNothingIsSentWhileNobodyWatches(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	readers.run(t, "runtime-1", "hello")

	watcher.Set(watch())
	time.Sleep(100 * time.Millisecond)

	if journal.attemptCount() != 0 {
		t.Fatalf("%d reports for a runtime nobody watches", journal.attemptCount())
	}
}

func TestAWatchedRuntimeGetsAFrameAndARemovedOneNoMore(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	reader := readers.run(t, "runtime-1", "hello")

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a first frame", func() bool { return len(journal.frames("runtime-1")) == 1 })
	if frame := journal.frames("runtime-1")[0]; rowText(frame) != "hello" || frame.Sequence != 1 || frame.Epoch == "" {
		t.Fatalf("first frame %+v", frame)
	}

	reader.Feed([]byte(" world"))
	waitUntil(t, "a frame of the change", func() bool { return len(journal.frames("runtime-1")) == 2 })

	watcher.Set(watch())
	time.Sleep(20 * time.Millisecond)
	before := journal.attemptCount()
	reader.Feed([]byte("!"))
	time.Sleep(100 * time.Millisecond)
	if journal.attemptCount() != before {
		t.Fatal("frames went on after the runtime left the watched list")
	}
}

func TestAnUnchangedScreenSendsOnlyASignOfLife(t *testing.T) {
	watcher, journal, readers := newWatcher(t, 300*time.Millisecond)
	readers.run(t, "runtime-1", "quiet")

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a first frame", func() bool { return len(journal.frames("runtime-1")) == 1 })
	time.Sleep(150 * time.Millisecond)
	if count := len(journal.frames("runtime-1")); count != 1 {
		t.Fatalf("%d frames of an unchanged screen before the sign of life was due", count)
	}

	waitUntil(t, "the sign of life", func() bool { return len(journal.frames("runtime-1")) == 2 })
	if frame := journal.frames("runtime-1")[1]; frame.Sequence != 2 || rowText(frame) != "quiet" {
		t.Fatalf("sign of life %+v", frame)
	}
}

func TestTwoRuntimesHaveSeparateSequences(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	first := readers.run(t, "runtime-1", "one")
	readers.run(t, "runtime-2", "two")

	watcher.Set(watch("runtime-1", "runtime-2"))
	waitUntil(t, "a frame of each", func() bool {
		return len(journal.frames("runtime-1")) == 1 && len(journal.frames("runtime-2")) == 1
	})
	first.Feed([]byte(" more"))
	waitUntil(t, "a second frame of the first", func() bool { return len(journal.frames("runtime-1")) == 2 })

	if journal.frames("runtime-1")[1].Sequence != 2 || journal.frames("runtime-2")[0].Sequence != 1 {
		t.Fatal("the runtimes share one sequence")
	}
}

func TestAFailedReportIsDroppedAndTheNextSendsTheCurrentScreen(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	reader := readers.run(t, "runtime-1", "first")
	journal.failWith(errors.New("the journal cannot be reached"))

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a failed attempt", func() bool { return journal.attemptCount() >= 1 })
	reader.Feed([]byte("\rsecond"))
	time.Sleep(30 * time.Millisecond)
	journal.failWith(nil)

	waitUntil(t, "a frame after the outage", func() bool { return len(journal.frames("runtime-1")) >= 1 })
	time.Sleep(30 * time.Millisecond)
	frames := journal.frames("runtime-1")
	if len(frames) != 1 || rowText(frames[0]) != "second" || frames[0].Sequence != 1 {
		t.Fatalf("after the outage the journal got %+v", frames)
	}
}

func TestARefusedReportStopsTheRuntimeUntilTheListNamesItAgain(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	reader := readers.run(t, "runtime-1", "hello")
	journal.failWith(client.ScreenRefused{Reason: "nobody watches this runtime"})

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a refused attempt", func() bool { return journal.attemptCount() == 1 })
	reader.Feed([]byte(" again"))
	time.Sleep(60 * time.Millisecond)
	if journal.attemptCount() != 1 {
		t.Fatalf("%d reports after the journal refused one", journal.attemptCount())
	}

	journal.failWith(nil)
	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a frame once the list names it again", func() bool { return len(journal.frames("runtime-1")) == 1 })
}

func TestARuntimeWithoutATerminalAndARelaunchedOne(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "the no-terminal marker", func() bool { return len(journal.frames("runtime-1")) == 1 })
	if frame := journal.frames("runtime-1")[0]; !frame.NoTerminal || len(frame.Rows) != 0 {
		t.Fatalf("marker %+v", frame)
	}
	time.Sleep(50 * time.Millisecond)
	if count := len(journal.frames("runtime-1")); count != 1 {
		t.Fatalf("the marker was sent %d times", count)
	}

	readers.run(t, "runtime-1", "first launch")
	waitUntil(t, "a frame of the launch", func() bool { return len(journal.frames("runtime-1")) == 2 })

	readers.end("runtime-1")
	waitUntil(t, "the marker after the end", func() bool { return len(journal.frames("runtime-1")) == 3 })
	readers.run(t, "runtime-1", "second launch")
	waitUntil(t, "a frame of the relaunch", func() bool { return len(journal.frames("runtime-1")) == 4 })

	frames := journal.frames("runtime-1")
	if !frames[2].NoTerminal || rowText(frames[3]) != "second launch" || frames[3].NoTerminal {
		t.Fatalf("frames %+v", frames)
	}
}

func TestAnUnreadableScreenSendsTheMarkerUntilAGoodFeed(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	reader := readers.run(t, "runtime-1", "hello")

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a first frame", func() bool { return len(journal.frames("runtime-1")) == 1 })
	if err := reader.Feed(make([]byte, screen.DefaultLimits.MaxChunkBytes+1)); err == nil {
		t.Fatal("a chunk over the limit was read")
	}
	waitUntil(t, "the unreadable marker", func() bool { return len(journal.frames("runtime-1")) == 2 })
	if frame := journal.frames("runtime-1")[1]; !frame.Unreadable || len(frame.Rows) != 0 {
		t.Fatalf("marker %+v", frame)
	}

	reader.Feed([]byte(" world"))
	waitUntil(t, "a readable frame", func() bool { return len(journal.frames("runtime-1")) == 3 })
	if frame := journal.frames("runtime-1")[2]; frame.Unreadable || rowText(frame) != "hello world" {
		t.Fatalf("frame after a good feed %+v", frame)
	}
}

func TestARefusedResizeSendsTheMarkerUntilAGoodResize(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	reader := readers.run(t, "runtime-1", "hello")

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "a first frame", func() bool { return len(journal.frames("runtime-1")) == 1 })
	if err := reader.Resize(screen.DefaultLimits.MaxColumns+1, 3); err == nil {
		t.Fatal("a resize over the limit was taken")
	}
	reader.Feed([]byte(" more"))
	waitUntil(t, "the unreadable marker", func() bool { return len(journal.frames("runtime-1")) == 2 })
	if frame := journal.frames("runtime-1")[1]; !frame.Unreadable {
		t.Fatalf("after a refused resize and a good feed %+v", frame)
	}

	if err := reader.Resize(30, 4); err != nil {
		t.Fatal(err)
	}
	waitUntil(t, "a readable frame", func() bool { return len(journal.frames("runtime-1")) == 3 })
	if frame := journal.frames("runtime-1")[2]; frame.Unreadable || frame.Columns != 30 {
		t.Fatalf("frame after a good resize %+v", frame)
	}
}

func TestAScreenThatAsksForAPasswordSendsAShieldWithNoText(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	readers.run(t, "runtime-1", "Password: hunter2")

	watcher.Set(watch("runtime-1"))

	waitUntil(t, "a shield frame", func() bool { return len(journal.frames("runtime-1")) == 1 })
	frame := journal.frames("runtime-1")[0]
	if !frame.Shielded || len(frame.Rows) != 0 || frame.Cursor != (contracts.Cursor{}) {
		t.Fatalf("the password screen left the host: %+v", frame)
	}
	if frame.PrivacyRevision != 1 {
		t.Fatalf("the first shield is at privacy revision %d, not 1", frame.PrivacyRevision)
	}
}

func TestAnOrdinaryPromptStillSendsItsRows(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	readers.run(t, "runtime-1", "> ready")

	watcher.Set(watch("runtime-1"))

	waitUntil(t, "a frame", func() bool { return len(journal.frames("runtime-1")) == 1 })
	frame := journal.frames("runtime-1")[0]
	if frame.Shielded || rowText(frame) != "> ready" || frame.PrivacyRevision != 0 {
		t.Fatalf("the ordinary prompt was not sent as it is: %+v", frame)
	}
}

func TestTurningFromPublicToShieldedRaisesThePrivacyRevision(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	reader := readers.run(t, "runtime-1", "> ready")
	watcher.Set(watch("runtime-1"))
	waitUntil(t, "the public frame", func() bool { return len(journal.frames("runtime-1")) == 1 })

	reader.Feed([]byte("\r\nPassword:"))
	waitUntil(t, "the shield", func() bool { return len(journal.frames("runtime-1")) == 2 })
	reader.Feed([]byte("\x1b[2J\x1b[H> back"))
	waitUntil(t, "the public frame again", func() bool { return len(journal.frames("runtime-1")) == 3 })
	reader.Feed([]byte("\r\nPassword:"))
	waitUntil(t, "the second shield", func() bool { return len(journal.frames("runtime-1")) == 4 })

	revisions := []uint64{}
	for _, frame := range journal.frames("runtime-1") {
		revisions = append(revisions, frame.PrivacyRevision)
	}
	if !reflect.DeepEqual(revisions, []uint64{0, 1, 1, 2}) {
		t.Fatalf("the privacy revisions were %v, not 0, 1, 1, 2", revisions)
	}
}

func TestAQuietScreenProvesTheHostAliveWithARisingProofThatExpiresFifteenSecondsAfterCapture(t *testing.T) {
	if signOfLife != 10*time.Second || proofLifetime != 15*time.Second {
		t.Fatalf("a sign of life every %v proving the host for %v, not 10s and 15s", signOfLife, proofLifetime)
	}
	watcher, journal, readers := newWatcher(t, 30*time.Millisecond)
	readers.run(t, "runtime-1", "quiet")

	watcher.Set(watch("runtime-1"))
	waitUntil(t, "three frames", func() bool { return len(journal.frames("runtime-1")) >= 3 })

	frames := journal.frames("runtime-1")
	for index, frame := range frames[:3] {
		if frame.Proof != uint64(index+1) || frame.ExpiresAt.Sub(frame.Captured) != proofLifetime {
			t.Fatalf("frame %d proves %d until %v after capture", index, frame.Proof, frame.ExpiresAt.Sub(frame.Captured))
		}
		if frame.Stream != frames[0].Stream || frame.Stream == "" {
			t.Fatalf("frame %d is of stream %q, not %q", index, frame.Stream, frames[0].Stream)
		}
	}
}

func TestAChangedIntervalStartsANewStreamAtSequenceOne(t *testing.T) {
	watcher, journal, readers := newWatcher(t, time.Hour)
	readers.run(t, "runtime-1", "hello")
	watcher.Set(watch("runtime-1"))
	waitUntil(t, "the first frame", func() bool { return len(journal.frames("runtime-1")) == 1 })

	watcher.Set([]client.Watch{{RuntimeID: "runtime-1", IntervalMs: 20}})
	waitUntil(t, "the frame of the new stream", func() bool { return len(journal.frames("runtime-1")) == 2 })

	first, second := journal.frames("runtime-1")[0], journal.frames("runtime-1")[1]
	if second.Stream == first.Stream || second.Sequence != 1 || second.Proof != 1 {
		t.Fatalf("after the interval changed: stream %q (was %q), sequence %d, proof %d",
			second.Stream, first.Stream, second.Sequence, second.Proof)
	}
}
