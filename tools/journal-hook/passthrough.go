package main

import (
	"encoding/json"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// passedTopFields are the output fields a program reads at the top of an answer, and passedSpecificFields those it
// reads inside hookSpecificOutput (report 1468: updatedToolOutput on PostToolUse, suppressOriginalPrompt and
// sessionTitle on UserPromptSubmit and SessionStart).
var (
	passedTopFields      = []string{"continue", "stopReason", "terminalSequence"}
	passedSpecificFields = []string{"updatedToolOutput", "suppressOriginalPrompt", "sessionTitle"}
)

// projectPassthrough is what the project hooks' JSON answers set of the output fields the program reads and the
// journal's own answer does not make: the first hook to set a field wins, and stopReason goes only with continue false.
func projectPassthrough(program programs.Program, runs []ForeignRun) (map[string]any, map[string]any) {
	top, specific := map[string]any{}, map[string]any{}
	for _, run := range runs {
		var answer map[string]any
		stdout := strings.TrimSpace(run.Stdout)
		if run.ExitCode != 0 || !strings.HasPrefix(stdout, "{") || json.Unmarshal([]byte(stdout), &answer) != nil {
			continue
		}
		keepFirst(top, answer, passedTopFields, program)
		if inner, ok := answer["hookSpecificOutput"].(map[string]any); ok {
			keepFirst(specific, inner, passedSpecificFields, program)
		}
	}
	if stop, _ := top["continue"].(bool); stop || top["continue"] == nil {
		delete(top, "continue")
		delete(top, "stopReason")
	}
	return top, specific
}

func keepFirst(kept, answer map[string]any, names []string, program programs.Program) {
	for _, name := range names {
		if _, set := kept[name]; !set && answer[name] != nil && program.PassesOutputField(name) {
			kept[name] = answer[name]
		}
	}
}

// withPassthrough adds the project hooks' passed fields to the printed answer, never over a key the journal's answer
// set, and never to a refusal or a halt of the journal, or to an answer that is plain text.
func withPassthrough(stdout string, program programs.Program, hookName string, reply Reply, runs []ForeignRun) string {
	top, specific := projectPassthrough(program, runs)
	if reply.Refusal != "" || reply.Halt != "" || (len(top) == 0 && len(specific) == 0) {
		return stdout
	}
	answer := map[string]any{}
	if strings.TrimSpace(stdout) != "" && json.Unmarshal([]byte(stdout), &answer) != nil {
		return stdout
	}
	for name, value := range top {
		if _, set := answer[name]; !set {
			answer[name] = value
		}
	}
	if len(specific) > 0 {
		inner, _ := answer["hookSpecificOutput"].(map[string]any)
		if inner == nil {
			inner = map[string]any{"hookEventName": hookName}
		}
		for name, value := range specific {
			if _, set := inner[name]; !set {
				inner[name] = value
			}
		}
		answer["hookSpecificOutput"] = inner
	}
	return jsonText(answer)
}
