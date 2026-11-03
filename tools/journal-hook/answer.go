package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// Reply is the server's HookReply: a refusal's reason, or the lines for the agent.
type Reply struct {
	Refusal      string         `json:"refusal"`
	Lines        []string       `json:"lines"`
	UpdatedInput map[string]any `json:"updated_input"`
	Terminal     string         `json:"terminal"`
}

func nativeRefusal(stdout string) bool {
	var answer struct {
		Decision           string `json:"decision"`
		HookSpecificOutput struct {
			PermissionDecision string `json:"permissionDecision"`
		} `json:"hookSpecificOutput"`
	}
	if json.Unmarshal([]byte(stdout), &answer) != nil {
		return false
	}
	return answer.Decision == "block" || answer.HookSpecificOutput.PermissionDecision == "deny"
}

// Answered prints the server's answer in the program's own shape and gives the exit code; a hook the server did not
// answer goes through, and the agent is lineAnswer so on an event whose answer takes lines.
func Answered(stdout, stderr io.Writer, program programs.Program, hookName, event string, status int, answer []byte, root string, limit time.Duration) int {
	reply := Reply{Lines: []string{missedLine(limit)}}
	if status == restartTimedOut {
		reply = restartTimedOutReply(event)
	}
	if status == http.StatusOK && json.Unmarshal(answer, &reply) != nil {
		return 0
	}
	stdoutText, stderrText, code := ProgramAnswer(program, hookName, event, reply)
	io.WriteString(stdout, stdoutText)
	io.WriteString(stderr, stderrText)
	return code
}

// ProgramAnswer is the reply in the program's own answer: what goes to stdout and to stderr, and the exit code. hookName is the
// name the program gave the hook, which its answer repeats.
func ProgramAnswer(program programs.Program, hookName, event string, reply Reply) (string, string, int) {
	stdout, stderr, code := answered(program, hookName, event, reply)
	if reply.Terminal == "" || stderr != "" {
		return stdout, stderr, code
	}
	return withTerminal(stdout, reply.Terminal), stderr, code
}

// withTerminal adds the line the terminal shows to the program's answer, or makes it the whole answer when there is none.
func withTerminal(stdout, terminal string) string {
	answer := map[string]any{}
	if stdout != "" {
		json.Unmarshal([]byte(stdout), &answer)
	}
	answer["systemMessage"] = terminal
	return jsonText(answer)
}

func answered(program programs.Program, hookName, event string, reply Reply) (string, string, int) {
	lines := strings.Join(reply.Lines, "\n")
	if len(reply.UpdatedInput) > 0 {
		return rewritten(program.Rewrites[event], hookName, reply.UpdatedInput, lines), "", 0
	}
	if reply.Refusal != "" {
		return refused(program.Refusals[event], hookName, joined(reply.Refusal, lines))
	}
	if lines == "" || !program.AcceptsLines(event) {
		return "", "", 0
	}
	return jsonText(map[string]any{"hookSpecificOutput": map[string]any{"hookEventName": hookName, "additionalContext": lines}}), "", 0
}

// rewritten is the answer that lets the tool run with the new input, which carries the fields the program asks for in a
// rewrite of this event, and keeps the lines.
func rewritten(extras map[string]any, hookName string, input map[string]any, lines string) string {
	updated := map[string]any{}
	for field, value := range input {
		updated[field] = value
	}
	for field, value := range extras {
		updated[field] = value
	}
	output := map[string]any{"hookEventName": hookName, "permissionDecision": "allow", "updatedInput": updated}
	if lines != "" {
		output["additionalContext"] = lines
	}
	return jsonText(map[string]any{"hookSpecificOutput": output})
}

func refused(style, hookName, reason string) (string, string, int) {
	switch style {
	case "deny":
		return jsonText(map[string]any{"hookSpecificOutput": map[string]any{"hookEventName": hookName, "permissionDecision": "deny", "permissionDecisionReason": reason}}), "", 0
	case "block":
		return jsonText(map[string]any{"decision": "block", "reason": reason}), "", 0
	}
	return "", reason, 2
}

func joined(first, second string) string {
	if second == "" {
		return first
	}
	return first + "\n" + second
}

func jsonText(value any) string {
	text, _ := json.Marshal(value)
	return string(text) + "\n"
}

// restartTimedOutReply refuses a tool whose restarting server did not come back; any other event goes on with the line,
// so a person's prompt is never lost.
func restartTimedOutReply(event string) Reply {
	check := fmt.Sprintf("[journal] The journal restarted and did not come back within %d seconds, so %%s. Check it: curl -s --unix-socket .journal/server.sock http://journal/health should answer 200, and .journal/runtime/server.log says why it does not.", int(RestartWindow.Seconds()))
	if event == "pre_tool_use" {
		return Reply{Refusal: fmt.Sprintf(check, "this tool use did not run")}
	}
	return Reply{Lines: []string{fmt.Sprintf(check, "this went through unchecked")}}
}

// missedLine is the line given to an agent whose hook went around the journal.
func missedLine(limit time.Duration) string {
	return fmt.Sprintf("[journal] The journal did not answer within %d seconds, so this went through unchecked. Check it: curl -s --unix-socket .journal/server.sock http://journal/health should answer 200, and .journal/runtime/server.log says why it does not.", int(limit.Seconds()))
}
