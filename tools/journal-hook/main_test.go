package main

import (
	"bufio"
	"bytes"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

// The binary built without cgo for this machine runs one recorded body: with no journal to answer, it goes on, tells
// Claude so, and notes the hook in bypass.log; with the journal not on, it does nothing.
func TestTheBuiltBinaryRunsARecordedBody(t *testing.T) {
	binary := filepath.Join(t.TempDir(), "journal-hook")
	build, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()
	command := exec.CommandContext(build, "go", "build", "-o", binary, ".")
	command.Env = append(os.Environ(), "CGO_ENABLED=0")
	if output, err := command.CombinedOutput(); err != nil {
		t.Fatalf("go build: %v\n%s", err, output)
	}
	body := firstLine(t, filepath.Join("testdata", "recorded", "claude", "PreToolUse.jsonl"))
	root := project(t, "")

	stdout, code := run(t, binary, root, body, "AGENT_JOURNAL_ACTIVE=1", "JOURNAL_ENV=scratch")
	if code != 0 || !strings.Contains(stdout, `"hookEventName":"PreToolUse"`) || !strings.Contains(stdout, "did not answer within 5 seconds") {
		t.Errorf("exit %d, printed %q", code, stdout)
	}
	if read(t, filepath.Join(root, ".journal", "runtime", "bypass.log")) == "" || read(t, filepath.Join(root, ".journal", "runtime", "hooks", "scratch.fired")) == "" {
		t.Error("the hook was not stamped and noted")
	}

	inactive := project(t, "")
	if stdout, code := run(t, binary, inactive, body, "AGENT_JOURNAL_ACTIVE=0"); code != 0 || stdout != "" {
		t.Errorf("an inactive project: exit %d, printed %q", code, stdout)
	}
}

func run(t *testing.T, binary, root string, body []byte, variables ...string) (string, int) {
	t.Helper()
	limit, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	command := exec.CommandContext(limit, binary, "claude", root)
	command.Env = append(os.Environ(), variables...)
	command.Stdin = bytes.NewReader(body)
	output, err := command.Output()
	if exit, present := err.(*exec.ExitError); present {
		return string(output), exit.ExitCode()
	}
	if err != nil {
		t.Fatal(err)
	}
	return string(output), 0
}

func firstLine(t *testing.T, path string) []byte {
	t.Helper()
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	scanner.Scan()
	return append([]byte(nil), scanner.Bytes()...)
}
