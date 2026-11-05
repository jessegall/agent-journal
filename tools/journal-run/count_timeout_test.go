package main

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"
)

func listingBinary(t *testing.T) string {
	t.Helper()
	program := filepath.Join(t.TempDir(), "journal-run")
	if output, err := exec.Command("go", "build", "-o", program, ".").CombinedOutput(); err != nil {
		t.Fatalf("build runner: %v: %s", err, output)
	}
	return program
}

func TestCountWaitTermination(t *testing.T) {
	program := listingBinary(t)
	for _, sample := range []struct {
		name, line, status string
		child              bool
	}{
		{"TERM ignored", "trap '' TERM; while :; do sleep 1; done", "124", false},
		{"descendant ignores TERM", "(trap '' TERM; sleep 30) & printf '%s' \"$!\" > child.pid; wait", "124", true},
		{"ordinary listing", "printf 'collected 8 items\\n'", "0", false},
	} {
		t.Run(sample.name, func(t *testing.T) {
			folder := t.TempDir()
			leaderFile := filepath.Join(folder, "leader.pid")
			line := "printf '%s' \"$$\" > " + quoted(leaderFile) + "; " + sample.line
			marker := filepath.Join(folder, "continued")
			script := CountWait(folder, line, ListingOptions{Program: program, LimitSeconds: 1, KillGraceMilliseconds: 100}) + "printf continued > " + quoted(marker)
			ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
			defer cancel()
			command := exec.CommandContext(ctx, "/bin/sh", "-c", script)
			command.Dir = folder
			command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
			command.WaitDelay = 200 * time.Millisecond
			t.Cleanup(func() {
				if command.Process != nil {
					_ = syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
				}
				if text, err := os.ReadFile(leaderFile); err == nil {
					pid, _ := strconv.Atoi(string(text))
					if pid > 0 {
						_ = syscall.Kill(-pid, syscall.SIGKILL)
					}
				}
			})
			if output, err := command.CombinedOutput(); err != nil || ctx.Err() != nil {
				t.Fatalf("listing did not finish within its limit: %v, %v: %s", err, ctx.Err(), output)
			}
			if status := readFile(t, filepath.Join(folder, "counted")); status != sample.status || !exists(marker) {
				t.Fatalf("listing status %q, continued %v", status, exists(marker))
			}
			if sample.child {
				pid, err := strconv.Atoi(readFile(t, filepath.Join(folder, "child.pid")))
				if err != nil {
					t.Fatal(err)
				}
				waitFor(t, time.Second, "the listing descendant to exit", func() bool { return !listingProcessRunning(pid) })
			}
			if sample.status == "0" && !strings.Contains(readFile(t, filepath.Join(folder, "count.out")), "8 items") {
				t.Fatal("the ordinary listing lost its output")
			}
		})
	}
}

func listingProcessRunning(pid int) bool {
	output, err := exec.Command("ps", "-o", "stat=", "-p", strconv.Itoa(pid)).Output()
	state := strings.TrimSpace(string(output))
	return err == nil && state != "" && !strings.HasPrefix(state, "Z")
}
