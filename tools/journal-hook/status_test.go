package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestTheStatusLineKeepsOneFilePerSession(t *testing.T) {
	root := t.TempDir()
	body := `{"session_id": "s-1", "context_window": {"used_percentage": 55}}`
	if err := KeepStatus(strings.NewReader(body), root); err != nil {
		t.Fatal(err)
	}
	statusFile, err := os.ReadFile(filepath.Join(root, ".journal", "runtime", "status", "s-1.json"))
	if err != nil || string(statusFile) != body {
		t.Fatalf("statusFile %q, %v", statusFile, err)
	}
}

func TestAStatusWithoutAPlainSessionIdKeepsNothing(t *testing.T) {
	root := t.TempDir()
	for _, body := range []string{`{}`, `{"session_id": "../escape"}`, `not json`} {
		if err := KeepStatus(strings.NewReader(body), root); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "status")); !os.IsNotExist(err) {
		t.Fatalf("a status folder was made: %v", err)
	}
}
