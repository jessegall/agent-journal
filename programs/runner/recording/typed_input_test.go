package recording

import (
	"strings"
	"testing"
)

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
