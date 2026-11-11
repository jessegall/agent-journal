//go:build darwin || linux

package launch

import (
	"bufio"
	"encoding/json"
	"errors"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
)

func TestAnExitCodeIsTheProgramsAndASignalCountsAsFailed(t *testing.T) {
	if exitCode(nil) != 0 {
		t.Error("a clean end has code 0")
	}
	if exitCode(errors.New("no program")) != 1 {
		t.Error("an error with no code counts as failed")
	}
	failed := exec.Command("sh", "-c", "exit 7").Run()
	if exitCode(failed) != 7 {
		t.Errorf("gave %d", exitCode(failed))
	}
}

func TestAStopEndsAProgramThatIgnoresTheFirstSignal(t *testing.T) {
	inputs := NewTerminalInputs()
	program := exec.Command("sh", "-c", "trap '' TERM; sleep 60")
	program.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := program.Start(); err != nil {
		t.Fatal(err)
	}
	inputs.Track(5, program)
	go func() {
		_ = program.Wait()
		inputs.Close(5)
	}()
	if !inputs.StopProgram(5) || inputs.IsOpen(5) {
		t.Error("the program stayed")
	}
}

func TestASecondLaunchKeepsTheFirstProgramsReachable(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	path := filepath.Join(folder, "launcher")
	first, second := NewTerminalInputs(), NewTerminalInputs()
	program := exec.Command("sh", "-c", "sleep 60")
	program.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := program.Start(); err != nil {
		t.Fatal(err)
	}
	first.Track(5, program)
	go func() {
		_ = program.Wait()
		first.Close(5)
	}()
	firstSocket, err := Listen(path, ProcessStarter{Inputs: first}, first)
	if err != nil {
		t.Fatal(err)
	}
	defer firstSocket.Close()
	secondSocket, err := Listen(path, ProcessStarter{Inputs: second}, second)
	if err != nil {
		t.Fatal(err)
	}
	connection, err := net.Dial("unix", path)
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	_ = json.NewEncoder(connection).Encode(WorkerRequest{AgentID: 5, Stop: true})
	answer, _ := bufio.NewReader(connection).ReadString('\n')
	if strings.TrimSpace(answer) != StoppedAnswer {
		t.Errorf("a stop of the first launch's program answered %q", answer)
	}
	_ = secondSocket.Close()
	probe, err := net.Dial("unix", path)
	if err != nil {
		t.Fatalf("the first launch did not get its socket back: %v", err)
	}
	_ = probe.Close()
}

func listenerOnOwnPath(t *testing.T, path string) (*Listener, *TerminalInputs) {
	t.Helper()
	inputs := NewTerminalInputs()
	listener, err := ListenVersioned(path, ProcessStarter{Inputs: inputs}, inputs, "story")
	if err != nil {
		t.Fatal(err)
	}
	return listener, inputs
}

func TestALaunchThatGaveItsRoutesStaysOnlyForProgramsOfItsOwn(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	path := filepath.Join(folder, "launcher")
	first, firstInputs := listenerOnOwnPath(t, path)
	defer first.Close()
	program := exec.Command("sh", "-c", "sleep 60")
	program.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := program.Start(); err != nil {
		t.Fatal(err)
	}
	firstInputs.Track(5, program)
	defer firstInputs.StopProgram(5)
	go func() {
		_ = program.Wait()
		firstInputs.Close(5)
	}()
	second, _ := listenerOnOwnPath(t, path)
	defer second.Close()
	if !second.HasPrograms() {
		t.Fatal("the public launch must stay while the launch before it has a program only it routes to")
	}
	third, _ := listenerOnOwnPath(t, path)
	defer third.Close()
	if second.HasPrograms() {
		t.Error("the second launch has no program of its own and gave its routes away, and still stays")
	}
	if !first.HasPrograms() || !third.HasPrograms() {
		t.Error("the launch with the program and the public launch must stay")
	}
}

func refusingSocket(t *testing.T, path string) {
	t.Helper()
	closed, err := net.Listen("unix", path)
	if err != nil {
		t.Fatal(err)
	}
	closed.(*net.UnixListener).SetUnlinkOnClose(false)
	_ = closed.Close()
}

func TestTheSocketOfALauncherThatRunsAndDoesNotAnswerIsLeftAlone(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	path := filepath.Join(folder, "launcher")
	refusingSocket(t, path)
	if err := os.Symlink(strconv.Itoa(os.Getpid()), ownerLink(path)); err != nil {
		t.Fatal(err)
	}
	inputs := NewTerminalInputs()
	if _, err := Listen(path, ProcessStarter{Inputs: inputs}, inputs); !errors.Is(err, ErrLauncherRuns) {
		t.Fatalf("a second launcher took the socket of one that runs: %v", err)
	}
	if _, err := os.Lstat(path); err != nil {
		t.Error("the socket of the launcher that runs was removed")
	}
}

func TestTheSocketLeftByALauncherThatEndedIsTakenAndTheNewLauncherIsItsOwner(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	path := filepath.Join(folder, "launcher")
	refusingSocket(t, path)
	ended := exec.Command("sh", "-c", "exit 0")
	if err := ended.Run(); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(strconv.Itoa(ended.Process.Pid), ownerLink(path)); err != nil {
		t.Fatal(err)
	}
	inputs := NewTerminalInputs()
	listener, err := Listen(path, ProcessStarter{Inputs: inputs}, inputs)
	if err != nil {
		t.Fatalf("the socket of a launcher that ended was not taken: %v", err)
	}
	defer listener.Close()
	if owner, _ := os.Readlink(ownerLink(path)); owner != strconv.Itoa(os.Getpid()) {
		t.Errorf("the owner link names %q, not this launcher", owner)
	}
}
