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

// Reply is the server's HookReply: a refusal's reason, or the lines for the agent. A hook call id says the journal's
// rules ran, the rule that reads the project hooks among them.
type Reply struct {
	Refusal      string         `json:"refusal"`
	Lines        []string       `json:"lines"`
	UpdatedInput map[string]any `json:"updated_input"`
	Terminal     string         `json:"terminal"`
	HookCallID   *int64         `json:"hook_call_id"`
}

// nativeReply reads a project hook's own answer on stdout into a reply.
func nativeReply(style, name, stdout string) (Reply, bool) {
	var answer struct {
		Decision           string `json:"decision"`
		Reason             string `json:"reason"`
		SystemMessage      string `json:"systemMessage"`
		HookSpecificOutput struct {
			PermissionDecision       string         `json:"permissionDecision"`
			PermissionDecisionReason string         `json:"permissionDecisionReason"`
			AdditionalContext        string         `json:"additionalContext"`
			UpdatedInput             map[string]any `json:"updatedInput"`
		} `json:"hookSpecificOutput"`
	}
	if !strings.HasPrefix(stdout, "{") || json.Unmarshal([]byte(stdout), &answer) != nil {
		return Reply{}, false
	}
	reply := Reply{UpdatedInput: answer.HookSpecificOutput.UpdatedInput, Terminal: answer.SystemMessage}
	if answer.HookSpecificOutput.PermissionDecision == "ask" {
		return Reply{Terminal: joined(reply.Terminal, name+": hook asked for permission; the journal cannot ask")}, true
	}
	if text := answer.HookSpecificOutput.AdditionalContext; text != "" {
		reply.Lines = strings.Split(text, "\n")
	}
	if style == "deny" && answer.HookSpecificOutput.PermissionDecision == "deny" {
		reply.Refusal = withDefault(answer.HookSpecificOutput.PermissionDecisionReason, refusedWithoutReason)
	}
	if style == "block" && answer.Decision == "block" {
		reply.Refusal = withDefault(answer.Reason, refusedWithoutReason)
	}
	return reply, true
}

// Answered prints the server's answer in the program's own shape and gives the exit code; a hook the server did not
// answer goes through, and the agent is lineAnswer so on an event whose answer takes lines.
func Answered(stdout, stderr io.Writer, program programs.Program, hookName, event string, status int, answer []byte, root string, limit time.Duration, runs ...ForeignRun) int {
	reply := Reply{Lines: []string{missedLine(limit)}}
	if status == restartTimedOut {
		reply = restartTimedOutReply(event)
	}
	if status == checkRequired {
		reply = Reply{Refusal: uncheckedRefusal(limit)}
	}
	if status == http.StatusOK {
		reply = Reply{}
		json.Unmarshal(answer, &reply)
	}
	if reply.HookCallID == nil {
		reply = withForeign(reply, foreignReply(program, event, runs))
	}
	stdoutText, stderrText, code := ProgramAnswer(program, hookName, event, reply)
	io.WriteString(stdout, stdoutText)
	io.WriteString(stderr, stderrText)
	return code
}

// withForeign adds the project hooks' reply to the journal's, for a reply the journal's rules did not make: a project
// hook's refusal stands, so a fault in the journal never lets it go, and no rewrite runs a tool that was refused.
func withForeign(reply, foreign Reply) Reply {
	if len(reply.UpdatedInput) == 0 && reply.Refusal == "" {
		reply.UpdatedInput = foreign.UpdatedInput
	}
	if foreign.Refusal != "" {
		reply.UpdatedInput = nil
	}
	reply.Refusal = joined(foreign.Refusal, reply.Refusal)
	reply.Lines = append(reply.Lines, foreign.Lines...)
	reply.Terminal = joined(reply.Terminal, foreign.Terminal)
	return reply
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
	if first == "" {
		return second
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

// uncheckedRefusal is the refusal of a worker's or helper's tool the journal did not answer for. It tells the agent to try
// once more and what to do then, so a journal that stays away never leaves it retrying in silence.
func uncheckedRefusal(limit time.Duration) string {
	return fmt.Sprintf("[journal] The journal did not answer within %d seconds, so this tool did not run: a worker or helper runs no tool the journal did not check. Run it once more. If that is refused as well, stop and write in your report that the journal does not answer.", int(limit.Seconds()))
}

// missedLine is the line given to an agent whose hook went around the journal.
func missedLine(limit time.Duration) string {
	return fmt.Sprintf("[journal] The journal did not answer within %d seconds, so this went through unchecked. Check it: curl -s --unix-socket .journal/server.sock http://journal/health should answer 200, and .journal/runtime/server.log says why it does not.", int(limit.Seconds()))
}
