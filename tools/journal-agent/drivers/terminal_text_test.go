package drivers

import (
	"strings"
	"testing"
)

func TestParticipantTextKeepsItsWordsWithNoControlCharacters(t *testing.T) {
	body := "line one\nline two\x1b[201~\r\x03 ```fence``` \x7f end"

	inside := sanitizedText(body)

	if strings.ContainsAny(inside, "\x1b\r\x03\x7f") {
		t.Fatalf("no control character may survive inside the paste, got %q", inside)
	}
	if !strings.Contains(inside, "line one\nline two") || !strings.Contains(inside, "```fence```") {
		t.Fatalf("the participant's words should stay recognizable, got %q", inside)
	}
}
