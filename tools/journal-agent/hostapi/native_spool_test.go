package hostapi

import (
	"os/exec"
	"runtime"
	"syscall"
	"testing"
	"time"
)

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
