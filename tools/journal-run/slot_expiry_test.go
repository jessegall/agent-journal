package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestAnExpiredQueueSlotNeverRunsTheCommandAndAFreshRetryCanRun(t *testing.T) {
	marker := filepath.Join(t.TempDir(), "executed")
	setup := options(t, "printf executed > "+quoted(marker))
	setup.Queue = true
	setup.QueueWait = 3 * time.Second
	setup.SlotWaitLimitSeconds = 1
	client := newClient()
	output, code := run(t, setup, client)
	folder := NewFolder(setup.Home, setup.Process)
	if code != 124 || exists(marker) || folder.Started(1) {
		t.Fatalf("unadmitted run returned %d, marker %v, part started %v: %s", code, exists(marker), folder.Started(1), output)
	}
	if !strings.Contains(output, "queue slot wait expired") || !strings.Contains(strings.Join(client.reported(), "\n"), "process end 4 --exit-code 124") {
		t.Fatalf("slot expiry was not reported: %q, %v", output, client.reported())
	}
	setup.Process = 5
	retry := NewFolder(setup.Home, setup.Process)
	if err := os.MkdirAll(retry.Path, 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(retry.Path, "slot"), nil, 0644); err != nil {
		t.Fatal(err)
	}
	if output, code := run(t, setup, newClient()); code != 0 || !exists(marker) {
		t.Fatalf("admitted retry returned %d, marker %v: %s", code, exists(marker), output)
	}
}

func TestAMissingQueueFolderNeverGrantsItsSlot(t *testing.T) {
	marker := filepath.Join(t.TempDir(), "executed")
	script := SlotWait(t.TempDir(), 4, true, 1) + "printf executed > " + quoted(marker)
	output, err := exec.Command("/bin/sh", "-c", script).CombinedOutput()
	if err == nil || exists(marker) || !strings.Contains(string(output), "queue folder is missing") {
		t.Fatalf("missing queue executed command: %v, marker %v: %s", err, exists(marker), output)
	}
}
