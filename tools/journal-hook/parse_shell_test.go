package main

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

func TestParseShellWritesTheLineAsTheHookSendsIt(t *testing.T) {
	var output bytes.Buffer
	if err := parseShell(strings.NewReader("sed -i s/a/b/ cart.py"), &output, ""); err != nil {
		t.Fatal(err)
	}
	var line event.ShellLine
	if err := json.Unmarshal(output.Bytes(), &line); err != nil {
		t.Fatal(err)
	}
	if line.Line != "sed -i s/a/b/ cart.py" || len(line.Parts) != 1 {
		t.Fatalf("parsed %+v", line)
	}
}
