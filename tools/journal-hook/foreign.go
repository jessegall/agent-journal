package main

import (
	"bytes"
	"context"
	"errors"
	"os/exec"
	"sync"
	"time"
)

const managedOutputLimit = 1 << 20

type ForeignRun struct {
	ID           string `json:"id"`
	ExitCode     int    `json:"exit_code"`
	Stdout       string `json:"stdout"`
	Stderr       string `json:"stderr"`
	Milliseconds int64  `json:"milliseconds"`
	TimedOut     bool   `json:"timed_out"`
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
