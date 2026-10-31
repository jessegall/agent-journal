package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

var (
	// a refusal that carries the agent's own answer, a Claude tool call denied or a prompt blocked
	answered   = regexp.MustCompile(`^\{"answer": `)
	ownAnswer  = regexp.MustCompile(`^\{"answer": (.*), "error": ".*$`)
	errorStart = regexp.MustCompile(`^\{"error": *"`)
	errorEnd   = regexp.MustCompile(`"\}$`)
)

// The Claude hooks whose answer takes a line for the agent, which is told at once when the journal did not answer.
var noticedEvents = map[string]string{"pre_tool_use": "PreToolUse", "post_tool_use": "PostToolUse", "prompt": "UserPromptSubmit", "session_start": "SessionStart"}

// Printed writes the journal's answer for the agent program as hook.sh does and gives the exit code: 200 prints the
// answer, which is JSON in the agent's own hook shape; 409 is a refusal, printed as it is when it starts with the
// agent's own answer, else its error is the reason, on stderr, and exit 2 tells the agent to stop; anything else went
// around the journal, and a Claude hook that takes a line is told so at once.
func Printed(stdout, stderr io.Writer, program, eventName string, status int, answer []byte, root string, limit time.Duration) int {
	switch status {
	case http.StatusOK:
		stdout.Write(answer)
		return 0
	case http.StatusConflict:
		lines := strings.Split(string(answer), "\n")
		if anyLine(lines, answered) {
			for index, line := range lines {
				lines[index] = ownAnswer.ReplaceAllString(line, "$1")
			}
			io.WriteString(stdout, strings.Join(lines, "\n"))
			return 0
		}
		for index, line := range lines {
			lines[index] = strings.ReplaceAll(errorEnd.ReplaceAllString(errorStart.ReplaceAllString(line, ""), ""), `\n`, "\n")
		}
		io.WriteString(stderr, strings.Join(lines, "\n"))
		return 2
	}
	hookEventName, noticed := noticedEvents[eventName]
	if program != "claude" || !noticed {
		return 0
	}
	fmt.Fprintf(stdout, "{\"hookSpecificOutput\": {\"hookEventName\": \"%s\", \"additionalContext\": \"%s\"}}\n", hookEventName, missedLine(root, limit))
	return 0
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

func anyLine(lines []string, pattern *regexp.Regexp) bool {
	for _, line := range lines {
		if pattern.MatchString(line) {
			return true
		}
	}
	return false
}
