package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestCountWaitListsAfterTheSlotWait(t *testing.T) {
	folder := t.TempDir()
	program := listingBinary(t)
	script := CountWait(folder, "printf 'collected 8 items\\n'", ListingOptions{Program: program}) + "test -e " + quoted(filepath.Join(folder, "counted"))
	if output, err := exec.Command("/bin/sh", "-c", script).CombinedOutput(); err != nil {
		t.Fatalf("listing: %v %s", err, output)
	}
	output, err := os.ReadFile(filepath.Join(folder, "count.out"))
	if err != nil || !strings.Contains(string(output), "8 items") {
		t.Fatalf("output %q, error %v", output, err)
	}
	options := options(t, "echo run")
	options.Count = "printf listed"
	options.Listing.Program = program
	options.Queue = true
	os.MkdirAll(filepath.Join(options.Home, "processes", "4"), 0o755)
	os.WriteFile(filepath.Join(options.Home, "processes", "4", "slot"), nil, 0o644)
	run(t, options, newClient())
	scriptBytes, _ := os.ReadFile(filepath.Join(options.Home, "processes", "4", "run.sh"))
	if strings.Index(string(scriptBytes), "--count-listing") < 0 || strings.Index(string(scriptBytes), "--count-listing") < strings.Index(string(scriptBytes), "__journal_slot") {
		t.Fatalf("listing comes before the slot wait: %s", scriptBytes)
	}
}

func TestCountWaitStopsAListingAtItsLimit(t *testing.T) {
	folder := t.TempDir()
	script := CountWait(folder, "while :; do :; done", ListingOptions{Program: listingBinary(t), LimitSeconds: 1})
	if output, err := exec.Command("/bin/sh", "-c", script).CombinedOutput(); err != nil {
		t.Fatalf("timeout: %v %s", err, output)
	}
	status, err := os.ReadFile(filepath.Join(folder, "counted"))
	if err != nil || string(status) == "0" {
		t.Fatalf("hung listing status %q: %v", status, err)
	}
}

func TestNoCountLineAddsNoScript(t *testing.T) {
	if script := CountWait(t.TempDir(), ""); script != "" {
		t.Fatalf("empty listing made %q", script)
	}
	flags, err := ParseFlags([]string{"--process", "4", "--count", "pytest tests/cart.py --collect-only -q", "--", "pytest tests/cart.py"})
	if err != nil || flags.runOptions("/journal", "/bin/sh").Count != "pytest tests/cart.py --collect-only -q" {
		t.Fatalf("flags %v: %v", flags, err)
	}
}
