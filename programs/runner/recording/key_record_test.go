package recording_test

import (
	"bytes"
	"testing"

	"journal-runner/recorded"
	"journal-runner/recording"
)

func TestRecordKeysKeepsEveryByteAndDrawsOnlyWhatWasTyped(t *testing.T) {
	_, fixture := recorded.MustTerminal(t, "claude-code", "change-model")
	var typed, record, screen bytes.Buffer
	for _, input := range fixture.Inputs {
		typed.Write(input.Bytes)
	}

	if err := recording.RecordKeys(bytes.NewReader(typed.Bytes()), &record, &screen); err != nil {
		t.Fatal(err)
	}

	want := "Check your pending journal work.\r\n/model claude-sonnet-5-5\r\n\r\nRun: ls.\r\n"
	if !bytes.Equal(record.Bytes(), typed.Bytes()) || screen.String() != want {
		t.Fatalf("recorded %q and drew %q", record.String(), screen.String())
	}
}
