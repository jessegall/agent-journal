package host

import (
	"os/exec"
	"path/filepath"
	"strconv"
	"testing"
)

func sandboxed(t *testing.T, sandbox SessionSandbox, program string, arguments ...string) (string, error) {
	t.Helper()
	command := exec.Command(program, arguments...)
	sandbox.Wrap(command)
	output, err := command.CombinedOutput()
	return string(output), err
}

func TestASessionReadsItsOwnHistoryButNoOtherWorkspaces(t *testing.T) {
	account, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	own := filepath.Join(ClaudeProjectFolder(account, "/work/a"), "session.jsonl")
	foreign := filepath.Join(ClaudeProjectFolder(account, "/work/b"), "session.jsonl")
	for _, path := range []string{own, foreign} {
		writeTranscript(t, path)
	}
	sandbox, err := WriteSessionSandbox(t.TempDir(), account, "/work/a")
	if err != nil {
		t.Fatal(err)
	}

	if _, err := sandboxed(t, sandbox, "/bin/cat", own); err != nil {
		t.Fatalf("the session could not read its own history: %v", err)
	}
	if output, err := sandboxed(t, sandbox, "/bin/cat", foreign); err == nil {
		t.Fatalf("the session read another workspace's history: %s", output)
	}
}

func TestASessionCannotSignalOrListProcessesOutsideIt(t *testing.T) {
	sandbox, err := WriteSessionSandbox(t.TempDir(), t.TempDir(), "/work/a")
	if err != nil {
		t.Fatal(err)
	}
	outside := exec.Command("/bin/sleep", "30")
	if err := outside.Start(); err != nil {
		t.Fatal(err)
	}
	defer func() { _ = outside.Process.Kill() }()
	pid := strconv.Itoa(outside.Process.Pid)

	if output, err := sandboxed(t, sandbox, "/bin/kill", "-0", pid); err == nil {
		t.Fatalf("the session signalled a process outside it: %s", output)
	}
	if output, err := sandboxed(t, sandbox, "/bin/ps", "-p", pid, "-o", "pid="); err == nil {
		t.Fatalf("the session listed a process outside it: %s", output)
	}
	if _, err := sandboxed(t, sandbox, "/bin/sh", "-c", "sleep 5 & kill $!"); err != nil {
		t.Fatalf("the session could not signal its own child: %v", err)
	}
}

func TestAPathThatCouldBreakTheProfileIsRefused(t *testing.T) {
	if _, err := WriteSessionSandbox(t.TempDir(), "/accounts/\")(allow default", "/work/a"); err == nil {
		t.Fatal("a quote in a folder reached the profile")
	}
}
