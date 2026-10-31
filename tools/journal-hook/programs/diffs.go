package programs

import (
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
	before := edits.OnDisk(absolute(read.Cwd, path))
	if tool.Category == "write" {
		content, _ := input["content"].(string)
		return edits.Counted(path, before, content)
	}
	original := ""
	if before != nil {
		original = *before
	}
	return edits.Counted(path, before, edits.Replaced(original, replacements(tool.Name, input)))
}

// claudePatched counts a tool's change from the structuredPatch Claude hands back after it ran, its hunks' + and -
// lines; a file the tool made has no patch and counts the lines it was given. The file existed when Claude hands back
// its original text.
func claudePatched(path string, response any, input map[string]any) *event.DiffCount {
	fields, ok := response.(map[string]any)
	if !ok {
		return nil
	}
	original, present := fields["originalFile"]
	if !present {
		return nil
	}
	_, existed := original.(string)
	count := &event.DiffCount{Path: path, Existed: existed}
	hunks, _ := fields["structuredPatch"].([]any)
	for _, hunk := range hunks {
		lines, _ := hunk.(map[string]any)["lines"].([]any)
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
	if len(hunks) == 0 && !existed {
		content, _ := input["content"].(string)
		count.LinesAdded, _ = edits.LineDiff("", content)
	}
	return count
}

// replacements are an Edit's one replace or a MultiEdit's edits in their order.
func replacements(toolName string, input map[string]any) []edits.Replacement {
	if toolName != "MultiEdit" {
		return []edits.Replacement{replacementOf(input)}
	}
	rows, _ := input["edits"].([]any)
	var found []edits.Replacement
	for _, row := range rows {
		if fields, ok := row.(map[string]any); ok {
			found = append(found, replacementOf(fields))
		}
	}
	return found
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
