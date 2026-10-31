package route

import "fmt"

// @sin architecture_hook_HookNamesOnlyInTheProgramTableDetector
var eventNames = map[string]string{"PreToolUse": "pre_tool_use", "Stop": "stop"}

// @sin architecture_hook_HookNamesOnlyInTheProgramTableDetector
var toolCategories = map[string]string{"Bash": "shell"}

// @righteous architecture_hook_HookNamesOnlyInTheProgramTableDetector
var setupCommands = map[string]bool{"read": true}

func Routed(program, event string) string {
	switch program {
	// @sin architecture_hook_ProgramNamesOnlyInProgramsDetector
	case "claude":
		return eventNames[event]
	}
	// @sin architecture_hook_AnswerShapeOnlyInAnswerDetector
	return fmt.Sprintf(`{"hookSpecificOutput": {"hookEventName": %q}}`, event)
}
