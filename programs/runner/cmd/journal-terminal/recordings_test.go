package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-runner/recorded"
	"journal-runner/terminal"
)

func TestTheRecordingCommandsAnnotatePrintAndRenderATerminal(t *testing.T) {
	_, fixture := recorded.MustTerminal(t, "first-start")
	folder := t.TempDir()
	if err := fixture.Save(folder); err != nil {
		t.Fatal(err)
	}
	var output, errors bytes.Buffer
	for _, command := range []string{"annotate", "screen", "render"} {
		if code := run([]string{command, folder}, nil, &output, &errors); code != 0 {
			t.Fatalf("%s failed: %s", command, errors.String())
		}
	}
	if !strings.Contains(output.String(), "exit ") || !strings.Contains(output.String(), "rendered 1 recordings") {
		t.Fatalf("the recording commands printed %q", output.String())
	}
	if _, err := os.Stat(filepath.Join(folder, terminal.FramesFileName)); err != nil {
		t.Fatal(err)
	}
}
