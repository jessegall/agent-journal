package recording_test

import (
	"bytes"
	"strings"
	"testing"

	"journal-runner/recorded"
	"journal-runner/recording"
)

func TestRecordKeysKeepsEveryByteAndDrawsOnlyWhatWasTyped(t *testing.T) {
	_, fixture := recorded.MustTerminal(t, "change-model")
	var typed, record, screen bytes.Buffer
	for _, input := range fixture.Inputs {
		typed.Write(input.Bytes)
	}

	if err := recording.RecordKeys(bytes.NewReader(typed.Bytes()), &record, &screen); err != nil {
		t.Fatal(err)
	}

	want := strings.NewReplacer("\x1b[200~", "", "\x1b[201~", "", "\r", "\r\n").Replace(typed.String())
	if !bytes.Equal(record.Bytes(), typed.Bytes()) || screen.String() != want {
		t.Fatalf("recorded %q and drew %q", record.String(), screen.String())
	}
}
