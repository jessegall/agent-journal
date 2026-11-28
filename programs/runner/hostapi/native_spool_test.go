package hostapi

import (
	"context"
	"fmt"
	"os/exec"
	"runtime"
	"syscall"
	"testing"
	"time"

	"journal-runner/host"
)

func TestRestartInventoryIncludesAnAdoptedNativeProcessWithoutAContainer(t *testing.T) {
	state := t.TempDir()
	queue, err := OpenReportQueue(state, func(ProcessReport) error { return nil })
	if err != nil {
		t.Fatal(err)
	}
	openTable := func() *ProcessTable {
		outputs := NewOutputs(state, func(string, Output) error { return nil })
		return OpenProcessTable(state, host.Containers{}, queue, outputs)
	}
	restarted := openTable()
	child := exec.Command("sleep", "30")
	child.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := child.Start(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		_ = child.Process.Kill()
		_ = child.Wait()
		if held, err := restarted.held("native"); err == nil {
			select {
			case <-held.exited:
			case <-time.After(5 * time.Second):
				t.Error("the adopted process's exit was not reported")
			}
		}
	})

	first := openTable()
	first.keep(&heldProcess{
		id:     "native",
		plan:   OpenPlan{Type: "pipe"},
		pid:    child.Process.Pid,
		exited: make(chan struct{}),
	})
	if err := restarted.Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}
	inventory := restarted.Inventory()
	wanted := InventoryProcess{ProcessID: "native", Identity: fmt.Sprintf("pid:%d", child.Process.Pid), IsAlive: true}
	if len(inventory) != 1 || inventory[0] != wanted {
		t.Fatalf("the restart inventory is %+v, want %+v", inventory, wanted)
	}
}

// An ended process that nobody reaped yet counts as gone, so an adopted process whose host died is reported ended.
func TestUnreapedProcessCountsAsGone(t *testing.T) {
	if runtime.GOOS != "linux" {
		t.Skip("only Linux tells a zombie through /proc")
	}
	child := exec.Command("sh", "-c", "exit 0")
	child.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := child.Start(); err != nil {
		t.Fatal(err)
	}
	pid := child.Process.Pid
	deadline := time.Now().Add(5 * time.Second)
	for !isZombie(pid) && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}
	alive := isGroupAlive(pid)
	_ = child.Wait()

	if alive {
		t.Fatalf("the unreaped process %d still counts as running", pid)
	}
}
