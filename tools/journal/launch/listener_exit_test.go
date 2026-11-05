package launch

import (
	"errors"
	"os/exec"
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
