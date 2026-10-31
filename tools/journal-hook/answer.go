package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// Reply is the server's HookReply: a refusal's reason, or the lines for the agent.
type Reply struct {
	Refusal string   `json:"refusal"`
	Lines   []string `json:"lines"`
}

// Answered prints the server's answer in the program's own shape and gives the exit code; a hook the server did not
// answer goes through, and the agent is lineAnswer so on an event whose answer takes lines.
func Answered(stdout, stderr io.Writer, program programs.Program, hookName, event string, status int, answer []byte, root string, limit time.Duration) int {
	reply := Reply{Lines: []string{missedLine(root, limit)}}
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
	lines := strings.Join(reply.Lines, "\n")
	if reply.Refusal != "" {
		return refused(program.Refusals[event], hookName, joined(reply.Refusal, lines))
	}
	if lines == "" || !program.AcceptsLines(event) {
		return "", "", 0
	}
	return jsonText(map[string]any{"hookSpecificOutput": map[string]any{"hookEventName": hookName, "additionalContext": lines}}), "", 0
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

// missedLine is the line hook.sh gives an agent whose hook went around the journal, with the panic watch asked for in
// the journal's own repository.
func missedLine(root string, limit time.Duration) string {
	port, _ := os.ReadFile(filepath.Join(root, ".journal", "port"))
	line := fmt.Sprintf("[journal] The journal did not answer within %d seconds, so this went through unchecked. Investigate now: curl -s http://127.0.0.1:%s/journal/health should answer 200, and runtime/server.log in .journal says why it does not.", int(limit.Seconds()), strings.TrimSpace(string(port)))
	if _, err := os.Stat(filepath.Join(root, "src", "journal", "hooks", "hook.sh")); err == nil {
		line += " This is the journal's own repository: start the panic watch, a CronCreate job every 15 minutes that checks the health, restarts the journal with journal setup restart when it does not answer, and tells the user in one line."
	}
	return line
}
