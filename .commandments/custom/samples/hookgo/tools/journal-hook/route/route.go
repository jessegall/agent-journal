package route

import "fmt"

// @sin architecture_hook_go_hook_names_outside_the_program_table
var eventNames = map[string]string{"PreToolUse": "pre_tool_use", "Stop": "stop"}

// @sin architecture_hook_go_hook_names_outside_the_program_table
var toolCategories = map[string]string{"Bash": "shell"}

// @righteous architecture_hook_go_hook_names_outside_the_program_table
var setupCommands = map[string]bool{"read": true}

func Routed(program, event string) string {
	switch program {
	// @sin architecture_hook_go_program_switch_outside_programs
	case "claude":
		return eventNames[event]
	}
	// @sin architecture_hook_go_answer_shape_outside_answer
	return fmt.Sprintf(`{"hookSpecificOutput": {"hookEventName": %q}}`, event)
}

func IsCodex(program string) bool {
	// @sin architecture_hook_go_program_switch_outside_programs
	return program == "codex"
}
