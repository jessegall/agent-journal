package recording

import (
	"sync"
	"time"
)

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

	recorder.fixture.Output = append(recorder.fixture.Output, OutputChunk{Offset: recorder.offset(), Stream: stream, Bytes: append([]byte(nil), bytes...)})
}

// Input records what the person typed; secret input keeps only its length.
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
