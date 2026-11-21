package main

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"journal-agent/host"
	"journal-agent/project"
)

// connectedFolder makes a folder connected to a binding of its own in the state folder, as connect leaves it.
func connectedFolder(t *testing.T, stateFolder string, parent string, name string) string {
	t.Helper()
	root := filepath.Join(parent, name)
	if err := os.MkdirAll(filepath.Join(root, ".journal"), 0o700); err != nil {
		t.Fatal(err)
	}
	binding := host.Binding{
		Enrollment:    host.Enrollment{JournalURL: "https://journal.example.com", HostID: "host-" + name},
		ProjectID:     "project-" + name,
		BindingID:     "binding-" + name,
		RootID:        "root-" + name,
		CanonicalRoot: root,
	}
	state := host.ConnectionState{Folder: stateFolder, CanonicalRoot: root}
	if err := state.SaveBinding(binding); err != nil {
		t.Fatal(err)
	}
	content := `{"protocol":2,"binding":"binding-` + name + `","project":"project-` + name + `","host":"host-` + name +
		`","origin":"https://journal.example.com","rootId":"root-` + name + `"}`
	if err := os.WriteFile(filepath.Join(root, ".journal/connection.json"), []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := state.SaveRelayReport(host.RelayReport{ReportedAt: time.Now(), ExpiresAt: time.Now().Add(time.Minute)}); err != nil {
		t.Fatal(err)
	}

	return root
}

// realTempDir is a temporary folder by its real path, as the dispatcher resolves the folder it runs in.
func realTempDir(t *testing.T) string {
	t.Helper()
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}

	return folder
}

func TestStatusAnswersFromTheRootAndANestedFolderInAPathWithSpaces(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "my shop")
	nested := filepath.Join(root, "src", "deep folder")
	if err := os.MkdirAll(nested, 0o755); err != nil {
		t.Fatal(err)
	}
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }}

	for _, folder := range []string{root, nested} {
		answer, err := commands.run([]string{"status"}, folder)
		if err != nil || !strings.HasPrefix(answer, "Connected to https://journal.example.com · my shop · ") ||
			!strings.Contains(answer, "last contact ") {
			t.Fatalf("from %s: %q, %v", folder, answer, err)
		}
	}
}

func TestTwoConnectedRootsShowTheirOwnProjects(t *testing.T) {
	state := realTempDir(t)
	parent := realTempDir(t)
	shop := connectedFolder(t, state, parent, "shop")
	blog := connectedFolder(t, state, parent, "blog")
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }}

	shopStatus, _ := commands.run([]string{"status"}, shop)
	blogStatus, _ := commands.run([]string{"status"}, blog)

	if !strings.Contains(shopStatus, " · shop · ") || !strings.Contains(blogStatus, " · blog · ") {
		t.Fatalf("statuses %q and %q", shopStatus, blogStatus)
	}
}

func TestAStoppedRelayIsStartedByTheCommand(t *testing.T) {
	state := realTempDir(t)
	root := connectedFolder(t, state, realTempDir(t), "shop")
	woken := []string{}
	commands := dispatcher{stateFolder: state, wake: func(_ string, bindingID string) error {
		woken = append(woken, bindingID)
		return nil
	}}

	if _, err := commands.run([]string{"status"}, root); err != nil {
		t.Fatal(err)
	}
	unlock, err := host.ConnectionState{Folder: state, CanonicalRoot: root}.LockRelay()
	if err != nil {
		t.Fatal(err)
	}
	defer unlock()
	if _, err := commands.run([]string{"status"}, root); err != nil {
		t.Fatal(err)
	}

	if len(woken) != 1 || woken[0] != "binding-shop" {
		t.Fatalf("woke %v, want the stopped relay once", woken)
	}
}

func TestAMovedRootIsRefusedAndAnUnconnectedFolderSaysSo(t *testing.T) {
	state := realTempDir(t)
	parent := realTempDir(t)
	root := connectedFolder(t, state, parent, "shop")
	moved := filepath.Join(parent, "shop moved")
	if err := os.Rename(root, moved); err != nil {
		t.Fatal(err)
	}
	commands := dispatcher{stateFolder: state, wake: func(string, string) error { return nil }}

	if _, err := commands.run([]string{"status"}, moved); !errors.Is(err, project.ErrRootMoved) ||
		!strings.Contains(err.Error(), root) || !strings.Contains(err.Error(), moved) {
		t.Fatalf("a moved root answered %v", err)
	}
	answer, err := commands.run([]string{"status"}, realTempDir(t))
	if err != nil || !strings.HasPrefix(answer, "Not connected") {
		t.Fatalf("an unconnected folder answered %q, %v", answer, err)
	}
	if _, err := commands.run([]string{"overview"}, parent); err != nil {
		t.Fatalf("an unconnected overview failed: %v", err)
	}
}
