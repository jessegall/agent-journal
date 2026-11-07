//go:build darwin || linux

package main

import (
	"path/filepath"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal/launch"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

func TestReplacementListenerDoesNotStartWithoutAnExistingLaunch(t *testing.T) {
	home := t.TempDir()
	inputs := launch.NewTerminalInputs()
	listener, err := replacementListener(home, "new", launch.ProcessStarter{Home: home, Inputs: inputs}, inputs)
	if err != nil || listener != nil {
		t.Fatalf("an unneeded launcher was started: %v, %v", listener, err)
	}
}

func TestReplacementListenerKeepsTheSameVersionAndSerializesTakeovers(t *testing.T) {
	home := t.TempDir()
	inputs := launch.NewTerminalInputs()
	original, err := launch.ListenVersioned(socket.NamedPath(home, "launcher"), launch.ProcessStarter{Home: home, Inputs: inputs}, inputs, "current")
	if err != nil {
		t.Fatal(err)
	}
	defer original.Close()
	listener, err := replacementListener(home, "current", launch.ProcessStarter{Inputs: inputs}, inputs)
	if err != nil || listener != nil {
		t.Fatalf("the same executable was replaced: %v, %v", listener, err)
	}
	unlock, err := lockLauncherReplacement(filepath.Join(home, "launcher-replace.lock"))
	if err != nil {
		t.Fatal(err)
	}
	listener, err = replacementListener(home, "new", launch.ProcessStarter{Inputs: inputs}, inputs)
	unlock()
	if err == nil || listener != nil {
		t.Fatal("a concurrent replacement passed the lock")
	}
	listener, err = replacementListener(home, "new", launch.ProcessStarter{Inputs: inputs}, inputs)
	if err != nil || listener == nil {
		t.Fatalf("the replacement did not start after the lock was released: %v", err)
	}
	defer listener.Close()
	version, err := launch.LauncherVersion(socket.NamedPath(home, "launcher"))
	if err != nil || version != "new" {
		t.Fatalf("the replacement serves %q, %v", version, err)
	}
}
