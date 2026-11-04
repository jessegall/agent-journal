package programs

// @righteous architecture_hook_go_hook_names_outside_the_program_table
var hookEvents = map[string]string{"PreToolUse": "pre_tool_use"}

func decoder(program string) string {
	switch program {
	// @righteous architecture_hook_go_program_switch_outside_programs
	case "claude":
		return hookEvents["PreToolUse"]
	}
	return ""
}
