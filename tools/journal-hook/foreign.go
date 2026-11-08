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

// managedVariables are the variables the program would give a project hook run for the checkout at root.
func managedVariables(program, root string) []string {
	name, known := projectDirectoryVariables[program]
	if !known {
		return nil
	}
	return []string{name + "=" + root}
}

func runManaged(hooks []ManagedHook, body []byte, program, root string) []ForeignRun {
	variables := managedVariables(program, root)
	runs := make([]ForeignRun, len(hooks))
	var group sync.WaitGroup
	for index, hook := range hooks {
		group.Add(1)
		go func() {
			defer group.Done()
			runs[index] = runOne(hook, body, variables...)
		}()
	}
	group.Wait()
	return runs
}

func runOne(hook ManagedHook, body []byte, variables ...string) ForeignRun {
	started := time.Now()
	deadline, cancel := context.WithTimeout(context.Background(), time.Duration(hook.Timeout)*time.Second)
	defer cancel()
	command := exec.CommandContext(deadline, "sh", "-c", hook.Command)
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
