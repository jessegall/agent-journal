package host

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"log"
	"reflect"
	"sync"
	"time"

	"journal-agent/client"
	"journal-agent/screen"
	"journal-agent/screen/contracts"
)

// signOfLife is how long an unchanged screen goes without a frame before one is sent anyway.
const signOfLife = 10 * time.Second

// proofLifetime is how long a frame proves the host alive after its capture: the sign of life's ten seconds, one
// second for the browser's poll and four for transit and clock uncertainty.
const proofLifetime = signOfLife + time.Second + 4*time.Second

// failureLogInterval is how often a runtime's failed reports are logged at most.
const failureLogInterval = time.Minute

// ScreenReporter sends one frame of a runtime's screen to the journal.
type ScreenReporter interface {
	ReportScreen(ctx context.Context, runtimeID string, frame screen.Frame) error
}

// ScreenReaders finds the screen of a runtime's program, with the layout it is classified by, while the host runs it.
type ScreenReaders interface {
	ScreenFor(runtimeID string) (RuntimeScreen, bool)
}

// RuntimeScreen is the screen of a program the host runs and the layout of its driver, which says whether the screen
// may leave the host.
type RuntimeScreen struct {
	Reader *screen.EmulatorReader
	Layout screen.Layout
}

// ScreenWatcher sends the screens of the runtimes the journal says are watched, each at its own interval, only when
// the screen changed or a sign of life is due. It only reads screens, so the program's keys and output never wait
// for it. A refused report stops a runtime's frames until the watched list names it again.
type ScreenWatcher struct {
	reporter   ScreenReporter
	readers    ScreenReaders
	now        func() time.Time
	epoch      string
	signOfLife time.Duration
	ctx        context.Context
	mutex      sync.Mutex
	watching   map[string]*screenWatch
	// privacy is each runtime's privacy state, kept across its senders, so a sender started over never lowers it.
	privacy map[string]*screenPrivacy
}

// screenPrivacy is whether a runtime's last captured screen was shielded and the revision it is at: the revision goes
// up each time the screen turns from public to shielded.
type screenPrivacy struct {
	shielded bool
	revision uint64
}

// screenWatch is one watched runtime's sender: its interval and how to stop it.
type screenWatch struct {
	interval time.Duration
	cancel   context.CancelFunc
}

// NewScreenWatcher makes a watcher whose senders end with ctx; its epoch is new for every host process, so frames of
// a restarted host are never taken for old ones.
func NewScreenWatcher(ctx context.Context, reporter ScreenReporter, readers ScreenReaders) (*ScreenWatcher, error) {
	epoch, err := randomName()
	if err != nil {
		return nil, err
	}
	return &ScreenWatcher{
		reporter:   reporter,
		readers:    readers,
		now:        time.Now,
		epoch:      epoch,
		signOfLife: signOfLife,
		ctx:        ctx,
		watching:   map[string]*screenWatch{},
		privacy:    map[string]*screenPrivacy{},
	}, nil
}

// randomName is a new random name of sixteen hex digits, for an epoch or a stream.
func randomName() (string, error) {
	random := make([]byte, 8)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return hex.EncodeToString(random), nil
}

// Set makes the watched list the one the journal sent: a runtime that left it stops, a new one starts, and one whose
// interval changed starts over at its new interval.
func (watcher *ScreenWatcher) Set(watched []client.Watch) {
	watcher.mutex.Lock()
	defer watcher.mutex.Unlock()

	listed := map[string]time.Duration{}
	for _, watch := range watched {
		listed[watch.RuntimeID] = time.Duration(watch.IntervalMs) * time.Millisecond
	}
	for runtimeID, running := range watcher.watching {
		if interval, found := listed[runtimeID]; !found || interval != running.interval {
			running.cancel()
			delete(watcher.watching, runtimeID)
		}
	}
	for runtimeID, interval := range listed {
		if _, running := watcher.watching[runtimeID]; running || interval <= 0 {
			continue
		}
		stream, err := randomName()
		if err != nil {
			log.Printf("the screen of runtime %s has no stream: %v", runtimeID, err)
			continue
		}
		ctx, cancel := context.WithCancel(watcher.ctx)
		watch := &screenWatch{interval: interval, cancel: cancel}
		watcher.watching[runtimeID] = watch
		sender := &screenSender{watcher: watcher, runtimeID: runtimeID, stream: stream}
		go func() {
			sender.run(ctx, interval)
			watcher.stopped(runtimeID, watch)
		}()
	}
}

// privacyRevision records whether the runtime's screen is shielded now and gives the revision it is at, raising it
// when the screen turned from public to shielded.
func (watcher *ScreenWatcher) privacyRevision(runtimeID string, shielded bool) uint64 {
	watcher.mutex.Lock()
	defer watcher.mutex.Unlock()

	privacy, known := watcher.privacy[runtimeID]
	if !known {
		privacy = &screenPrivacy{}
		watcher.privacy[runtimeID] = privacy
	}
	if shielded && !privacy.shielded {
		privacy.revision++
	}
	privacy.shielded = shielded

	return privacy.revision
}

// stopped drops a sender that ended by itself, so the next list that names its runtime starts it again.
func (watcher *ScreenWatcher) stopped(runtimeID string, ended *screenWatch) {
	watcher.mutex.Lock()
	defer watcher.mutex.Unlock()
	if watcher.watching[runtimeID] == ended {
		delete(watcher.watching, runtimeID)
	}
}

