package recording

import (
	"errors"
	"io"
	"strings"
	"testing"
	"time"
)

// chunkWriter hands each written chunk on, so a test reads what the replay wrote as it writes it.
type chunkWriter chan string

func (writer chunkWriter) Write(chunk []byte) (int, error) {
	writer <- string(chunk)
	return len(chunk), nil
}

func gatedFixture() Fixture {
	second := time.Second
	return Fixture{
		Inputs: []InputEvent{
			{Offset: 1 * second, Bytes: []byte("\x1b[B")},
			{Offset: 2 * second, Bytes: []byte("\r")},
			{Offset: 3 * second, Bytes: []byte("Count to three")},
			{Offset: 4 * second, Bytes: []byte("\r")},
			{Offset: 6 * second, Bytes: []byte("<SIGTERM>")},
		},
		Output: []OutputChunk{
			{Offset: 0, Bytes: []byte("trust?")},
			{Offset: 1500 * time.Millisecond, Bytes: []byte("banner")},
			{Offset: 2500 * time.Millisecond, Bytes: []byte("ready")},
			{Offset: 3500 * time.Millisecond, Bytes: []byte("echo")},
			{Offset: 4500 * time.Millisecond, Bytes: []byte("1 2")},
			{Offset: 4600 * time.Millisecond, Bytes: []byte(" 3")},
		},
	}
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

	return strings.Join(read, "|")
}

func assertNothingWritten(t *testing.T, written chunkWriter) {
	t.Helper()
	select {
	case chunk := <-written:
		t.Fatalf("the replay wrote %q before its gate opened", chunk)
	case <-time.After(50 * time.Millisecond):
	}
}

func TestGatedReplayPassesTheTrustScreenAndWritesEachGroupOnceItsInputIsTyped(t *testing.T) {
	typedIn, typing := io.Pipe()
	written := make(chunkWriter, 16)
	ended := make(chan error, 1)
	go func() {
		ended <- GatedReplay(gatedFixture(), typedIn, written, time.Millisecond, func(Typed) error { return nil })
	}()

	if got := readChunks(t, written, 3); got != "trust?|banner|ready" {
		t.Fatalf("before any input the replay wrote %q", got)
	}
	_, _ = typing.Write([]byte("\r"))
	assertNothingWritten(t, written)
	_, _ = typing.Write([]byte("\x1b[200~Say hello\x1b[201~"))
	if got := readChunks(t, written, 1); got != "echo" {
		t.Fatalf("after the pasted prompt the replay wrote %q", got)
	}
	_, _ = typing.Write([]byte("\r"))
	if got := readChunks(t, written, 2); got != "1 2| 3" {
		t.Fatalf("after Enter the replay wrote %q", got)
	}
	_ = typing.Close()
	if err := <-ended; err != nil {
		t.Fatalf("the replay ended with %v at the end of its input", err)
	}
}

func TestGatedReplayStopsWithWhatItsListenerReturns(t *testing.T) {
	stop := errors.New("crash")
	typed := strings.NewReader("crash")
	heard := func(piece Typed) error {
		if piece.Type == TypedText && string(piece.Bytes) == "crash" {
			return stop
		}
		return nil
	}

	err := GatedReplay(gatedFixture(), typed, make(chunkWriter, 16), time.Millisecond, heard)

	if !errors.Is(err, stop) {
		t.Fatalf("the replay ended with %v, not with what its listener returned", err)
	}
}

func TestTypedInputSplitsPastesEscapeSequencesKeysAndText(t *testing.T) {
	pieces := typedOf([]byte("\x1b[200~a\rb\x1b[201~\x1b[Bok\r\x1b"))

	var got []string
	for _, piece := range pieces {
		kind := "key"
		if piece.Type == TypedText {
			kind = "text"
		}
		got = append(got, kind+":"+string(piece.Bytes))
	}
	want := "text:a\rb|key:\x1b[B|text:ok|key:\r|key:\x1b"
	if strings.Join(got, "|") != want {
		t.Fatalf("got %q, want %q", strings.Join(got, "|"), want)
	}
}
