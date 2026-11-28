package recording_test

import (
	"errors"
	"io"
	"strings"
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// chunkWriter hands each written chunk on, so a test reads what the replay wrote as it writes it.
type chunkWriter chan string

func (writer chunkWriter) Write(chunk []byte) (int, error) {
	writer <- string(chunk)
	return len(chunk), nil
}

func readChunks(t *testing.T, written chunkWriter, count int) string {
	t.Helper()
	var read []string
	for len(read) < count {
		select {
		case chunk := <-written:
			read = append(read, chunk)
		case <-time.After(2 * time.Second):
			t.Fatalf("the replay wrote %q and then nothing", read)
		}
	}

	return strings.Join(read, "")
}

func assertNothingWritten(t *testing.T, written chunkWriter) {
	t.Helper()
	select {
	case chunk := <-written:
		t.Fatalf("the replay wrote %q before its gate opened", chunk)
	case <-time.After(50 * time.Millisecond):
	}
}

func TestGatedReplayWritesEachGroupOnceItsInputIsTyped(t *testing.T) {
	_, fixture := recorded.MustTerminal(t, "claude-code", "first-start")
	if len(fixture.Inputs) != 2 || len(fixture.Output) != 3 {
		t.Fatal("first-start must have a screen at opening, after typing and after submitting")
	}

	typedIn, typing := io.Pipe()
	defer typedIn.Close()
	defer typing.Close()
	written := make(chunkWriter, len(fixture.Output))
	ended := make(chan error, 1)
	go func() {
		ended <- recording.GatedReplay(fixture, typedIn, written, time.Millisecond, func(recording.Typed) error { return nil })
	}()

	if got := readChunks(t, written, 1); got != string(fixture.Output[0].Bytes) {
		t.Fatalf("before any input the replay wrote %q", got)
	}
	_, _ = typing.Write(fixture.Inputs[1].Bytes)
	assertNothingWritten(t, written)
	_, _ = typing.Write(fixture.Inputs[0].Bytes)
	if got := readChunks(t, written, 1); got != string(fixture.Output[1].Bytes) {
		t.Fatalf("after the pasted prompt the replay wrote %q", got)
	}
	_, _ = typing.Write(fixture.Inputs[1].Bytes)
	if got := readChunks(t, written, 1); got != string(fixture.Output[2].Bytes) {
		t.Fatalf("after submitting the replay wrote %q", got)
	}
	_ = typing.Close()
	if err := <-ended; err != nil {
		t.Fatalf("the replay ended with %v at the end of its input", err)
	}
}

func TestGatedReplayStopsWithWhatItsListenerReturns(t *testing.T) {
	_, fixture := recorded.MustTerminal(t, "claude-code", "first-start")
	stop := errors.New("stop at the first text input")
	typed := strings.NewReader(string(fixture.Inputs[0].Bytes))
	heard := func(piece recording.Typed) error {
		if piece.Type == recording.TypedText {
			return stop
		}
		return nil
	}

	err := recording.GatedReplay(fixture, typed, io.Discard, time.Millisecond, heard)

	if !errors.Is(err, stop) {
		t.Fatalf("the replay ended with %v, not with what its listener returned", err)
	}
}
