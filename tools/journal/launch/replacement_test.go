//go:build darwin || linux

package launch

import (
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"
)

func replacementFolder(t *testing.T) string {
	t.Helper()
	folder, err := os.MkdirTemp("/tmp", "replace-launch")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(folder) })
	return folder
}

func expectFileText(t *testing.T, path, text string) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		contents, _ := os.ReadFile(path)
		if strings.Contains(string(contents), text) {
			return
		}
		time.Sleep(10 * time.Millisecond)
	}
	contents, _ := os.ReadFile(path)
	t.Fatalf("%s did not contain %q: %s", path, text, contents)
}

type replacementTerminalInput struct {
	io.Reader
}

func (input replacementTerminalInput) Read(buffer []byte) (int, error) {
	count, err := input.Reader.Read(buffer)
	for index := range buffer[:count] {
		if buffer[index] == '\r' {
			buffer[index] = '\n'
		}
	}
	return count, err
}

func startReplacementTestProgram(command *exec.Cmd, input io.Reader, screen, log io.Writer) (func() error, error) {
	reader, writer, err := os.Pipe()
	if err != nil {
		return nil, err
	}
	command.Stdin = reader
	command.Stdout, command.Stderr = io.MultiWriter(screen, log), io.MultiWriter(screen, log)
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := command.Start(); err != nil {
		_ = reader.Close()
		_ = writer.Close()
		return nil, err
	}
	go func() { _, _ = io.Copy(writer, replacementTerminalInput{input}) }()
	return func() error {
		err := command.Wait()
		_ = reader.Close()
		_ = writer.Close()
		return err
	}, nil
}