// screenCapture is one read of a runtime's screen: the reader it came from and the screen version it read.
type screenCapture struct {
	reader  *screen.EmulatorReader
	version uint64
}

// isSameAs is whether both captures read the same screen version from the same reader.
func (capture screenCapture) isSameAs(other screenCapture) bool {
	return capture.reader == other.reader && capture.version == other.version
}

// screenSender is one runtime's capture loop and what it last sent. Each start of a sender is a new stream, whose
// sequence starts over at one, and every report it tries carries a newer proof.
type screenSender struct {
	watcher   *ScreenWatcher
	runtimeID string
	stream    string
	sequence  uint64
	proof     uint64
	// lastCapture is the screen version last read and from which reader; nil until a capture reads, and after a
	// failed send, so the next round reads again.
	lastCapture  *screenCapture
	lastSent     screen.Frame
	lastSentAt   time.Time
	sentAny      bool
	lastLoggedAt time.Time
}

func (sender *screenSender) run(ctx context.Context, interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	for {
		if refused := sender.tick(ctx); refused {
			return
		}
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		}
	}
}

// tick sends the runtime's screen when it changed or a sign of life is due, and the marker of a runtime whose program
// the host does not run; it says whether the journal refused the report.
func (sender *screenSender) tick(ctx context.Context) bool {
	now := sender.watcher.now()
	frame, readable := sender.capture(now)
	if !readable {
		return false
	}
	if sender.sentAny && sameScreen(frame, sender.lastSent) && !sender.signOfLifeDue(now) {
		return false
	}

	frame.Sequence = sender.sequence + 1
	sender.proof++
	frame.Stream, frame.Proof, frame.ExpiresAt = sender.stream, sender.proof, frame.Captured.Add(proofLifetime)
	err := sender.watcher.reporter.ReportScreen(ctx, sender.runtimeID, frame)
	var refused client.ScreenRefused
	if errors.As(err, &refused) {
		sender.logFailure(now, err)
		return true
	}
	if err != nil {
		sender.lastCapture = nil
		sender.logFailure(now, err)
		return false
	}
	sender.sequence++
	sender.lastSent, sender.lastSentAt, sender.sentAny = frame, now, true
	return false
}

// capture reads the screen unless it is unchanged since the last capture and no sign of life is due; it says whether
// it read anything. A runtime whose program the host does not run, or whose screen cannot be read, gives a marker
// frame. A screen its layout does not find exportable gives a shield frame, read from the same snapshot it was judged
// by, and every frame carries the runtime's privacy revision.
func (sender *screenSender) capture(now time.Time) (screen.Frame, bool) {
	frame, readable := sender.read(now)
	if !readable {
		return frame, false
	}
	frame.PrivacyRevision = sender.watcher.privacyRevision(sender.runtimeID, frame.Shielded)

	return frame, true
}

// read reads the screen, or the marker that says why there is none, before its privacy revision is set.
func (sender *screenSender) read(now time.Time) (screen.Frame, bool) {
	runtimeScreen, found := sender.watcher.readers.ScreenFor(sender.runtimeID)
	if !found {
		sender.lastCapture = nil
		marker := sender.marker(now)
		marker.NoTerminal = true
		return marker, true
	}

	reader := runtimeScreen.Reader
	if reader.Unreadable() {
		sender.lastCapture = nil
		marker := sender.marker(now)
		marker.Unreadable = true
		return marker, true
	}

	version := reader.Version()
	capture := screenCapture{reader: reader, version: version}
	unchanged := sender.lastCapture != nil && sender.lastCapture.isSameAs(capture)
	if unchanged && !sender.signOfLifeDue(now) {
		return screen.Frame{}, false
	}
	sender.lastCapture = &capture

	frame := reader.ExportFrame(runtimeScreen.Layout, sender.watcher.epoch, sender.sequence+1, now)

	return frame.Bounded(screen.FrameLimit), true
}

// marker is a frame with no screen in it, which says why by the flag the caller sets.
func (sender *screenSender) marker(now time.Time) screen.Frame {
	return screen.Frame{Epoch: sender.watcher.epoch, Captured: now, Rows: [][]screen.Run{}, Buffer: contracts.NormalBuffer}
}

func (sender *screenSender) signOfLifeDue(now time.Time) bool {
	return !sender.sentAny || now.Sub(sender.lastSentAt) >= sender.watcher.signOfLife
}

func (sender *screenSender) logFailure(now time.Time, err error) {
	if now.Sub(sender.lastLoggedAt) < failureLogInterval {
		return
	}
	sender.lastLoggedAt = now
	log.Printf("the screen of runtime %s was not reported: %v", sender.runtimeID, err)
}

// sameScreen says whether two frames show the same screen, whatever their numbering and capture time.
func sameScreen(first, second screen.Frame) bool {
	first.Epoch, first.Sequence, first.Captured = "", 0, time.Time{}
	second.Epoch, second.Sequence, second.Captured = "", 0, time.Time{}
	first.Stream, first.Proof, first.ExpiresAt = "", 0, time.Time{}
	second.Stream, second.Proof, second.ExpiresAt = "", 0, time.Time{}
	return reflect.DeepEqual(first, second)
}
