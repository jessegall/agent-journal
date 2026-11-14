package main

import "github.com/jessegall/agent-journal/tools/journal-hook/programs"

// commandFor is the program and arguments a project hook runs as, read the way its program reads the entry: with
// "args", the command is run directly with args as its arguments and no shell; with "shell", the command is given to
// that shell; else to sh -c. A field the program does not honour is passed by, as the program would.
func commandFor(hook ManagedHook, program programs.Program) (string, []string) {
	if arguments, ok := textList(hook.Fields["args"]); ok && program.HonoursEntryField("args") {
		return hook.Command, arguments
	}
	if shell, ok := hook.Fields["shell"].(string); ok && shell != "" && program.HonoursEntryField("shell") {
		if shell == "powershell" {
			return "pwsh", []string{"-Command", hook.Command}
		}
		return shell, []string{"-c", hook.Command}
	}
	return "sh", []string{"-c", hook.Command}
}

// textList reads a JSON list of strings; an empty list counts, since an exec-form hook may take no arguments.
func textList(value any) ([]string, bool) {
	items, ok := value.([]any)
	if !ok {
		return nil, false
	}
	texts := make([]string, 0, len(items))
	for _, item := range items {
		text, ok := item.(string)
		if !ok {
			return nil, false
		}
		texts = append(texts, text)
	}
	return texts, true
}
