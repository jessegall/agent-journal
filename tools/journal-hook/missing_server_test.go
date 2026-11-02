package main

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

// journalWithProgram is a project whose journal program only notes that it ran.
func journalWithProgram(t *testing.T) (root, ranFile string) {
	t.Helper()
	root = t.TempDir()
	bin := filepath.Join(root, ".journal", "bin")
	if err := os.MkdirAll(bin, 0o755); err != nil {
		t.Fatal(err)
	}
	ranFile = filepath.Join(root, "ran")
	script := "#!/bin/sh\ntouch '" + ranFile + "'\n"
	if err := os.WriteFile(filepath.Join(bin, "journal"), []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
	return root, ranFile
}

func TestAHookThatFindsNoServerStartsOne(t *testing.T) {
	root, ranFile := journalWithProgram(t)
	startMissingServer(root)
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		if _, err := os.Stat(ranFile); err == nil {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("the journal program did not run")
}

func TestAHookStartsNothingWhileTheSocketIsThere(t *testing.T) {
	root, ranFile := journalWithProgram(t)
	if err := os.WriteFile(filepath.Join(root, ".journal", "server.sock"), nil, 0o644); err != nil {
		t.Fatal(err)
	}
	startMissingServer(root)
	time.Sleep(200 * time.Millisecond)
	if _, err := os.Stat(ranFile); err == nil {
		t.Fatal("a server was started beside the one that holds the socket")
	}
}
