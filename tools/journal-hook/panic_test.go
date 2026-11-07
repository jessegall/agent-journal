package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestTheMainAgentGoesAroundTheJournalWhileThePanicFileExists(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".journal", "runtime"), 0o755); err != nil {
		t.Fatal(err)
	}
	if Panicking(root, "") {
		t.Fatal("no panic file, yet the hook went around the journal")
	}
	if err := os.WriteFile(filepath.Join(root, ".journal", PanicFile), []byte("main agent: the journal does not answer\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if !Panicking(root, "") || !Panicking(root, "main") {
		t.Fatal("the main agent's hook should go around the journal while the panic file exists")
	}
	if Panicking(root, "worker") || Panicking(root, "helper") {
		t.Fatal("a worker or helper must stay checked during a panic")
	}
	NotePanicBypass(root, "claude")
	text, err := os.ReadFile(filepath.Join(root, ".journal", "runtime", "bypass.log"))
	if err != nil || len(text) == 0 {
		t.Fatal("the bypass was not recorded")
	}
}
