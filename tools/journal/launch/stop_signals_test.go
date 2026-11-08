//go:build darwin || linux

package launch

import (
	"os"
	"os/exec"
	"syscall"
	"testing"
	"time"
)

// workerProgram tracks a program as the launcher does and closes it when it ends, as the starter's wait does.
func workerProgram(t *testing.T, inputs *TerminalInputs, agentID int, ended func(agentID int, closing bool)) *exec.Cmd {
	t.Helper()
	program := exec.Command("sleep", "60")
	if err := program.Start(); err != nil {
		t.Fatal(err)
	}
	inputs.Track(agentID, program)
	go func() {
		_ = program.Wait()
		ended(agentID, inputs.IsClosing())
		inputs.Close(agentID)
	}()
	return program
}

func TestAStopSignalEndsEachWorkerAsTheLaunchEndingAndExits(t *testing.T) {
	for _, received := range []os.Signal{syscall.SIGTERM, syscall.SIGHUP} {
		t.Run(received.String(), func(t *testing.T) {
			inputs := NewTerminalInputs()
			reports := make(chan bool, 2)
			ended := func(agentID int, closing bool) { reports <- closing }
			first, second := workerProgram(t, inputs, 7, ended), workerProgram(t, inputs, 8, ended)
			signals := make(chan os.Signal, 1)
			closed, exited := make(chan struct{}), make(chan int, 1)
			go endOnSignal(signals, inputs, func() { close(closed) }, func(code int) { exited <- code })
			signals <- received
			select {
			case code := <-exited:
				if code != 128+int(received.(syscall.Signal)) {
					t.Fatalf("the launcher exited with %d", code)
				}
			case <-time.After(10 * time.Second):
				t.Fatal("the launcher did not exit on the signal")
			}
			for range 2 {
				if closing := <-reports; !closing {
					t.Fatal("a worker was reported as ended by itself, so it could not be resumed")
				}
			}
			select {
			case <-closed:
			default:
				t.Fatal("the launcher's socket stayed open")
			}
			for _, program := range []*exec.Cmd{first, second} {
				if syscall.Kill(program.Process.Pid, 0) == nil {
					t.Fatal("a worker's program still runs")
				}
			}
		})
	}
}
