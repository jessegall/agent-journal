package programs

// @righteous architecture_hook_HookNamesOnlyInTheProgramTableDetector
var hookEvents = map[string]string{"PreToolUse": "pre_tool_use"}

func decoder(program string) string {
	switch program {
	// @righteous architecture_hook_ProgramNamesOnlyInProgramsDetector
	case "claude":
		return hookEvents["PreToolUse"]
	}
	return ""
}
