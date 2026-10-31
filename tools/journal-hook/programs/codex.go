package programs

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// The category of each Codex tool, read from version 4's Codex.decoders; a tool not named here is other.
var codexToolCategories = map[string]string{
	"Bash":                     "shell",
	"apply_patch":              "edit",
	"write_file":               "write",
	"read_file":                "read",
	"collaborationspawn_agent": "agent",
}

// The events Codex sends, version 4's Codex.hook_kinds: every hook but a message shown, a failed tool use and a failed stop.
var codexEvents = map[string]bool{
	"SessionStart": true, "UserPromptSubmit": true, "PreToolUse": true, "PostToolUse": true, "PreCompact": true,
	"Stop": true, "SubagentStart": true, "SubagentStop": true, "SessionEnd": true,
}

// The flags a shell is handed a line with, as Codex names its shell: bash -lc '<line>'.
var scriptFlags = map[string]bool{"-c": true, "-lc": true}

// A file a patch adds, changes, deletes or moves to, as version 4's PatchPaths reads it.
var patchHeader = regexp.MustCompile(`(?m)^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+?)\s*$`)

func codexEvent(body []byte, context Context) (event.HookEvent, bool, error) {
	var read commonBody
	if err := json.Unmarshal(body, &read); err != nil {
		return event.HookEvent{}, true, err
	}
	if read.AgentID != nil && !hasPrefix(read.HookEventName, subagentEventPrefixes) {
		return event.HookEvent{}, true, nil
	}
	if !codexEvents[read.HookEventName] {
		return event.HookEvent{}, true, fmt.Errorf("Codex sends no %q hook", read.HookEventName)
	}
	prepared, skip, err := preparedFrom("codex", body, read, context)
	if skip || err != nil || !isToolEvent(prepared.Event) {
		return prepared, skip, err
	}
	prepared.Tool = codexTool(read.ToolName, read.ToolInput, context)
	prepared.Tool.Diff = codexDiff(prepared.Event, read, prepared.Tool)
	return prepared, false, nil
}

func codexTool(name string, input toolInput, context Context) *event.Tool {
	category, known := codexToolCategories[name]
	if !known {
		category = "other"
	}
	tool := &event.Tool{Name: name, Category: category, Files: []string{}}
	switch category {
	case "shell":
		var command any = pythonText(input.values, "command")
		if words, ok := input.values["command"].([]any); ok {
			command = words
		}
		line := context.Classifier.Line(codexShellLine(command, context.RunScript))
		tool.Shell = &line
	case "edit":
		tool.Files = patchPaths(input.texts)
	case "write", "read":
		if path := firstText(input.values, "path", "file_path"); path != "" {
			tool.Files = []string{path}
		}
	}
	return tool
}

// codexShellLine is version 4's Codex.shell_line: the line a list of words hands a shell with -c or -lc, else the words
// joined as a line; a line the journal rewrote to go through its runner is read back to the line it runs.
func codexShellLine(command any, runScript string) string {
	if words, ok := command.([]any); ok {
		texts := make([]string, len(words))
		for index, word := range words {
			texts[index] = fmt.Sprint(word)
		}
		if len(texts) == 3 && scriptFlags[texts[1]] {
			return texts[2]
		}
		return shell.Join(texts)
	}
	line := fmt.Sprint(command)
	tokens := shell.Tokens(line)
	if len(tokens) == 4 && tokens[0] == "sh" && tokens[1] == runScript && tokens[2] == "--command" {
		return codexShellLine(tokens[3], runScript)
	}
	return line
}

// patchPaths reads every file header of the patch from all the text the tool was given, each file once, in order.
func patchPaths(texts []string) []string {
	paths, seen := []string{}, map[string]bool{}
	for _, found := range patchHeader.FindAllStringSubmatch(strings.Join(texts, "\n"), -1) {
		if !seen[found[1]] {
			seen[found[1]] = true
			paths = append(paths, found[1])
		}
	}
	return paths
}

func firstText(input map[string]any, keys ...string) string {
	for _, key := range keys {
		if text, ok := input[key].(string); ok && text != "" {
			return text
		}
	}
	return ""
}
