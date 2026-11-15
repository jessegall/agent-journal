package main

import (
	"encoding/json"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// toolEvents are the events whose body names a tool, the only ones on which a hook's if condition holds.
var toolEvents = map[string]bool{"PreToolUse": true, "PostToolUse": true, "PostToolUseFailure": true, "PermissionRequest": true, "PermissionDenied": true}

// permissionRule is one rule of the if field: a tool name, and in brackets the pattern its main argument must match.
var permissionRule = regexp.MustCompile(`^([A-Za-z0-9_\-]+)(?:\((.*)\))?$`)

// ifMatches says whether a hook's if condition holds for the hook body, as Claude Code reads it: only on a tool
// event; Tool matches that tool; Tool(pattern) matches when the tool's main argument matches the pattern, for a shell
// line each of its commands with leading VAR=value assignments taken off. A line that does not split runs the hook,
// and a condition that does not read matches nothing.
func ifMatches(condition string, body []byte) bool {
	var fields struct {
		Event string         `json:"hook_event_name"`
		Tool  string         `json:"tool_name"`
		Input map[string]any `json:"tool_input"`
		Cwd   string         `json:"cwd"`
	}
	parts := permissionRule.FindStringSubmatch(strings.TrimSpace(condition))
	if json.Unmarshal(body, &fields) != nil || !toolEvents[fields.Event] || parts == nil || parts[1] != fields.Tool {
		return false
	}
	pattern := parts[2]
	if pattern == "" || pattern == "*" {
		return true
	}
	if command, ok := fields.Input["command"].(string); ok {
		return commandMatches(pattern, command)
	}
	if path, ok := fields.Input["file_path"].(string); ok {
		relative, err := filepath.Rel(fields.Cwd, path)
		return globMatches(pattern, path) || (err == nil && globMatches(pattern, relative))
	}
	return true
}

func commandMatches(pattern, line string) bool {
	commands, _, err := shell.Split(line)
	if err != nil {
		return true
	}
	for _, command := range commands {
		if globMatches(pattern, shell.Join(shell.Unassigned(shell.Tokens(shell.CommandText(command.Text))))) {
			return true
		}
	}
	return false
}

// globMatches matches a whole text against a permission pattern, where * and ** stand for any run of characters.
func globMatches(pattern, text string) bool {
	expression := regexp.QuoteMeta(pattern)
	expression = strings.ReplaceAll(expression, `\*\*`, ".*")
	expression = strings.ReplaceAll(expression, `\*`, ".*")
	matched, err := regexp.MatchString("^"+expression+"$", text)
	return err == nil && matched
}
