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
