package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestProgressCountRunsInBackgroundAndSkipsKnownCounts(t *testing.T) {
	program := listingBinary(t)
	success, failed, recorded, counted, native := t.TempDir(), t.TempDir(), t.TempDir(), t.TempDir(), t.TempDir()
	if err := os.WriteFile(filepath.Join(recorded, "count-known"), []byte("1"), 0644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(counted, "counted"), []byte("0"), 0644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(native, "1.out"), []byte("collected 7 items\n"), 0644); err != nil {
		t.Fatal(err)
	}
	for _, sample := range []struct{ folder, line string }{
		{success, "printf 'tests/cart.py: 4\\n'"},
		{failed, "exit 1"},
		{recorded, "printf unexpected"},
		{counted, "printf unexpected"},
		{native, "printf unexpected"},
	} {
		started := time.Now()
		script := ProgressCount(sample.folder, sample.line, 1, "^collected ([0-9]+) items", ListingOptions{Program: program}) + "printf started"
		output, err := exec.Command("/bin/sh", "-c", script).CombinedOutput()
		if err != nil || string(output) != "started" || time.Since(started) > time.Second {
			t.Fatalf("test was delayed: %v %q", err, output)
		}
	}
	deadline := time.Now().Add(10 * time.Second)
	for time.Now().Before(deadline) {
		_, successErr := os.Stat(filepath.Join(success, "progress-count", "counted"))
		_, failedErr := os.Stat(filepath.Join(failed, "progress-count", "counted"))
		if successErr == nil && failedErr == nil {
			break
		}
		time.Sleep(20 * time.Millisecond)
	}
	for _, sample := range []struct{ folder, status string }{{success, "0"}, {failed, "1"}} {
		status, err := os.ReadFile(filepath.Join(sample.folder, "progress-count", "counted"))
		if err != nil || string(status) != sample.status {
			t.Fatalf("status %q: %v", status, err)
		}
	}
	for _, folder := range []string{recorded, counted, native} {
		if _, err := os.Stat(filepath.Join(folder, "progress-count")); !os.IsNotExist(err) {
			t.Fatalf("unexpected listing in %s", folder)
		}
	}
}

func TestProgressCountUsesTheSelectedPartsFolder(t *testing.T) {
	program := listingBinary(t)
	folder := t.TempDir()
	work := filepath.Join(folder, "work")
	if err := os.Mkdir(work, 0755); err != nil {
		t.Fatal(err)
	}
	parts := Parts("cd " + quoted(work) + " && sleep 4")
	script := Script(parts, folder, ProgressListing{Line: "pwd", Position: 2, Options: ListingOptions{Program: program}})
	if output, err := exec.Command("/bin/sh", "-c", script).CombinedOutput(); err != nil {
		t.Fatalf("run: %v %s", err, output)
	}
	output, err := os.ReadFile(filepath.Join(folder, "progress-count", "count.out"))
	if err != nil || strings.TrimSpace(string(output)) != work {
		t.Fatalf("listing folder %q: %v", output, err)
	}
}

func TestProgressCountFindsPytestTotalsWithoutAReaderTick(t *testing.T) {
	file := filepath.Join(t.TempDir(), "1.out")
	if err := os.WriteFile(file, []byte("\x1b[32m[4 items]\x1b[0m\n"), 0644); err != nil {
		t.Fatal(err)
	}
	if !hasProgressCount(file, `\[([0-9]+) items?\]`) {
		t.Fatal("the printed xdist count was missed")
	}
	if hasProgressCount(file, `^collected ([0-9]+) items`) {
		t.Fatal("a missing count matched")
	}
}
