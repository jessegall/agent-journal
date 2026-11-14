//go:build darwin || linux

package main

import (
	"net"
	"path/filepath"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal/launch"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

func TestReplacementListenerDoesNotStartWithoutAnExistingLaunch(t *testing.T) {
	home := t.TempDir()
	inputs := launch.NewTerminalInputs()
	listener, err := replacementListener(home, "new", false, launch.ProcessStarter{Home: home, Inputs: inputs}, inputs)
	if err != nil || listener != nil {
		t.Fatalf("an unneeded launcher was started: %v, %v", listener, err)
	}
}

func TestAStandaloneServiceServesOverASocketNobodyAnswersOn(t *testing.T) {
	home := t.TempDir()
	path := socket.NamedPath(home, "launcher")
	stale, err := net.Listen("unix", path)
	if err != nil {
		t.Fatal(err)
	}
	stale.(*net.UnixListener).SetUnlinkOnClose(false)
	_ = stale.Close()
	inputs := launch.NewTerminalInputs()
	listener, err := replacementListener(home, "new", true, launch.ProcessStarter{Home: home, Inputs: inputs}, inputs)
	if err != nil || listener == nil {
		t.Fatalf("the standalone service did not start over a stale socket: %v", err)
	}
	defer listener.Close()
	version, err := launch.LauncherVersion(path)
	if err != nil || version != "new" {
		t.Fatalf("the standalone service serves %q, %v", version, err)
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
	listener, err := replacementListener(home, "current", false, launch.ProcessStarter{Inputs: inputs}, inputs)
	if err != nil || listener != nil {
		t.Fatalf("the same executable was replaced: %v, %v", listener, err)
	}
	unlock, err := lockLauncherReplacement(filepath.Join(home, "launcher-replace.lock"))
	if err != nil {
		t.Fatal(err)
	}
	listener, err = replacementListener(home, "new", false, launch.ProcessStarter{Inputs: inputs}, inputs)
	unlock()
	if err == nil || listener != nil {
		t.Fatal("a concurrent replacement passed the lock")
	}
	listener, err = replacementListener(home, "new", false, launch.ProcessStarter{Inputs: inputs}, inputs)
	if err != nil || listener == nil {
		t.Fatalf("the replacement did not start after the lock was released: %v", err)
	}
	defer listener.Close()
	version, err := launch.LauncherVersion(socket.NamedPath(home, "launcher"))
	if err != nil || version != "new" {
		t.Fatalf("the replacement serves %q, %v", version, err)
	}
}
