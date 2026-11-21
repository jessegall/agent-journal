package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"journal-agent/host"
)

type windowsSeen struct {
	readings chan host.WindowReading
}

func (seen windowsSeen) Window(reading host.WindowReading) {
	seen.readings <- reading
}

const statusLineInput = `{"model":{"id":"claude"},"workspace":{"current_dir":"/work"},` +
	`"rate_limits":{"seven_day":{"used_percentage":42,"resets_at":1764500000}}}`

func TestTheStatusLineHandsItsWindowToTheStartsRelayAndPrintsNothingOfItsOwn(t *testing.T) {
	folder, err := os.MkdirTemp("", "sl")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.RemoveAll(folder) })
	relay := filepath.Join(folder, "s.sock")
	seen := windowsSeen{readings: make(chan host.WindowReading, 4)}
	relays := &host.StatusLineRelays{}
	if err := relays.Open("runtime-1", relay, seen); err != nil {
		t.Fatal(err)
	}
	var printed bytes.Buffer

	runStatusLine([]string{"--relay", relay}, strings.NewReader(statusLineInput), &printed)

	select {
	case reading := <-seen.readings:
		if reading.Slot != "seven_day" || *reading.UsedPercent != 42 || reading.ResetsAt.Unix() != 1764500000 {
			t.Fatalf("relayed %+v", reading)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("no window reached the relay")
	}
	select {
	case reading := <-seen.readings:
		t.Fatalf("a missing five-hour window was relayed: %+v", reading)
	case <-time.After(200 * time.Millisecond):
	}
	if printed.Len() != 0 {
		t.Fatalf("the reader printed %q", printed.String())
	}
}

func TestTheStatusLineEndsAtOnceWithoutItsRelayAndStillRendersTheOneItReplaced(t *testing.T) {
	var printed bytes.Buffer
	began := time.Now()

	runStatusLine([]string{"--relay", filepath.Join(t.TempDir(), "gone.sock"), "--then", "head -c 9; echo ' shown'"},
		strings.NewReader(statusLineInput), &printed)

	if time.Since(began) > 2*time.Second {
		t.Fatal("the reader waited on a relay that is gone")
	}
	if printed.String() != `{"model":`+" shown\n" {
		t.Fatalf("the replaced status line printed %q", printed.String())
	}
}
