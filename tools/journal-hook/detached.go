package main

import (
	"os"
	"os/exec"
	"path/filepath"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// isAsync says the project hook runs in the background: its entry sets async and its program honours the field.
func isAsync(hook ManagedHook, program programs.Program) bool {
	async, _ := hook.Fields["async"].(bool)
	return async && program.HonoursEntryField("async")
}

// startDetached starts an async project hook in a process of its own that outlives this hook program, with the hook
// body in a file it reads as stdin and removes; nothing waits for it and its output is dropped.
func startDetached(hook ManagedHook, body []byte, program, root string) {
	self, err := os.Executable()
	if err != nil {
		return
	}
	file, err := os.CreateTemp("", "journal-hook-body-*")
	if err != nil {
		return
	}
	_, written := file.Write(body)
	file.Close()
	command := exec.Command(self, "--detached-run", program, root, hook.ID, file.Name())
	detach(command)
	if written != nil || command.Start() != nil {
		os.Remove(file.Name())
		return
	}
	_ = command.Process.Release()
}

// detachedRun runs the async project hook with the given id of the project at root under its timeout, as
// journal-hook --detached-run <program> <root> <hook id> <body file>, and removes the body file.
func detachedRun(program, root, id, bodyFile string) int {
	defer os.Remove(bodyFile)
	body, err := os.ReadFile(bodyFile)
	if err != nil {
		return 0
	}
	row := programs.LoadTable(filepath.Join(root, ".journal", "programs.json")).Programs[program]
	for _, hook := range LoadManaged(filepath.Join(root, ".journal", "hooks", "managed.json")) {
		if hook.ID != id {
			continue
		}
		hook.Timeout = runLimit(hook, row)
		name, arguments := commandFor(hook, row)
		runCommand(hook, name, arguments, body, managedVariables(program, root)...)
	}
	return 0
}
