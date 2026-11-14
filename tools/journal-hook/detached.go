package main

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// isAsync says the project hook runs in the background: its entry sets async or asyncRewake and its program honours
// that field.
func isAsync(hook ManagedHook, program programs.Program) bool {
	async, _ := hook.Fields["async"].(bool)
	return (async && program.HonoursEntryField("async")) || rewakes(hook, program)
}

// rewakes says the background project hook wakes its agent when it ends with exit code 2.
func rewakes(hook ManagedHook, program programs.Program) bool {
	rewake, _ := hook.Fields["asyncRewake"].(bool)
	return rewake && program.HonoursEntryField("asyncRewake")
}

// wakeLineCharacters is the most of a project hook's text that wakes its agent.
const wakeLineCharacters = 800

// wakeLineTransport reaches the journal's server of the project at root; tests put their own in its place.
var wakeLineTransport = func(root string) http.RoundTripper {
	return socket.Transport(socket.Path(filepath.Join(root, ".journal")))
}

// postWakeLine hands the text of a project hook that ended with exit code 2 to the server as a line that wakes its
// agent; a server that is not there drops it.
func postWakeLine(root, program string, hook ManagedHook, body []byte, run ForeignRun) {
	text := strings.TrimSpace(run.Stderr)
	if text == "" {
		text = strings.TrimSpace(run.Stdout)
	}
	if characters := []rune(text); len(characters) > wakeLineCharacters {
		text = string(characters[:wakeLineCharacters])
	}
	var fields struct {
		Session string `json:"session_id"`
	}
	json.Unmarshal(body, &fields)
	waiter := wakeWait{transport: wakeLineTransport(root)}
	waiter.asked("http://journal/wake/line", map[string]string{"program": program, "session": fields.Session, "launch": os.Getenv("JOURNAL_LAUNCH"),
		"token": "", "hook": hook.ID, "text": text}, 10*time.Second)
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
		run := runCommand(hook, name, arguments, body, managedVariables(program, root, os.Getenv)...)
		if rewakes(hook, row) && run.ExitCode == 2 {
			postWakeLine(root, program, hook, body, run)
		}
	}
	return 0
}
