package recording

import (
	"regexp"
	"sync"
	"time"
)

// emailAddress matches an address a program prints, such as the signed-in account on a status screen; a recording
// keeps none (fixtures are committed evidence).
var emailAddress = regexp.MustCompile(`[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`)

// Recorder collects the events of a running session into a fixture, safely from several goroutines.
type Recorder struct {
	mutex   sync.Mutex
	started time.Time
	now     func() time.Time
	fixture Fixture
}

// NewRecorder starts a recording at the clock's current time.
func NewRecorder(fixture Fixture, now func() time.Time) *Recorder {
	started := now()
	fixture.RecordedAt = started

	return &Recorder{started: started, now: now, fixture: fixture}
}

// Output records bytes the program wrote on a stream.
func (recorder *Recorder) Output(stream string, bytes []byte) {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()

	redacted := emailAddress.ReplaceAllFunc(append([]byte(nil), bytes...), func(address []byte) []byte {
		return []byte("<redacted>")
	})
	recorder.fixture.Output = append(recorder.fixture.Output, OutputChunk{Offset: recorder.offset(), Stream: stream, Bytes: redacted})
}

// Input records what the user typed; secret input keeps only its length.
func (recorder *Recorder) Input(bytes []byte, secret bool) {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()

	event := InputEvent{Offset: recorder.offset(), Secret: secret, Length: len(bytes)}
	if !secret {
		event.Bytes = append([]byte(nil), bytes...)
	}

	recorder.fixture.Inputs = append(recorder.fixture.Inputs, event)
}

// Resize records a new terminal size.
func (recorder *Recorder) Resize(geometry Geometry) {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()

	recorder.fixture.Resizes = append(recorder.fixture.Resizes, ResizeEvent{Offset: recorder.offset(), Geometry: geometry})
}

// Finish records the exit code and gives the fixture.
func (recorder *Recorder) Finish(exitCode int) Fixture {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()

	recorder.fixture.ExitCode = exitCode

	return recorder.fixture
}

func (recorder *Recorder) offset() time.Duration {
	return recorder.now().Sub(recorder.started)
}
