//go:build darwin || linux

package launch

import (
	"errors"
	"os/exec"
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
