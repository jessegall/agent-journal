//go:build !windows

package main

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
)

func TestManagedHookExitCodesAndStreams(t *testing.T) {
	for _, code := range []int{0, 2, 7} {
		t.Run(strconv.Itoa(code), func(t *testing.T) {
			hook := ManagedHook{ID: "check", Command: fmt.Sprintf("printf stdout; printf stderr >&2; exit %d", code), Timeout: 5}
			run := runOne(hook, nil)
			if run.ID != hook.ID || run.ExitCode != code || run.Stdout != "stdout" || run.Stderr != "stderr" || run.TimedOut || run.Milliseconds < 0 {
				t.Fatalf("run = %+v", run)
			}
		})
	}
}

func TestManagedHookReceivesWholeStdin(t *testing.T) {
	body := bytes.Repeat([]byte("body\n"), 100000)
	run := runOne(ManagedHook{ID: "stdin", Command: "cat", Timeout: 5}, body)
	if run.ExitCode != 0 || run.Stdout != string(body) {
		t.Fatalf("run exit = %d, stdin bytes = %d, stdout bytes = %d", run.ExitCode, len(body), len(run.Stdout))
	}
}

func TestManagedHookOutputIsCapped(t *testing.T) {
	run := runOne(ManagedHook{ID: "output", Command: "head -c 1050000 /dev/zero; head -c 1050000 /dev/zero >&2", Timeout: 5}, nil)
	if run.ExitCode != 0 || len(run.Stdout) != 1<<20 || len(run.Stderr) != 1<<20 {
		t.Fatalf("exit = %d, stdout = %d bytes, stderr = %d bytes", run.ExitCode, len(run.Stdout), len(run.Stderr))
	}
}

func TestManagedHookUsesCallerEnvironmentAndFolder(t *testing.T) {
	t.Chdir(t.TempDir())
	t.Setenv("JOURNAL_FOREIGN_TEST", "inherited")
	folder, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	run := runOne(ManagedHook{ID: "environment", Command: "printf '%s\\n' \"$JOURNAL_FOREIGN_TEST\"; pwd", Timeout: 5}, nil)
	if run.ExitCode != 0 || run.Stdout != "inherited\n"+folder+"\n" {
		t.Fatalf("run = %+v", run)
	}
}

func TestManagedHookTimeoutKillsItsChild(t *testing.T) {
	run := runOne(ManagedHook{ID: "timeout", Command: "sleep 60 & child=$!; printf '%s' \"$child\"; wait", Timeout: 1}, nil)
	if !run.TimedOut || run.ExitCode == 0 {
		t.Fatalf("run = %+v", run)
	}
	pid, err := strconv.Atoi(run.Stdout)
	if err != nil {
		t.Fatalf("child PID = %q: %v", run.Stdout, err)
	}
	t.Cleanup(func() { _ = syscall.Kill(pid, syscall.SIGKILL) })
	state, _ := exec.Command("ps", "-o", "stat=", "-p", strconv.Itoa(pid)).Output()
	if status := strings.TrimSpace(string(state)); status != "" && !strings.HasPrefix(status, "Z") {
		t.Fatalf("child %d is still running: %s", pid, status)
	}
}

func TestFailedManagedHookDoesNotRefuseItsTool(t *testing.T) {
	run := runOne(ManagedHook{ID: "failed", Command: `printf '{"decision":"block","reason":"ignored"}'; printf details >&2; exit 7`, Timeout: 5}, nil)
	if run.ExitCode != 7 || run.Stderr != "details" || foreignRunReply(hookProgram, "pre_tool_use", run).Refusal != "" {
		t.Fatalf("failed run = %+v", run)
	}
}

func TestManagedHooksStartTogetherAndKeepListOrder(t *testing.T) {
	folder := t.TempDir()
	requestPipe, responsePipe := filepath.Join(folder, "requestPipe"), filepath.Join(folder, "responsePipe")
	for _, path := range []string{requestPipe, responsePipe} {
		if err := syscall.Mkfifo(path, 0o600); err != nil {
			t.Fatal(err)
		}
	}
	hooks := []ManagedHook{
		{ID: "first", Command: fmt.Sprintf("printf ready > '%s'; cat '%s'; printf first", requestPipe, responsePipe), Timeout: 5},
		{ID: "second", Command: fmt.Sprintf("cat '%s'; printf second > '%s'", requestPipe, responsePipe), Timeout: 5},
	}
	runs := runManaged(hooks, nil)
	if len(runs) != 2 || runs[0].ID != "first" || runs[1].ID != "second" || runs[0].ExitCode != 0 || runs[1].ExitCode != 0 || runs[0].Stdout != "secondfirst" || runs[1].Stdout != "ready" {
		t.Fatalf("runs = %+v", runs)
	}
}
