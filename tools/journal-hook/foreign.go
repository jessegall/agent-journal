package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"os/exec"
	"sync"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

const managedOutputLimit = 1 << 20

type ForeignRun = event.ForeignRun

func refuses(run ForeignRun) bool {
	if run.TimedOut {
		return false
	}
	if run.ExitCode == 2 {
		return true
	}
	if run.ExitCode != 0 {
		return false
	}
	return nativeRefusal(run.Stdout)
}

func answerWithoutServer(stdout, stderr io.Writer, hookEvent string, runs []ForeignRun) (int, bool) {
	for _, run := range runs {
		if !refuses(run) {
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

func runManaged(hooks []ManagedHook, body []byte) []ForeignRun {
	runs := make([]ForeignRun, len(hooks))
	var group sync.WaitGroup
	for index, hook := range hooks {
		group.Add(1)
		go func() {
			defer group.Done()
			runs[index] = runOne(hook, body)
		}()
	}
	group.Wait()
	return runs
}

func runOne(hook ManagedHook, body []byte) ForeignRun {
	started := time.Now()
	deadline, cancel := context.WithTimeout(context.Background(), time.Duration(hook.Timeout)*time.Second)
	defer cancel()
	command := exec.CommandContext(deadline, "sh", "-c", hook.Command)
	prepareManaged(command)
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
