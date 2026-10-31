package main

import (
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestTheAnswerIsPrintedAsHookShPrintsIt(t *testing.T) {
	root := project(t, "8431")
	missed := `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "additionalContext": "[journal] The journal did not answer within 5 seconds, so this went through unchecked. Investigate now: curl -s http://127.0.0.1:8431/journal/health should answer 200, and runtime/server.log in .journal says why it does not."}}` + "\n"
	cases := []struct {
		name    string
		program string
		event   string
		status  int
		answer  string
		stdout  string
		stderr  string
		code    int
	}{
		{"claude allowed", "claude", "pre_tool_use", 200, `{"hookSpecificOutput": {"permissionDecision": "allow"}}`, `{"hookSpecificOutput": {"permissionDecision": "allow"}}`, "", 0},
		{"codex allowed", "codex", "pre_tool_use", 200, `{}`, `{}`, "", 0},
		{"claude blocked with its own answer", "claude", "pre_tool_use", 409, `{"answer": {"hookSpecificOutput": {"permissionDecision": "deny"}}, "error": "no"}`, `{"hookSpecificOutput": {"permissionDecision": "deny"}}`, "", 0},
		{"codex blocked with its own answer", "codex", "prompt", 409, `{"answer": {"decision": "block"}, "error": "no"}`, `{"decision": "block"}`, "", 0},
		{"claude blocked with a reason", "claude", "stop", 409, `{"error": "finish the task first\nthen stop"}`, "", "finish the task first\nthen stop", 2},
		{"codex blocked with a reason", "codex", "pre_tool_use", 409, `{"error": "not this one"}`, "", "not this one", 2},
		{"claude told the journal did not answer", "claude", "pre_tool_use", 0, "", missed, "", 0},
		{"claude stop goes on without a line", "claude", "stop", 0, "", "", "", 0},
		{"codex goes on without a line", "codex", "pre_tool_use", 0, "", "", "", 0},
	}
	for _, sample := range cases {
		var stdout, stderr strings.Builder
		code := ExitCode(&stdout, &stderr, sample.program, sample.event, sample.status, []byte(sample.answer), root, LimitFor(sample.event))
		if code != sample.code || stdout.String() != sample.stdout || stderr.String() != sample.stderr {
			t.Errorf("%s: exit %d\n stdout %q\n stderr %q", sample.name, code, stdout.String(), stderr.String())
		}
	}
}

func TestTheJournalsOwnRepositoryIsAskedForThePanicWatch(t *testing.T) {
	root := project(t, "8431")
	writeFile(t, filepath.Join(root, "src", "journal", "hooks", "hook.sh"), "#!/bin/sh\n")
	var stdout strings.Builder
	ExitCode(&stdout, &strings.Builder{}, "claude", "prompt", 0, nil, root, 8*time.Second)
	if !strings.Contains(stdout.String(), `"hookEventName": "UserPromptSubmit"`) || !strings.Contains(stdout.String(), "within 8 seconds") || !strings.Contains(stdout.String(), "start the panic watch") {
		t.Errorf("printed %s", stdout.String())
	}
}
