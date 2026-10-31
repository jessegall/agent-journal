package programs

import (
	"encoding/json"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// The kind of each Claude tool, read from version 4's Claude.decoders; a tool not named here is other.
var claudeToolKinds = map[string]string{
	"Bash":         "shell",
	"Monitor":      "shell",
	"Edit":         "edit",
	"MultiEdit":    "edit",
	"NotebookEdit": "edit",
	"Write":        "write",
	"Read":         "read",
	"Grep":         "search",
	"Glob":         "search",
	"Agent":        "agent",
	"Task":         "agent",
}

// The hooks of a subagent that still reach the journal, as hook.sh matches them: its start and stop and its tool uses.
var subagentEventPrefixes = []string{"Subagent", "PreToolUse", "PostToolUse"}

func claudeEvent(body []byte, context Context) (event.HookEvent, bool, error) {
	var read commonBody
	if err := json.Unmarshal(body, &read); err != nil {
		return event.HookEvent{}, true, err
	}
	if read.AgentID != nil && !hasPrefix(read.HookEventName, subagentEventPrefixes) {
		return event.HookEvent{}, true, nil
	}
	prepared, skip, err := preparedFrom("claude", body, read, context)
	if skip || err != nil || !isToolEvent(prepared.Event) {
		return prepared, skip, err
	}
	prepared.Tool = claudeTool(read.ToolName, read.ToolInput.values)
	return prepared, false, nil
}

func claudeTool(name string, input map[string]any) *event.Tool {
	kind, known := claudeToolKinds[name]
	if !known {
		kind = "other"
	}
	tool := &event.Tool{Name: name, Kind: kind, Files: []string{}}
	switch kind {
	case "shell":
		line := shell.Line(pythonText(input, "command"))
		tool.Shell = &line
	case "edit", "write", "read":
		tool.Files = filePaths(input)
	}
	return tool
}

func hasPrefix(text string, prefixes []string) bool {
	for _, prefix := range prefixes {
		if strings.HasPrefix(text, prefix) {
			return true
		}
	}
	return false
}
