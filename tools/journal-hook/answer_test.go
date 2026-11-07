package main

import (
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
	if !strings.Contains(lineAnswer.String(), "did not answer within 5 seconds") || !strings.Contains(lineAnswer.String(), "server.sock") || stopAnswer.String() != "" {
		t.Errorf("printed %q and %q", lineAnswer.String(), stopAnswer.String())
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

func TestLinesGoOnAnEventThatTakesThemAndAreDroppedElsewhere(t *testing.T) {
	lineEventAnswer, _, _ := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{Lines: []string{"log your task"}})
	otherEventAnswer, _, _ := shippedAnswer("claude", "SessionEnd", "session_end", Reply{Lines: []string{"log your task"}})
	if !strings.Contains(lineEventAnswer, `"additionalContext":"log your task"`) || otherEventAnswer != "" {
		t.Fatalf("printed %q and %q", lineEventAnswer, otherEventAnswer)
	}
}

func TestAnUnansweredCodexHookTellsTheAgentToo(t *testing.T) {
	stdout, _, code := shippedAnswer("codex", "SessionStart", "session_start", Reply{Lines: []string{missedLine(3 * time.Second)}})
	if code != 0 || !strings.Contains(stdout, "did not answer within 3 seconds") {
		t.Fatalf("printed %q %d", stdout, code)
	}
}

func TestARewrittenClaudeToolUseIsAllowedWithItsNewInputRunInTheForeground(t *testing.T) {
	stdout, stderr, code := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{UpdatedInput: map[string]any{"command": "journal-run 4 -- ls"}})
	want := `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","updatedInput":{"command":"journal-run 4 -- ls","run_in_background":false}}}` + "\n"
	if code != 0 || stderr != "" || stdout != want {
		t.Fatalf("printed %q %q %d, want %q", stdout, stderr, code, want)
	}
}

func TestARewrittenCodexToolUseCarriesTheCommandOnly(t *testing.T) {
	stdout, _, code := shippedAnswer("codex", "PreToolUse", "pre_tool_use", Reply{UpdatedInput: map[string]any{"command": "journal-run 4 -- ls"}})
	want := `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","updatedInput":{"command":"journal-run 4 -- ls"}}}` + "\n"
	if code != 0 || stdout != want {
		t.Fatalf("printed %q %d, want %q", stdout, code, want)
	}
}

func TestARewriteWithLinesKeepsTheLines(t *testing.T) {
	stdout, _, _ := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{UpdatedInput: map[string]any{"command": "journal-run 4 -- ls"}, Lines: []string{"log your task"}})
	if !strings.Contains(stdout, `"updatedInput"`) || !strings.Contains(stdout, `"additionalContext":"log your task"`) {
		t.Fatalf("printed %q", stdout)
	}
}

func TestARefusalPrintedThroughARewrittenCommandIsAllowedAndShowsTheRefusalAsOutput(t *testing.T) {
	stdout, stderr, code := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{Refusal: "no git here", UpdatedInput: map[string]any{"command": "printf '%s' 'no git here'"}})
	if code != 0 || stderr != "" || strings.Contains(stdout, `"deny"`) || !strings.Contains(stdout, `"permissionDecision":"allow"`) || !strings.Contains(stdout, "no git here") {
		t.Fatalf("printed %q %q %d", stdout, stderr, code)
	}
}

func TestAReplyWithNoRewriteStaysAsItWas(t *testing.T) {
	stdout, _, _ := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{Lines: []string{"log your task"}})
	if strings.Contains(stdout, "updatedInput") {
		t.Fatalf("printed %q", stdout)
	}
}

func TestALineForTheTerminalGoesWithTheAnswerAndAloneWhenThereIsNoOther(t *testing.T) {
	claude := programs.LoadTable("").Programs["claude"]
	with, _, _ := ProgramAnswer(claude, "PreToolUse", "pre_tool_use", Reply{Lines: []string{"a line"}, Terminal: "hook pre_tool_use 12 ms"})
	terminalOnly, _, _ := ProgramAnswer(claude, "Stop", "stop", Reply{Terminal: "hook stop 9 ms"})
	if !strings.Contains(with, `"additionalContext":"a line"`) || !strings.Contains(with, `"systemMessage":"hook pre_tool_use 12 ms"`) {
		t.Errorf("printed %q", with)
	}
	if terminalOnly != "{\"systemMessage\":\"hook stop 9 ms\"}\n" {
		t.Errorf("printed %q", terminalOnly)
	}
}

func TestLinesReachAnAgentAfterAToolAndNeverAtAStop(t *testing.T) {
	line := "dump 1 is not filed"
	after, _, _ := shippedAnswer("claude", "PostToolUse", "post_tool_use", Reply{Lines: []string{line}})
	if !strings.Contains(after, line) {
		t.Fatalf("a line after a tool did not reach the agent: %q", after)
	}
	stop, _, _ := shippedAnswer("claude", "Stop", "stop", Reply{Lines: []string{line}})
	if strings.Contains(stop, line) {
		t.Fatalf("a line at a stop is not read by the program, yet it was sent: %q", stop)
	}
}

func TestAWorkersToolWithNoAnswerIsRefusedAndToldWhatToDoIfItStaysRefused(t *testing.T) {
	var stdout, stderr strings.Builder
	program := programs.Program{Refusals: map[string]string{"pre_tool_use": "deny"}}
	code := Answered(&stdout, &stderr, program, "PreToolUse", "pre_tool_use", checkRequired, nil, "/nowhere", 5*time.Second)
	if code != 0 || !strings.Contains(stdout.String(), `"permissionDecision":"deny"`) || !strings.Contains(stdout.String(), "Run it once more") || !strings.Contains(stdout.String(), "stop and write in your report") {
		t.Fatalf("code %d, stdout %s, stderr %s", code, stdout.String(), stderr.String())
	}
}

func TestAMainAgentsToolWithNoAnswerGoesOnWithItsLine(t *testing.T) {
	var stdout, stderr strings.Builder
	program := programs.Program{Refusals: map[string]string{"pre_tool_use": "deny"}}
	code := Answered(&stdout, &stderr, program, "PreToolUse", "pre_tool_use", 0, nil, "/nowhere", 5*time.Second)
	if code != 0 || strings.Contains(stdout.String(), `"permissionDecision":"deny"`) {
		t.Fatalf("code %d, stdout %s", code, stdout.String())
	}
}
