package main

import (
	"encoding/json"
	"fmt"
	"net/http"
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
	if code != 0 || !strings.Contains(stdout.String(), `"permissionDecision":"deny"`) || !strings.Contains(stdout.String(), "Try once more") || !strings.Contains(stdout.String(), "stop and write in your report") {
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

const stopLine = "[journal] Claude is at your usage limit until 14:00."

func TestAHaltedClaudeToolUseIsDeniedAndClaudeIsStoppedInOneAnswer(t *testing.T) {
	stdout, stderr, code := shippedAnswer("claude", "PreToolUse", "pre_tool_use", Reply{Halt: stopLine})
	if code != 0 || stderr != "" || !strings.Contains(stdout, `"continue":false`) || !strings.Contains(stdout, `"permissionDecision":"deny"`) || !strings.Contains(stdout, `"stopReason":"[journal] Claude is at your usage limit`) {
		t.Fatalf("printed %q %q %d", stdout, stderr, code)
	}
}

func TestAHaltStopsClaudeAtEveryOtherEventAndNeverBlocksItsStop(t *testing.T) {
	for hookName, event := range map[string]string{"Stop": "stop", "UserPromptSubmit": "prompt", "PostToolUse": "post_tool_use", "SessionStart": "session_start", "PreCompact": "compact"} {
		stdout, stderr, code := shippedAnswer("claude", hookName, event, Reply{Halt: stopLine})
		if code != 0 || stderr != "" || !strings.Contains(stdout, `"continue":false`) || strings.Contains(stdout, `"decision":"block"`) || strings.Contains(stdout, "permissionDecision") {
			t.Fatalf("%s printed %q %q %d", event, stdout, stderr, code)
		}
	}
}

func TestAHaltBeatsTheLinesTheRefusalAndTheNewInputOfTheSameReply(t *testing.T) {
	reply := Reply{Halt: stopLine, Refusal: "no git here", Lines: []string{"a waiting line"}, UpdatedInput: map[string]any{"command": "ls"}}
	stdout, _, _ := shippedAnswer("claude", "PreToolUse", "pre_tool_use", reply)
	if strings.Contains(stdout, "no git here") || strings.Contains(stdout, "a waiting line") || strings.Contains(stdout, "updatedInput") || !strings.Contains(stdout, `"continue":false`) {
		t.Fatalf("printed %q", stdout)
	}
}

func TestAProjectHooksAnswerCannotOverturnAHalt(t *testing.T) {
	reply := withForeign(Reply{Halt: stopLine}, Reply{UpdatedInput: map[string]any{"command": "ls"}, Lines: []string{"go ahead"}})
	stdout, _, _ := shippedAnswer("claude", "PreToolUse", "pre_tool_use", reply)
	if strings.Contains(stdout, "updatedInput") || strings.Contains(stdout, "go ahead") || !strings.Contains(stdout, `"continue":false`) {
		t.Fatalf("printed %q", stdout)
	}
}

func TestAHaltedCodexToolUseAndPromptAreRefusedSinceCodexCannotStopThere(t *testing.T) {
	for hookName, event := range map[string]string{"PreToolUse": "pre_tool_use", "UserPromptSubmit": "prompt"} {
		stdout, stderr, code := shippedAnswer("codex", hookName, event, Reply{Halt: stopLine})
		if code != 2 || stdout != "" || stderr != stopLine {
			t.Fatalf("%s printed %q %q %d", event, stdout, stderr, code)
		}
	}
}

func TestAHaltStopsCodexAtItsStopAndAfterATool(t *testing.T) {
	for hookName, event := range map[string]string{"Stop": "stop", "PostToolUse": "post_tool_use"} {
		stdout, _, code := shippedAnswer("codex", hookName, event, Reply{Halt: stopLine})
		if code != 0 || !strings.Contains(stdout, `"continue":false`) || strings.Contains(stdout, `"decision":"block"`) {
			t.Fatalf("%s printed %q %d", event, stdout, code)
		}
	}
}

const answeredByTheJournal = `{"refusal":"","lines":[],"hook_call_id":1}`

func passedAnswer(t *testing.T, program, hookName, event, server string, stdouts ...string) map[string]any {
	t.Helper()
	runs := make([]ForeignRun, len(stdouts))
	for index, text := range stdouts {
		runs[index] = ForeignRun{ID: fmt.Sprintf("hook-%d", index), Stdout: text}
	}
	var stdout, stderr strings.Builder
	Answered(&stdout, &stderr, programs.LoadTable("").Programs[program], hookName, event, http.StatusOK, []byte(server), t.TempDir(), 5*time.Second, runs...)
	answer := map[string]any{}
	if stdout.Len() > 0 {
		if err := json.Unmarshal([]byte(stdout.String()), &answer); err != nil {
			t.Fatalf("the answer %q is not JSON: %v", stdout.String(), err)
		}
	}
	return answer
}

func specific(answer map[string]any) map[string]any {
	inner, _ := answer["hookSpecificOutput"].(map[string]any)
	return inner
}

func TestContinueFalseAndStopReasonPassThrough(t *testing.T) {
	answer := passedAnswer(t, "claude", "PostToolUse", "post_tool_use", answeredByTheJournal, `{"continue":false,"stopReason":"build failed"}`, `{"continue":false,"stopReason":"second"}`)
	if answer["continue"] != false || answer["stopReason"] != "build failed" {
		t.Fatalf("answer = %v", answer)
	}
	if answer := passedAnswer(t, "claude", "PostToolUse", "post_tool_use", answeredByTheJournal, `{"stopReason":"alone"}`); answer["stopReason"] != nil {
		t.Fatalf("a stopReason without continue false passed: %v", answer)
	}
}

func TestUpdatedToolOutputPassesThroughForClaude(t *testing.T) {
	answer := passedAnswer(t, "claude", "PostToolUse", "post_tool_use", answeredByTheJournal, `{"hookSpecificOutput":{"hookEventName":"PostToolUse","updatedToolOutput":{"stdout":"[redacted]"}}}`)
	if output, _ := specific(answer)["updatedToolOutput"].(map[string]any); output["stdout"] != "[redacted]" || specific(answer)["hookEventName"] != "PostToolUse" {
		t.Fatalf("answer = %v", answer)
	}
}

func TestUpdatedToolOutputIsDroppedForCodex(t *testing.T) {
	answer := passedAnswer(t, "codex", "PostToolUse", "post_tool_use", answeredByTheJournal, `{"hookSpecificOutput":{"updatedToolOutput":{"stdout":"x"}},"continue":false}`)
	if specific(answer) != nil || answer["continue"] != false {
		t.Fatalf("codex got %v", answer)
	}
}

func TestSuppressOriginalPromptPassesThrough(t *testing.T) {
	answer := passedAnswer(t, "claude", "UserPromptSubmit", "prompt", answeredByTheJournal, `{"hookSpecificOutput":{"suppressOriginalPrompt":true}}`)
	if specific(answer)["suppressOriginalPrompt"] != true {
		t.Fatalf("answer = %v", answer)
	}
}

func TestSessionTitlePassesThrough(t *testing.T) {
	answer := passedAnswer(t, "claude", "SessionStart", "session_start", answeredByTheJournal, `{"hookSpecificOutput":{"sessionTitle":"auth refactor"}}`)
	if specific(answer)["sessionTitle"] != "auth refactor" {
		t.Fatalf("answer = %v", answer)
	}
}

func TestTerminalSequencePassesThrough(t *testing.T) {
	answer := passedAnswer(t, "claude", "PostToolUse", "post_tool_use", answeredByTheJournal, `{"terminalSequence":"\u0007"}`)
	if answer["terminalSequence"] != "\a" {
		t.Fatalf("answer = %v", answer)
	}
}

func TestTheJournalsOwnKeyWinsOverAProjectHooks(t *testing.T) {
	answer := passedAnswer(t, "claude", "PostToolUse", "post_tool_use", `{"refusal":"","lines":["the journal's line"],"hook_call_id":1}`,
		`{"hookSpecificOutput":{"additionalContext":"the project's","sessionTitle":"kept"}}`)
	if specific(answer)["additionalContext"] != "the journal's line" || specific(answer)["sessionTitle"] != "kept" {
		t.Fatalf("answer = %v", answer)
	}
}

func TestARefusalDropsThePassthrough(t *testing.T) {
	answer := passedAnswer(t, "claude", "PreToolUse", "pre_tool_use", `{"refusal":"not now","lines":[],"hook_call_id":1}`, `{"continue":false,"stopReason":"x","terminalSequence":"\u0007"}`)
	if answer["continue"] != nil || answer["terminalSequence"] != nil {
		t.Fatalf("a refused tool passed the project's fields: %v", answer)
	}
}

func TestUnknownKeysAreStillDropped(t *testing.T) {
	answer := passedAnswer(t, "claude", "PostToolUse", "post_tool_use", answeredByTheJournal, `{"somethingElse":1,"hookSpecificOutput":{"notAField":2}}`)
	if answer["somethingElse"] != nil || specific(answer) != nil {
		t.Fatalf("answer = %v", answer)
	}
}
