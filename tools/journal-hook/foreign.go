package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"os"
	"os/exec"
	"sync"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

const managedOutputLimit = 1 << 20

// sessionEndAnswerSeconds are the last seconds of a SessionEnd entry the journal keeps to answer after the project's
// hooks have run.
const sessionEndAnswerSeconds = 10

type ForeignRun = event.ForeignRun

func decodeRuns(program programs.Program, hookEvent string, runs []ForeignRun) {
	for index := range runs {
		answer := foreignRunReply(program, hookEvent, runs[index])
		if answer.Lines == nil {
			answer.Lines = []string{}
		}
		if answer.UpdatedInput == nil {
			answer.UpdatedInput = map[string]any{}
		}
		runs[index].Answer = event.ForeignAnswer{Refusal: answer.Refusal, Lines: answer.Lines, UpdatedInput: answer.UpdatedInput, Terminal: answer.Terminal}
	}
}

func answerWithoutServer(stdout, stderr io.Writer, hookEvent string, runs []ForeignRun) (int, bool) {
	for _, run := range runs {
		if run.Answer.Refusal == "" {
			continue
		}
		io.WriteString(stdout, run.Stdout)
		io.WriteString(stderr, run.Stderr)
		return run.ExitCode, true
	}
	if holdsStop(hookEvent) {
		io.WriteString(stdout, heldStop())
		return 0, true
	}
	return 0, false
}

type cappedBuffer struct {
	buffer bytes.Buffer
}

func (buffer *cappedBuffer) Write(data []byte) (int, error) {
	remaining := managedOutputLimit - buffer.buffer.Len()
	if remaining > 0 {
		_, _ = buffer.buffer.Write(data[:min(remaining, len(data))])
	}
	return len(data), nil
}

func (buffer *cappedBuffer) String() string {
	return buffer.buffer.String()
}

// projectDirectoryVariables names the variable each program gives its hooks for the folder of the project it runs
// in, which a project's hooks read to find their files.
var projectDirectoryVariables = map[string]string{"claude": "CLAUDE_PROJECT_DIR"}

// managedVariables are the variables the program would give a project hook run for the checkout at root: the
// project folder, and for Claude Code the environment file it names to its own hooks when the hook program was given
// one (report 1468: Claude Code gives CLAUDE_ENV_FILE to SessionStart, Setup, CwdChanged and FileChanged hooks).
func managedVariables(program, root string, getenv func(string) string) []string {
	name, ok := projectDirectoryVariables[program]
	if !ok {
		return nil
	}
	variables := []string{name + "=" + root}
	if file := getenv(environmentFileVariable); program == "claude" && file != "" {
		variables = append(variables, environmentFileVariable+"="+file)
	}
	return variables
}

// environmentFileVariable names the file whose exports Claude Code runs before each later shell command.
const environmentFileVariable = "CLAUDE_ENV_FILE"

func runManaged(hooks []ManagedHook, body []byte, program string, row programs.Program, root string) []ForeignRun {
	variables := managedVariables(program, root, os.Getenv)
	var waited []ManagedHook
	for _, hook := range hooks {
		if isAsync(hook, row) {
			startDetached(hook, body, program, root)
			continue
		}
		waited = append(waited, hook)
	}
	runs := make([]ForeignRun, len(waited))
	var group sync.WaitGroup
	for index, hook := range waited {
		group.Add(1)
		hook.Timeout = runLimit(hook, row)
		name, arguments := commandFor(hook, row)
		go func() {
			defer group.Done()
			runs[index] = runCommand(hook, name, arguments, body, variables...)
			runs[index].OnFailure = onFailure(hook, row)
		}()
	}
	group.Wait()
	return runs
}

// runLimit is the seconds a project hook runs under: its own timeout, but on SessionEnd no longer than the program's
// SessionEnd limit less the seconds the journal keeps to answer, and at least one second.
func runLimit(hook ManagedHook, row programs.Program) int {
	if row.Events[hook.Event] != "session_end" {
		return hook.Timeout
	}
	return min(hook.Timeout, max(1, row.SessionEndLimitSeconds-sessionEndAnswerSeconds))
}

// blockOnFailure is the onFailure value that makes a project hook's failure refuse the action it ran for.
const blockOnFailure = "block"

// unblockedEvents are the events on which Claude Code gives onFailure no effect: exit code 2 there sends the agent
// back to work, and it cannot repair a hook that will not run (report 1468).
var unblockedEvents = map[string]bool{"Stop": true, "SubagentStop": true, "TaskCompleted": true, "TeammateIdle": true}

// onFailure is "block" when the hook's failure refuses its action: its entry says so, its program honours the field
// and its event is one onFailure has an effect on.
func onFailure(hook ManagedHook, row programs.Program) string {
	if value, _ := hook.Fields["onFailure"].(string); value == blockOnFailure && row.HonoursEntryField("onFailure") && !unblockedEvents[hook.Event] {
		return blockOnFailure
	}
	return ""
}

// runOne runs a project hook with sh -c, as a program that honours no field of the entry runs it.
func runOne(hook ManagedHook, body []byte, variables ...string) ForeignRun {
	name, arguments := commandFor(hook, programs.Program{})
	return runCommand(hook, name, arguments, body, variables...)
}

func runCommand(hook ManagedHook, name string, arguments []string, body []byte, variables ...string) ForeignRun {
	started := time.Now()
	deadline, cancel := context.WithTimeout(context.Background(), time.Duration(hook.Timeout)*time.Second)
	defer cancel()
	command := exec.CommandContext(deadline, name, arguments...)
	prepareManaged(command)
	if len(variables) > 0 {
		command.Env = append(os.Environ(), variables...)
	}
	command.Stdin = bytes.NewReader(body)
	var stdout, stderr cappedBuffer
	command.Stdout, command.Stderr = &stdout, &stderr
	command.WaitDelay = time.Second
	err := command.Run()
	run := ForeignRun{ID: hook.ID, Stdout: stdout.String(), Stderr: stderr.String(), Milliseconds: time.Since(started).Milliseconds(), TimedOut: deadline.Err() != nil}
	if err == nil {
		return run
	}
	var exit *exec.ExitError
	if errors.As(err, &exit) {
		run.ExitCode = exit.ExitCode()
		return run
	}
	run.ExitCode = -1
	if run.Stderr == "" {
		run.Stderr = err.Error()
	}
	return run
}
