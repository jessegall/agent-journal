package host

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"journal-agent/recording"
)

func TestARecordingKeepsNothingTypedDuringALoginAndIsCutAtItsBound(t *testing.T) {
	clock := recording.NewFakeClock(time.Unix(0, 0))
	rec := StartRecording(t.TempDir(), "runtime", recording.Fixture{}, RecordingBounds{MaxBytes: 10, MaxAge: time.Hour}, clock.Now)

	rec.Output("stdout", []byte("hello"))
	rec.PauseForUser()
	rec.Input([]byte("my-password"), false)
	rec.ResumeAfterUser()
	rec.Input([]byte("ok"), false)
	rec.Output("stdout", []byte("more than the bound"))

	folder, err := rec.Stop(0)
	if err != nil {
		t.Fatalf("the recording was not saved: %v", err)
	}
	fixture, err := recording.Load(folder)
	if err != nil {
		t.Fatalf("the recording could not be read back: %v", err)
	}
	if len(fixture.Inputs) != 2 || fixture.Inputs[0].Bytes != nil || fixture.Inputs[0].Length != len("my-password") {
		t.Fatalf("the login input was kept: %+v", fixture.Inputs)
	}
	if string(fixture.Inputs[1].Bytes) != "ok" || len(fixture.Output) != 1 || fixture.Cut == "" {
		t.Fatalf("the recording kept %+v, cut %q", fixture.Output, fixture.Cut)
	}
	info, err := os.Stat(filepath.Join(folder, recording.FileName))
	if err != nil || info.Mode().Perm() != secretFileMode {
		t.Fatalf("the recording file is readable by others: %v %v", info.Mode(), err)
	}
}
