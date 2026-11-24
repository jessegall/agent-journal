package host

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"journal-agent/recording"
)

// ErrNoRecording is returned when a recording is stopped while none runs.
var ErrNoRecording = errors.New("no recording runs for this runtime")

// RecordingBounds caps one on-demand recording: its output bytes and its length. A recording that reaches either is
// cut, says so, and is saved.
type RecordingBounds struct {
	MaxBytes int
	MaxAge   time.Duration
}

// DefaultRecordingBounds keep a recording to what one investigation needs: a few minutes of screen output.
var DefaultRecordingBounds = RecordingBounds{MaxBytes: 8 << 20, MaxAge: 30 * time.Minute}

// RuntimeRecording records one runtime on an operator's request, redacted as it is written: output keeps no email
// address, and nothing typed is kept while the program waits for a user or a login, nor any secret input.
type RuntimeRecording struct {
	mutex    sync.Mutex
	folder   string
	bounds   RecordingBounds
	now      func() time.Time
	started  time.Time
	recorder *recording.Recorder
	bytes    int
	paused   bool
	cut      string
	// suppressed is a recording a capture barrier stopped before private entry: it keeps no bytes, length or time.
	suppressed bool
}

// Suppress stops the recording for private entry; it confirms at once, as nothing is kept from now on.
func (rec *RuntimeRecording) Suppress() bool {
	rec.mutex.Lock()
	defer rec.mutex.Unlock()

	rec.suppressed = true

	return rec.recorder.Suppress()
}

// StartRecording begins a recording of the runtime, to be saved in its own folder under the host's state folder.
func StartRecording(stateFolder string, runtimeID string, base recording.Fixture, bounds RecordingBounds, now func() time.Time) *RuntimeRecording {
	started := now()
	folder := filepath.Join(stateFolder, "recordings", fmt.Sprintf("%s-%d", runtimeID, started.Unix()))

	return &RuntimeRecording{
		folder:   folder,
		bounds:   bounds,
		now:      now,
		started:  started,
		recorder: recording.NewRecorder(base, now),
	}
}

// Output records what the program wrote, until the recording reaches a bound and is cut.
func (rec *RuntimeRecording) Output(stream string, bytes []byte) {
	rec.mutex.Lock()
	defer rec.mutex.Unlock()

	if rec.cut != "" || rec.suppressed {
		return
	}
	if rec.bytes+len(bytes) > rec.bounds.MaxBytes {
		rec.cut = fmt.Sprintf("reached its size bound of %d bytes", rec.bounds.MaxBytes)
		return
	}
	if rec.now().Sub(rec.started) > rec.bounds.MaxAge {
		rec.cut = fmt.Sprintf("reached its time bound of %s", rec.bounds.MaxAge)
		return
	}
	rec.bytes += len(bytes)
	rec.recorder.Output(stream, bytes)
}

// Input records what was typed: only its length while the program waits for a user or a login, or when it is a
// secret.
func (rec *RuntimeRecording) Input(bytes []byte, secret bool) {
	rec.mutex.Lock()
	defer rec.mutex.Unlock()

	if rec.cut != "" {
		return
	}
	rec.recorder.Input(bytes, secret || rec.paused)
}

// PauseForUser stops keeping typed input while the program waits for a user or a login.
func (rec *RuntimeRecording) PauseForUser() {
	rec.mutex.Lock()
	defer rec.mutex.Unlock()
	rec.paused = true
}

// ResumeAfterUser keeps typed input again once the user or login step is over.
func (rec *RuntimeRecording) ResumeAfterUser() {
	rec.mutex.Lock()
	defer rec.mutex.Unlock()
	rec.paused = false
}

// Stop finishes the recording and saves it in the host's private state, readable by the host's user only; it
// answers the folder it wrote.
func (rec *RuntimeRecording) Stop(exitCode int) (string, error) {
	rec.mutex.Lock()
	cut := rec.cut
	rec.mutex.Unlock()

	fixture := rec.recorder.Finish(exitCode)
	fixture.Cut = cut
	if err := fixture.Save(rec.folder); err != nil {
		return "", err
	}
	if err := os.Chmod(rec.folder, stateFolderMode); err != nil {
		return "", err
	}

	return rec.folder, os.Chmod(filepath.Join(rec.folder, recording.FileName), secretFileMode)
}
