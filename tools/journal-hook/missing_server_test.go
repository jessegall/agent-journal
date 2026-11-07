package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestMissingServerKeepsTheFirstManagedRefusal(t *testing.T) {
	for _, run := range []ForeignRun{
		{ExitCode: 2, Stdout: "native output", Stderr: "reason"},
		{Stdout: `{"hookSpecificOutput":{"permissionDecision":"deny","permissionDecisionReason":"unsafe"}}`},
		{Stdout: `{"decision":"block","reason":"unfinished"}`},
	} {
		var stdout, stderr bytes.Buffer
		runs := []ForeignRun{{Stdout: `{"hookSpecificOutput":{"permissionDecision":"allow"}}`}, run, {ExitCode: 2, Stderr: "later"}}
		program := hookProgram
		program.Refusals = map[string]string{"stop": "block"}
		if strings.Contains(run.Stdout, `"permissionDecision":"deny"`) {
			program.Refusals = map[string]string{"stop": "deny"}
		}
		decodeRuns(program, "stop", runs)
		code, handled := answerWithoutServer(&stdout, &stderr, "stop", runs)
		if !handled || code != run.ExitCode || stdout.String() != run.Stdout || stderr.String() != run.Stderr {
			t.Fatalf("native refusal changed: %d %t %q %q", code, handled, stdout.String(), stderr.String())
		}
	}
}

func TestMissingServerLeavesAnAllowingToolHookToTheExistingAnswer(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code, handled := answerWithoutServer(&stdout, &stderr, "pre_tool_use", []ForeignRun{{Stdout: `{"hookSpecificOutput":{"permissionDecision":"allow"}}`}})
	if handled || code != 0 || stdout.Len() != 0 || stderr.Len() != 0 {
		t.Fatal("an allowing hook replaced the existing unchecked answer")
	}
}

func TestMissingServerStillHoldsAStopWithoutAManagedRefusal(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code, handled := answerWithoutServer(&stdout, &stderr, "stop", []ForeignRun{{Stdout: `{"hookSpecificOutput":{"permissionDecision":"allow"}}`}})
	if !handled || code != 0 || stdout.String() != heldStop() || stderr.Len() != 0 {
		t.Fatal("the stop was not held")
	}
}

func TestManagedRefusalExcludesFailedOrTimedOutRuns(t *testing.T) {
	for _, run := range []ForeignRun{
		{ExitCode: 2, TimedOut: true},
		{ExitCode: -1, Stdout: `{"decision":"block"}`},
		{ExitCode: 7, Stdout: `{"hookSpecificOutput":{"permissionDecision":"deny"}}`},
		{Stdout: "invalid JSON"},
		{Stdout: `{"hookSpecificOutput":{"permissionDecision":"ask"}}`},
		{Stdout: `{"systemMessage":"notice"}`},
	} {
		if foreignRunReply(hookProgram, "stop", run).Refusal != "" {
			t.Fatalf("non-refusal counted: %#v", run)
		}
	}
}

// journalWithProgram is a project whose journal program only notes that it ran.
func journalWithProgram(t *testing.T) (root, ranFile string) {
	t.Helper()
	root = t.TempDir()
	bin := filepath.Join(root, ".journal", "bin")
	if err := os.MkdirAll(bin, 0o755); err != nil {
		t.Fatal(err)
	}
	ranFile = filepath.Join(root, "ran")
	script := "#!/bin/sh\ntouch '" + ranFile + "'\n"
	if err := os.WriteFile(filepath.Join(bin, "journal"), []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
	return root, ranFile
}

func TestAHookThatFindsNoServerStartsOne(t *testing.T) {
	root, ranFile := journalWithProgram(t)
	startMissingServer(root)
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		if _, err := os.Stat(ranFile); err == nil {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("the journal program did not run")
}

func TestAHookStartsNothingWhileTheSocketIsThere(t *testing.T) {
	root, ranFile := journalWithProgram(t)
	if err := os.WriteFile(filepath.Join(root, ".journal", "server.sock"), nil, 0o644); err != nil {
		t.Fatal(err)
	}
	startMissingServer(root)
	time.Sleep(200 * time.Millisecond)
	if _, err := os.Stat(ranFile); err == nil {
		t.Fatal("a server was started beside the one that holds the socket")
	}
}
