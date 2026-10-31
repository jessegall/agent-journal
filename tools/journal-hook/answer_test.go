package main

import (
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

func TestAnUnansweredClaudeToolUseIsToldTheJournalDidNotAnswerAndAStopGoesOnWithoutALine(t *testing.T) {
	root := project(t, "8431")
	claude := programs.LoadTable("").Programs["claude"]
	var lineAnswer, stopAnswer strings.Builder
	Answered(&lineAnswer, &strings.Builder{}, claude, "PreToolUse", "pre_tool_use", 0, nil, root, 5*time.Second)
	Answered(&stopAnswer, &strings.Builder{}, claude, "Stop", "stop", 0, nil, root, 5*time.Second)
	if !strings.Contains(lineAnswer.String(), "did not answer within 5 seconds") || !strings.Contains(lineAnswer.String(), "127.0.0.1:8431") || stopAnswer.String() != "" {
		t.Errorf("printed %q and %q", lineAnswer.String(), stopAnswer.String())
	}
}

func TestTheJournalsOwnRepositoryIsAskedForThePanicWatch(t *testing.T) {
	root := project(t, "8431")
	writeFile(t, filepath.Join(root, "src", "journal", "hooks", "hook.sh"), "#!/bin/sh\n")
	var stdout strings.Builder
	Answered(&stdout, &strings.Builder{}, programs.LoadTable("").Programs["claude"], "UserPromptSubmit", "prompt", 0, nil, root, 8*time.Second)
	if !strings.Contains(stdout.String(), `"hookEventName":"UserPromptSubmit"`) || !strings.Contains(stdout.String(), "within 8 seconds") || !strings.Contains(stdout.String(), "start the panic watch") {
		t.Errorf("printed %s", stdout.String())
	}
}

func shippedAnswer(program, hookName, event string, reply Reply) (string, string, int) {
	return ProgramAnswer(programs.LoadTable("").Programs[program], hookName, event, reply)
}

func TestARefusedClaudeToolUseIsDeniedInClaudesOwnAnswer(t *testing.T) {
	stdout, stderr, code := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{Refusal: "no git here"})
	if code != 0 || stderr != "" || !strings.Contains(stdout, `"permissionDecision":"deny"`) || !strings.Contains(stdout, "no git here") {
		t.Fatalf("printed %q %q %d", stdout, stderr, code)
	}
}

func TestARefusedClaudeStopIsBlockedWithItsReason(t *testing.T) {
	stdout, _, code := shippedAnswer("claude", "Stop", "stop", Reply{Refusal: "task 1 is yours now"})
	if code != 0 || !strings.Contains(stdout, `"decision":"block"`) || !strings.Contains(stdout, "task 1 is yours now") {
		t.Fatalf("printed %q %d", stdout, code)
	}
}

func TestARefusalWithNoStyleGoesToStderrWithExitCodeTwo(t *testing.T) {
	stdout, stderr, code := shippedAnswer("codex", "PreToolUse", "pre_tool_use", Reply{Refusal: "no git here"})
	if code != 2 || stdout != "" || stderr != "no git here" {
		t.Fatalf("printed %q %q %d", stdout, stderr, code)
	}
}

func TestLinesRideOnAnEventThatTakesThemAndAreDroppedElsewhere(t *testing.T) {
	lineEventAnswer, _, _ := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{Lines: []string{"log your task"}})
	otherEventAnswer, _, _ := shippedAnswer("claude", "SessionEnd", "session_end", Reply{Lines: []string{"log your task"}})
	if !strings.Contains(lineEventAnswer, `"additionalContext":"log your task"`) || otherEventAnswer != "" {
		t.Fatalf("printed %q and %q", lineEventAnswer, otherEventAnswer)
	}
}

func TestAnUnansweredCodexHookTellsTheAgentToo(t *testing.T) {
	stdout, _, code := shippedAnswer("codex", "SessionStart", "session_start", Reply{Lines: []string{missedLine(t.TempDir(), 3*time.Second)}})
	if code != 0 || !strings.Contains(stdout, "did not answer within 3 seconds") {
		t.Fatalf("printed %q %d", stdout, code)
	}
}
