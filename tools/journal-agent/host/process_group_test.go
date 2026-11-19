package host

import (
	"os/exec"
	"syscall"
	"testing"
	"time"
)

var quickStages = StopStages{Grace: 300 * time.Millisecond, Force: 2 * time.Second, Poll: 20 * time.Millisecond}

func startGroup(t *testing.T, script string) OwnedGroup {
	t.Helper()
	command := exec.Command("sh", "-c", script)
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := command.Start(); err != nil {
		t.Fatalf("could not start the child: %v", err)
	}
	ended := make(chan struct{})
	go func() {
		_ = command.Wait()
		close(ended)
	}()
	t.Cleanup(func() {
		_ = syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
		<-ended
	})
	time.Sleep(100 * time.Millisecond)

	return OwnedGroupOf(command.Process.Pid)
}

func TestAChildThatEndsOnTheGracefulSignalIsProvenStopped(t *testing.T) {
	group := startGroup(t, "sleep 30")

	if outcome := group.Stop(quickStages); outcome != StopProven {
		t.Fatalf("the stop ended %v", outcome)
	}
}

func TestAChildIgnoringTheGracefulSignalIsStoppedByForceWithinTheBound(t *testing.T) {
	group := startGroup(t, `trap "" TERM; while true; do sleep 1; done`)
	started := time.Now()

	outcome := group.Stop(quickStages)

	if outcome != StopProven || time.Since(started) > quickStages.Grace+quickStages.Force {
		t.Fatalf("the stop ended %v after %s", outcome, time.Since(started))
	}
}

func TestAReusedProcessIDWithAnotherStartIsNeverSignalled(t *testing.T) {
	group := startGroup(t, "sleep 30")
	other := OwnedGroup{Pid: group.Pid, StartIdentity: "Mon Jan  1 00:00:00 2001"}

	if err := other.Signal(syscall.SIGTERM); err != ErrNotOwned {
		t.Fatalf("the signal was %v", err)
	}
	if outcome := other.Stop(quickStages); outcome != StopNotOwned {
		t.Fatalf("the stop ended %v", outcome)
	}
	if !group.IsOwned() {
		t.Fatal("the real child was signalled")
	}
}
