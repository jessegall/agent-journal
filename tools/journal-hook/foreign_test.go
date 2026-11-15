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
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
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
	runs := runManaged(hooks, nil, "claude", programs.Program{}, "/checkout")
	if len(runs) != 2 || runs[0].ID != "first" || runs[1].ID != "second" || runs[0].ExitCode != 0 || runs[1].ExitCode != 0 || runs[0].Stdout != "secondfirst" || runs[1].Stdout != "ready" {
		t.Fatalf("runs = %+v", runs)
	}
}

func TestManagedHookGetsTheProgramsProjectDirectoryOfTheCheckout(t *testing.T) {
	t.Setenv("CLAUDE_PROJECT_DIR", "")
	checkout := t.TempDir()
	run := runOne(ManagedHook{ID: "project", Command: "printf '%s' \"$CLAUDE_PROJECT_DIR\"", Timeout: 5}, nil, managedVariables("claude", checkout, noVariables)...)
	if run.ExitCode != 0 || run.Stdout != checkout {
		t.Fatalf("run = %+v, want the checkout %s", run, checkout)
	}
}

func TestManagedVariablesOfAProgramWithNone(t *testing.T) {
	if variables := managedVariables("unknown", "/checkout", noVariables); len(variables) != 0 {
		t.Fatalf("variables = %v", variables)
	}
}

func TestSessionEndHookIsStoppedBeforeTheProgramsLimit(t *testing.T) {
	row := programs.Program{Events: map[string]string{"SessionEnd": "session_end", "PreToolUse": "pre_tool_use"}, SessionEndLimitSeconds: 11}
	for _, test := range []struct {
		event         string
		timeout, want int
	}{{"SessionEnd", 600, 1}, {"SessionEnd", 0, 0}, {"PreToolUse", 600, 600}} {
		if limit := runLimit(ManagedHook{Event: test.event, Timeout: test.timeout}, row); limit != test.want {
			t.Fatalf("%s with %d s runs under %d s, want %d", test.event, test.timeout, limit, test.want)
		}
	}
	if limit := runLimit(ManagedHook{Event: "SessionEnd", Timeout: 600}, programs.Program{Events: row.Events, SessionEndLimitSeconds: 60}); limit != 50 {
		t.Fatalf("a SessionEnd hook under a 60 s limit runs %d s, want 50", limit)
	}
	started := time.Now()
	runs := runManaged([]ManagedHook{{ID: "slow", Event: "SessionEnd", Command: "sleep 30", Timeout: 600}}, nil, "claude", row, "/checkout")
	if !runs[0].TimedOut || time.Since(started) > 5*time.Second {
		t.Fatalf("a SessionEnd hook of 600 s was not stopped at the program's limit: %+v after %s", runs[0], time.Since(started))
	}
}

func runAs(t *testing.T, program string, hook ManagedHook, body []byte) ForeignRun {
	t.Helper()
	hook.Timeout = 5
	return runManaged([]ManagedHook{hook}, body, program, programs.LoadTable("").Programs[program], "/checkout")[0]
}

func TestArgsRunWithoutAShell(t *testing.T) {
	run := runAs(t, "claude", ManagedHook{ID: "exec", Command: "echo", Fields: map[string]any{"args": []any{"$HOME", "a b"}}}, nil)
	if run.ExitCode != 0 || run.Stdout != "$HOME a b\n" {
		t.Fatalf("an exec-form hook ran through a shell: %+v", run)
	}
}

func TestArgsPassTheBodyOnStdin(t *testing.T) {
	run := runAs(t, "claude", ManagedHook{ID: "exec", Command: "cat", Fields: map[string]any{"args": []any{}}}, []byte(`{"hook_event_name":"Stop"}`))
	if run.Stdout != `{"hook_event_name":"Stop"}` {
		t.Fatalf("the exec-form hook read %q", run.Stdout)
	}
}

func TestShellNamesTheShell(t *testing.T) {
	run := runAs(t, "claude", ManagedHook{ID: "bash", Command: `[[ "a" == a ]] && printf bash`, Fields: map[string]any{"shell": "bash"}}, nil)
	if run.ExitCode != 0 || run.Stdout != "bash" {
		t.Fatalf("the hook did not run in bash: %+v", run)
	}
}

func TestNoFieldsRunsShDashC(t *testing.T) {
	if name, arguments := commandFor(ManagedHook{Command: "printf plain"}, programs.LoadTable("").Programs["claude"]); name != "sh" || strings.Join(arguments, " ") != "-c printf plain" {
		t.Fatalf("a hook with no fields runs as %s %v", name, arguments)
	}
}

func TestAnUnknownShellIsAHookFailure(t *testing.T) {
	run := runAs(t, "claude", ManagedHook{ID: "odd", Command: "true", Fields: map[string]any{"shell": "no-such-shell-here"}}, nil)
	if run.ExitCode != -1 || run.Stderr == "" {
		t.Fatalf("a hook with an unknown shell gave %+v", run)
	}
}

func TestACodexHookWithArgsStillRunsThroughSh(t *testing.T) {
	run := runAs(t, "codex", ManagedHook{ID: "exec", Command: "printf codex", Fields: map[string]any{"args": []any{"ignored"}}}, nil)
	if run.Stdout != "codex" {
		t.Fatalf("codex honoured args it does not read: %+v", run)
	}
}

func noVariables(string) string { return "" }

func TestTheEnvFileVariableIsPassedWhenSet(t *testing.T) {
	getenv := func(name string) string { return map[string]string{"CLAUDE_ENV_FILE": "/tmp/env-1"}[name] }
	if variables := managedVariables("claude", "/checkout", getenv); strings.Join(variables, " ") != "CLAUDE_PROJECT_DIR=/checkout CLAUDE_ENV_FILE=/tmp/env-1" {
		t.Fatalf("variables = %v", variables)
	}
}

func TestTheEnvFileVariableIsAbsentWhenNotSet(t *testing.T) {
	if variables := managedVariables("claude", "/checkout", noVariables); strings.Join(variables, " ") != "CLAUDE_PROJECT_DIR=/checkout" {
		t.Fatalf("variables = %v", variables)
	}
}

func TestOtherProgramsGetNoClaudeVariables(t *testing.T) {
	getenv := func(string) string { return "/tmp/env-1" }
	if variables := managedVariables("codex", "/checkout", getenv); len(variables) != 0 {
		t.Fatalf("codex hooks get %v", variables)
	}
}
