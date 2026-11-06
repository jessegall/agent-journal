package programs

import (
	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"strings"
)

func commonEvent(name string, body []byte, program Program, context Context) (event.HookEvent, bool, error) {
	read, skip, err := readBody(body, program)
	if skip || err != nil {
		return event.HookEvent{}, true, err
	}
	prepared, skip, err := preparedFrom(name, program, body, read, context)
	if skip || err != nil || !isToolEvent(prepared.Event) {
		return prepared, skip, err
	}
	prepared.Tool = commonTool(read.ToolName, read.ToolInput.values, program, context.Classifier)
	prepared.Tool.Diff = claudeDiff(prepared.Event, read, prepared.Tool)
	prepared.Tool.DiffRows = claudeRows(prepared.Event, read, prepared.Tool)
	return prepared, false, nil
}

// The native tool that loads a skill names it by id, "plugin:id" for a plugin's; the journal counts a load as a read
// of the skill's file, so the tool names that file.
const skillToolName = "Skill"

func skillFile(input map[string]any) []string {
	id := pythonText(input, "skill")
	if id == "" {
		return []string{}
	}
	return []string{".claude/skills/" + id[strings.LastIndex(id, ":")+1:] + "/SKILL.md"}
}

func commonTool(name string, input map[string]any, program Program, classifier *classify.Classifier) *event.Tool {
	tool := &event.Tool{Name: name, Category: toolCategory(program, name), Files: []string{}}
	switch tool.Category {
	case "shell":
		line := classifier.Line(pythonText(input, "command"))
		tool.Shell = &line
	case "edit", "write", "read":
		tool.Files = filePaths(input)
		if name == skillToolName {
			tool.Files = skillFile(input)
		}
	}
	return tool
}