func TestReplacementServiceProcess(t *testing.T) {
	if os.Getenv("JOURNAL_REPLACEMENT_CHILD") != "1" {
		t.Skip("replacement child only")
	}
	version, err := ReadBinaryVersion(os.Getenv("JOURNAL_REPLACEMENT_BINARY"))
	if err != nil {
		t.Fatal(err)
	}
	inputs := NewTerminalInputs()
	defer inputs.StopAll()
	listener, err := ListenVersioned(os.Getenv("JOURNAL_REPLACEMENT_SOCKET"), ProcessStarter{Home: os.Getenv("JOURNAL_REPLACEMENT_HOME"), Inputs: inputs, startTerminal: startReplacementTestProgram}, inputs, version.Digest)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	deadline := time.Now().Add(15 * time.Second)
	for time.Now().Before(deadline) {
		if !listener.HasPrograms() {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("the old terminal owners did not finish")
}

func TestReplacementUsesTheInstalledExecutableAndKeepsTheMainTerminal(t *testing.T) {
	folder := replacementFolder(t)
	path, binary := filepath.Join(folder, "launcher"), filepath.Join(folder, "journal")
	executable, err := os.Executable()
	if err != nil {
		t.Fatal(err)
	}
	script := "#!/bin/sh\n# first version\nexec '" + strings.ReplaceAll(executable, "'", "'\\''") + "' -test.run '^TestReplacementServiceProcess$'\n"
	if err := os.WriteFile(binary, []byte(script), 0o700); err != nil {
		t.Fatal(err)
	}
	version, err := ReadBinaryVersion(binary)
	if err != nil {
		t.Fatal(err)
	}
	inputs := NewTerminalInputs()
	defer inputs.StopAll()
	listener, err := ListenVersioned(path, refusingStarter{}, inputs, version.Digest)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	logPath := filepath.Join(folder, "main.out")
	log, err := os.Create(logPath)
	if err != nil {
		t.Fatal(err)
	}
	defer log.Close()
	main := exec.Command("sh", "-c", `printf 'main ready\n'; while IFS= read -r line; do printf 'main:%s\n' "$line"; done`)
	wait, err := startReplacementTestProgram(main, inputs.Open(11, strings.NewReader("")), io.Discard, log)
	if err != nil {
		t.Fatal(err)
	}
	inputs.Track(11, main)
	go func() { _ = wait(); inputs.Close(11) }()
	mainPID := main.Process.Pid
	expectFileText(t, logPath, "main ready")
	stop, replaced := make(chan struct{}), make(chan struct{})
	defer close(stop)
	var child *exec.Cmd
	childEnded := make(chan error, 1)
	failures := make(chan error, 10)
	go func() {
		watchBinary(stop, binary, path, version, func() error {
			child = exec.Command(binary)
			child.Env = append(os.Environ(), "JOURNAL_REPLACEMENT_CHILD=1", "JOURNAL_REPLACEMENT_BINARY="+binary,
				"JOURNAL_REPLACEMENT_SOCKET="+path, "JOURNAL_REPLACEMENT_HOME="+folder)
			child.Stdout, child.Stderr = log, log
			if err := child.Start(); err != nil {
				return err
			}
			go func() { childEnded <- child.Wait(); close(childEnded) }()
			return nil
		}, func(err error) { failures <- err }, 10*time.Millisecond)
		close(replaced)
	}()
	if err := os.WriteFile(binary+".new", []byte(strings.Replace(script, "first version", "second version", 1)), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.Rename(binary+".new", binary); err != nil {
		t.Fatal(err)
	}
	select {
	case <-replaced:
	case err := <-failures:
		t.Fatal(err)
	case <-time.After(8 * time.Second):
		t.Fatal("the installed replacement never started")
	}
	defer func() { _ = child.Process.Kill(); <-childEnded }()
	if inputs.ProgramPid(11) != mainPID {
		t.Fatal("the main program was replaced")
	}
	answer, err := socketAnswer(path, WorkerRequest{AgentID: 11, InputLine: "after replacement"})
	if err != nil || answer != TypedAnswer {
		t.Fatalf("main terminal input: %q, %v", answer, err)
	}
	expectFileText(t, logPath, "main:after replacement")
	answer, err = socketAnswer(path, WorkerRequest{AgentID: 11, Command: []string{"false"}})
	if err != nil || answer != RunningAnswer {
		t.Fatalf("a duplicate main start: %q, %v", answer, err)
	}
	answer, err = socketAnswer(path, WorkerRequest{AgentID: 22, Folder: folder, Command: []string{"sh", "-c", `printf 'worker owner:%s\n' "$PPID"`}})
	if err != nil || !strings.HasPrefix(answer, StartedAnswer+" ") {
		t.Fatalf("new worker: %q, %v", answer, err)
	}
	expectFileText(t, TerminalFile(folder, 22), "worker owner:"+strconv.Itoa(child.Process.Pid))
	answer, err = socketAnswer(path, WorkerRequest{AgentID: 11, Stop: true})
	if err != nil || answer != StoppedAnswer {
		t.Fatalf("main terminal stop: %q, %v", answer, err)
	}
	select {
	case err := <-childEnded:
		if err != nil {
			t.Fatal(err)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("the old terminals finished but the service stayed")
	}
}

func TestReplacementKeepsOlderOwnersReachableWhenAnIntermediateListenerEnds(t *testing.T) {
	path := filepath.Join(replacementFolder(t), "launcher")
	inputs := NewTerminalInputs()
	inputs.Reserve(7)
	first, err := ListenVersioned(path, refusingStarter{}, inputs, "first")
	if err != nil {
		t.Fatal(err)
	}
	defer first.Close()
	middle, err := ListenVersioned(path, refusingStarter{}, NewTerminalInputs(), "middle")
	if err != nil {
		t.Fatal(err)
	}
	last, err := ListenVersioned(path, refusingStarter{}, NewTerminalInputs(), "last")
	if err != nil {
		t.Fatal(err)
	}
	defer last.Close()
	_ = middle.Close()
	answer, err := socketAnswer(path, WorkerRequest{AgentID: 7, Running: true})
	if err != nil || answer != RunningAnswer || !last.HasPrograms() {
		t.Fatalf("the first owner disappeared: %q, %v", answer, err)
	}
}

func TestReplacementKeepsALegacyOwnerUntilItsListenerCloses(t *testing.T) {
	path := filepath.Join(replacementFolder(t), "launcher")
	legacy, err := net.Listen("unix", path)
	if err != nil {
		t.Fatal(err)
	}
	legacy.(*net.UnixListener).SetUnlinkOnClose(false)
	defer legacy.Close()
	go func() {
		for {
			connection, err := legacy.Accept()
			if err != nil {
				return
			}
			go func() { _, _ = io.Copy(io.Discard, io.LimitReader(connection, 1)); _ = connection.Close() }()
		}
	}()
	replacement, err := ListenVersioned(path, refusingStarter{}, NewTerminalInputs(), "new")
	if err != nil {
		t.Fatal(err)
	}
	defer replacement.Close()
	if !replacement.HasPrograms() {
		t.Fatal("the old protocol's terminal owner was treated as idle")
	}
	_ = legacy.Close()
	if replacement.HasPrograms() {
		t.Fatal("the ended legacy owner kept the replacement alive")
	}
}

func TestReplacementKeepsALongSocketPathReachable(t *testing.T) {
	folder := replacementFolder(t)
	folder = filepath.Join(folder, strings.Repeat("d", 86-len(folder)-1))
	if err := os.Mkdir(folder, 0o700); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(folder, "launcher.sock")
	inputs := NewTerminalInputs()
	inputs.Reserve(3)
	first, err := ListenVersioned(path, refusingStarter{}, inputs, "first")
	if err != nil {
		t.Fatal(err)
	}
	defer first.Close()
	replacement, err := ListenVersioned(path, refusingStarter{}, NewTerminalInputs(), "next")
	if err != nil {
		t.Fatal(err)
	}
	defer replacement.Close()
	answer, err := socketAnswer(path, WorkerRequest{AgentID: 3, Running: true})
	if err != nil || answer != RunningAnswer {
		t.Fatalf("the long socket's old terminal disappeared: %q, %v", answer, err)
	}
}

func TestReplacementRetriesAStartFailureWithoutClosingTheExistingListener(t *testing.T) {
	folder := replacementFolder(t)
	binary, path := filepath.Join(folder, "journal"), filepath.Join(folder, "launcher")
	_ = os.WriteFile(binary, []byte("first"), 0o700)
	version, err := ReadBinaryVersion(binary)
	if err != nil {
		t.Fatal(err)
	}
	old, err := ListenVersioned(path, refusingStarter{}, NewTerminalInputs(), version.Digest)
	if err != nil {
		t.Fatal(err)
	}
	defer old.Close()
	_ = os.WriteFile(binary, []byte("next"), 0o700)
	latest, err := ReadBinaryVersion(binary)
	if err != nil {
		t.Fatal(err)
	}
	stop, done := make(chan struct{}), make(chan struct{})
	defer close(stop)
	attempts := 0
	var replacement *Listener
	failed := make(chan error, 1)
	go func() {
		watchBinary(stop, binary, path, version, func() error {
			attempts++
			if attempts == 1 {
				return fmt.Errorf("not ready")
			}
			replacement, err = ListenVersioned(path, refusingStarter{}, NewTerminalInputs(), latest.Digest)
			return err
		}, func(err error) { failed <- err }, 10*time.Millisecond)
		close(done)
	}()
	select {
	case <-failed:
		served, err := LauncherVersion(path)
		if err != nil || served != version.Digest {
			t.Fatal("a failed replacement closed the old listener")
		}
	case <-time.After(time.Second):
		t.Fatal("no failed attempt was reported")
	}
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("replacement was not retried")
	}
	defer replacement.Close()
	if attempts != 2 {
		t.Fatalf("replacement started %d times", attempts)
	}
}
