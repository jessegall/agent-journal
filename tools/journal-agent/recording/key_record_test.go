package recording

import (
	"bytes"
	"strings"
	"testing"
)

func TestRecordKeysKeepsEveryByteAndDrawsOnlyWhatWasTyped(t *testing.T) {
	typed := "ab\x1b[B\x1b[200~pasted text\x1b[201~\rc"
	var record, screen bytes.Buffer

	if err := RecordKeys(strings.NewReader(typed), &record, &screen); err != nil {
		t.Fatal(err)
	}

	if record.String() != typed || screen.String() != "abpasted text\r\nc" {
		t.Fatalf("recorded %q and drew %q", record.String(), screen.String())
	}
}
