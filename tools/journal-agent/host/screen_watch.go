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

// failureLogInterval is how often a runtime's failed reports are logged at most.
const failureLogInterval = time.Minute

// ScreenReporter sends one frame of a runtime's screen to the journal.
type ScreenReporter interface {
	ReportScreen(ctx context.Context, runtimeID string, frame screen.Frame) error
}

// ScreenReaders finds the screen of a runtime's program while the host runs it.
type ScreenReaders interface {
	ReaderFor(runtimeID string) (*screen.EmulatorReader, bool)
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
}

// screenWatch is one watched runtime's sender: its interval and how to stop it.
type screenWatch struct {
	interval time.Duration
	cancel   context.CancelFunc
}

// NewScreenWatcher makes a watcher whose senders end with ctx; its epoch is new for every host process, so frames of
// a restarted host are never taken for old ones.
func NewScreenWatcher(ctx context.Context, reporter ScreenReporter, readers ScreenReaders) (*ScreenWatcher, error) {
	random := make([]byte, 8)
	if _, err := rand.Read(random); err != nil {
		return nil, err
	}
	return &ScreenWatcher{
		reporter:   reporter,
		readers:    readers,
		now:        time.Now,
		epoch:      hex.EncodeToString(random),
		signOfLife: signOfLife,
		ctx:        ctx,
		watching:   map[string]*screenWatch{},
	}, nil
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
		ctx, cancel := context.WithCancel(watcher.ctx)
		watch := &screenWatch{interval: interval, cancel: cancel}
		watcher.watching[runtimeID] = watch
		sender := &screenSender{watcher: watcher, runtimeID: runtimeID}
		go func() {
			sender.run(ctx, interval)
			watcher.stopped(runtimeID, watch)
		}()
	}
}

// stopped drops a sender that ended by itself, so the next list that names its runtime starts it again.
func (watcher *ScreenWatcher) stopped(runtimeID string, ended *screenWatch) {
	watcher.mutex.Lock()
	defer watcher.mutex.Unlock()
	if watcher.watching[runtimeID] == ended {
		delete(watcher.watching, runtimeID)
	}
}

// screenSender is one runtime's capture loop and what it last sent.
type screenSender struct {
	watcher      *ScreenWatcher
	runtimeID    string
	sequence     uint64
	reader       *screen.EmulatorReader
	version      uint64
	captured     bool
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
	err := sender.watcher.reporter.ReportScreen(ctx, sender.runtimeID, frame)
	var refused client.ScreenRefused
	if errors.As(err, &refused) {
		sender.logFailure(now, err)
		return true
	}
	if err != nil {
		sender.captured = false
		sender.logFailure(now, err)
		return false
	}
	sender.sequence++
	sender.lastSent, sender.lastSentAt, sender.sentAny = frame, now, true
	return false
}

// capture reads the screen unless it is unchanged since the last capture and no sign of life is due; it says whether
// it read anything. A runtime whose program the host does not run, or whose screen cannot be read, gives a marker
// frame.
func (sender *screenSender) capture(now time.Time) (screen.Frame, bool) {
	reader, found := sender.watcher.readers.ReaderFor(sender.runtimeID)
	if !found {
		sender.reader, sender.captured = nil, false
		marker := sender.marker(now)
		marker.NoTerminal = true
		return marker, true
	}

	if reader.Unreadable() {
		sender.captured = false
		marker := sender.marker(now)
		marker.Unreadable = true
		return marker, true
	}

	version := reader.Version()
	unchanged := sender.captured && reader == sender.reader && version == sender.version
	if unchanged && !sender.signOfLifeDue(now) {
		return screen.Frame{}, false
	}
	sender.reader, sender.version, sender.captured = reader, version, true

	return reader.Frame(sender.watcher.epoch, sender.sequence+1, now).Bounded(screen.FrameLimit), true
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
	return reflect.DeepEqual(first, second)
}
