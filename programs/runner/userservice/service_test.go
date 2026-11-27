package userservice

import (
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func TestReplacePointsAnEnabledServiceAtTheNewProgramAndLeavesNoServiceAlone(t *testing.T) {
	var ran [][]string
	record := func(name string, arguments ...string) error {
		ran = append(ran, append([]string{name}, arguments...))
		return nil
	}
	previous := Service{Home: t.TempDir(), BindingID: "b1", Program: "/old/bin/journal-runner", StateFolder: "/state", Run: record}
	path, content, _, err := previous.definition()
	if errors.Is(err, ErrNoServiceManager) {
		t.Skip("this machine has no user service manager")
	}
	if err != nil {
		t.Fatal(err)
	}
	next := previous
	next.Program = "/new/bin/journal-runner"

	if err := next.Replace(previous.Program); err != nil {
		t.Fatalf("with no service file the replace answered %v", err)
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, content, 0o644); err != nil {
		t.Fatal(err)
	}
	if err := next.Replace(previous.Program); err != nil {
		t.Fatal(err)
	}
	written, _ := os.ReadFile(path)

	if !strings.Contains(string(written), "/new/bin/journal-runner") || strings.Contains(string(written), "/old/bin/") {
		t.Fatalf("the service file was not pointed at the new program:\n%s", written)
	}
	if runtime.GOOS == "linux" && (len(ran) != 1 || ran[0][0] != "systemctl") {
		t.Fatalf("the replace ran %v, not one systemctl reload", ran)
	}
}

func TestReplaceLeavesAServiceFileChangedByHandInPlace(t *testing.T) {
	previous := Service{Home: t.TempDir(), BindingID: "b1", Program: "/old/bin/journal-runner", StateFolder: "/state",
		Run: func(string, ...string) error { return nil }}
	path, _, _, err := previous.definition()
	if errors.Is(err, ErrNoServiceManager) {
		t.Skip("this machine has no user service manager")
	}
	if err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte("written by hand"), 0o644); err != nil {
		t.Fatal(err)
	}
	next := previous
	next.Program = "/new/bin/journal-runner"

	err = next.Replace(previous.Program)
	written, _ := os.ReadFile(path)

	if err == nil || string(written) != "written by hand" {
		t.Fatalf("a hand-changed service file was replaced: %v, %q", err, written)
	}
}
