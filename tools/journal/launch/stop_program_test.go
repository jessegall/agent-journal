package launch

import (
	"os/exec"
	"testing"
)

func TestAStopRequestEndsTheAgentsProgram(t *testing.T) {
	inputs := NewTerminalInputs()
	program := exec.Command("sleep", "60")
	if err := program.Start(); err != nil {
		t.Fatal(err)
	}
	inputs.Track(7, program)
	ended := make(chan error, 1)
	go func() {
		ended <- program.Wait()
		inputs.Close(7)
	}()
	if !inputs.StopProgram(7) {
		t.Fatal("the program was not stopped")
	}
	if err := <-ended; err == nil {
		t.Fatal("the program ended by itself")
	}
}

func TestAStopRequestForAnAgentWithNoProgramSaysSo(t *testing.T) {
	if NewTerminalInputs().StopProgram(7) {
		t.Fatal("a program was stopped that does not run")
	}
}
