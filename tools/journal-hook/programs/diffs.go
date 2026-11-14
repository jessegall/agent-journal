package programs

import (
	"encoding/json"
	"path/filepath"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/edits"
	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// claudeDiff counts what a Claude Edit, MultiEdit or Write changes in its file: before the tool runs, and after a
// failed run, which left the file as it was, from the file on disk; after it ran, from the patch Claude hands back,
// since the original text it hands back is cut short for a long file. A notebook's cells are not lines, so
// NotebookEdit gets no diff.
func claudeDiff(eventName string, read commonBody, tool *event.Tool) *event.DiffCount {
	if (tool.Category != "edit" && tool.Category != "write") || len(tool.Files) == 0 || tool.Name == "NotebookEdit" {
		return nil
	}
	path := tool.Files[0]
	input := read.ToolInput.values
	if eventName == "post_tool_use" {
		return claudePatched(path, read.ToolResponse, input)
	}
	onDisk := edits.OnDisk(absolute(read.Cwd, path))
	if tool.Category == "write" {
		content, _ := input["content"].(string)
		return edits.Counted(path, onDisk, content)
	}
	text := ""
	if onDisk != nil {
		text = *onDisk
	}
	return edits.Counted(path, onDisk, edits.Replaced(text, replacements(tool.Name, input)))
}

// claudePatched counts a tool's change from the structuredPatch Claude hands back after it ran, its hunks' + and -
// lines; a file the tool made has no patch and counts the lines it was given. The file existed when Claude hands back
// its original text.
func claudePatched(path string, response any, input map[string]any) *event.DiffCount {
	fields, isObject := response.(map[string]any)
	if !isObject {
		return nil
	}
	original, present := fields["originalFile"]
	if !present {
		return nil
	}
	_, existed := original.(string)
	count := &event.DiffCount{Path: path, Existed: existed}
	sections, _ := fields["structuredPatch"].([]any)
	for _, section := range sections {
		lines, _ := section.(map[string]any)["lines"].([]any)
		for _, line := range lines {
			text, _ := line.(string)
			switch {
			case strings.HasPrefix(text, "+"):
				count.LinesAdded++
			case strings.HasPrefix(text, "-"):
				count.LinesRemoved++
			}
		}
	}
	if len(sections) == 0 && !existed {
		content, _ := input["content"].(string)
		count.LinesAdded, _ = edits.LineDiff("", content)
	}
	return count
}

// claudeRows are the lines of a tool's change after it ran, from the patch Claude hands back, or for a file it made the
// lines it was given.
func claudeRows(eventName string, read commonBody, tool *event.Tool) []event.DiffRow {
	fields, isObject := read.ToolResponse.(map[string]any)
	if eventName != "post_tool_use" || tool.Diff == nil || !isObject {
		return nil
	}
	sections, _ := fields["structuredPatch"].([]any)
	if len(sections) == 0 && !tool.Diff.Existed {
		content, _ := read.ToolInput.values["content"].(string)
		return edits.NewFileRows(content)
	}
	collected := make([]edits.Section, 0, len(sections))
	for _, section := range sections {
		part, _ := section.(map[string]any)
		lines, _ := part["lines"].([]any)
		texts := make([]string, 0, len(lines))
		for _, line := range lines {
			text, _ := line.(string)
			texts = append(texts, text)
		}
		collected = append(collected, edits.Section{OldStart: integerValue(part["oldStart"]), NewStart: integerValue(part["newStart"]), Lines: texts})
	}
	return edits.SectionRows(collected)
}

func integerValue(value any) int {
	switch number := value.(type) {
	case float64:
		return int(number)
	case json.Number:
		integer, _ := number.Int64()
		return int(integer)
	}
	return 0
}

// codexRows are the lines of the first file an apply_patch changes.
func codexRows(eventName string, read commonBody, tool *event.Tool) []event.DiffRow {
	if eventName != "post_tool_use" || tool.Diff == nil || tool.Category != "edit" {
		return nil
	}
	for _, text := range read.ToolInput.texts {
		if edits.Patched(text, func(string) *string { return nil }) != nil {
			return edits.PatchRows(text)
		}
	}
	return nil
}

// replacements are an Edit's one replace or a MultiEdit's edits in their order.
func replacements(toolName string, input map[string]any) []edits.Replacement {
	if toolName != "MultiEdit" {
		return []edits.Replacement{replacementOf(input)}
	}
	rows, _ := input["edits"].([]any)
	var collected []edits.Replacement
	for _, row := range rows {
		if fields, present := row.(map[string]any); present {
			collected = append(collected, replacementOf(fields))
		}
	}
	return collected
}

func replacementOf(fields map[string]any) edits.Replacement {
	old, _ := fields["old_string"].(string)
	new, _ := fields["new_string"].(string)
	all, _ := fields["replace_all"].(bool)
	return edits.Replacement{Old: old, New: new, All: all}
}

// codexDiff counts a Codex apply_patch from the patch itself and a write_file from the file on disk before it runs.
func codexDiff(eventName string, read commonBody, tool *event.Tool) *event.DiffCount {
	onDisk := func(path string) *string { return edits.OnDisk(absolute(read.Cwd, path)) }
	switch {
	case tool.Category == "edit":
		for _, text := range read.ToolInput.texts {
			if counted := edits.Patched(text, onDisk); counted != nil {
				return counted
			}
		}
	case tool.Category == "write" && len(tool.Files) > 0 && eventName == "pre_tool_use":
		content, _ := read.ToolInput.values["content"].(string)
		return edits.Counted(tool.Files[0], onDisk(tool.Files[0]), content)
	}
	return nil
}

// absolute reads a path against the folder the agent ran in.
func absolute(folder, path string) string {
	if filepath.IsAbs(path) || folder == "" {
		return path
	}
	return filepath.Join(folder, path)
}
