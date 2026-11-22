package recording

import (
	"testing"
	"time"
)

func TestASuppressedRecorderKeepsNoBytesLengthsOrTimes(t *testing.T) {
	recorder := NewRecorder(Fixture{}, time.Now)
	recorder.Output("stdout", []byte("before"))

	if !recorder.Suppress() {
		t.Fatal("the recorder did not confirm its suppression")
	}
	recorder.Output("stdout", []byte("secret"))
	recorder.Input([]byte("hunter2"), true)
	recorder.Resize(Geometry{Rows: 24, Columns: 80})
	fixture := recorder.Finish(0)

	if len(fixture.Output) != 1 || len(fixture.Inputs) != 0 || len(fixture.Resizes) != 0 {
		t.Fatalf("the suppressed recorder kept %d outputs, %d inputs, %d resizes",
			len(fixture.Output), len(fixture.Inputs), len(fixture.Resizes))
	}
}
