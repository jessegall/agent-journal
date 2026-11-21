package main

import (
	"bytes"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/host"
	"journal-agent/project"
)

// answeringTerminal points connect's terminal at a file that answers with the given line.
func answeringTerminal(t *testing.T, answer string) {
	t.Helper()
	path := filepath.Join(t.TempDir(), "tty")
	if err := os.WriteFile(path, []byte(answer), 0o600); err != nil {
		t.Fatal(err)
	}
	previous := terminalPath
	terminalPath = path
	t.Cleanup(func() { terminalPath = previous })
}

func TestALineRunInAGitSubfolderConnectsTheRepositoryRoot(t *testing.T) {
	root, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if output, err := exec.Command("git", "-C", root, "init", "-q").CombinedOutput(); err != nil {
		t.Fatalf("git init: %v: %s", err, output)
	}
	subfolder := filepath.Join(root, "app", "src")
	if err := os.MkdirAll(subfolder, 0o755); err != nil {
		t.Fatal(err)
	}
	t.Chdir(subfolder)

	target, err := resolveTarget()

	if err != nil || target.root != root || !target.isGit {
		t.Fatalf("the target is %+v, %v; want the repository root %s", target, err, root)
	}
}

func TestAPlainFolderConnectsItselfWithoutWorktrees(t *testing.T) {
	folder, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	t.Chdir(folder)
	answeringTerminal(t, "yes\n")
	var out bytes.Buffer

	target, err := resolveTarget()
	if err != nil {
		t.Fatal(err)
	}
	if err := target.confirm("https://journal.example.com", &out); err != nil {
		t.Fatal(err)
	}

	if target.isGit || target.root != folder || !strings.Contains(out.String(), "no worktrees of their own") {
		t.Fatalf("the plain folder resolved to %+v and said %q", target, out.String())
	}
}

func TestTheFolderIsConfirmedOnTheTerminalAndNeverOnPipedInput(t *testing.T) {
	target := targetFolder{root: "/work/shop", isGit: true}

	answeringTerminal(t, "no\n")
	if err := target.confirm("https://journal.example.com", &bytes.Buffer{}); !errors.Is(err, errFolderNotConfirmed) {
		t.Fatalf("a no on the terminal answered %v", err)
	}

	terminalPath = filepath.Join(t.TempDir(), "missing")
	reader, writer, err := os.Pipe()
	if err != nil {
		t.Fatal(err)
	}
	writer.WriteString("yes\n")
	writer.Close()
	stdin := os.Stdin
	os.Stdin = reader
	t.Cleanup(func() { os.Stdin = stdin })
	if err := target.confirm("https://journal.example.com", &bytes.Buffer{}); !errors.Is(err, errNoTerminal) {
		t.Fatalf("a piped yes with no terminal answered %v", err)
	}

	answeringTerminal(t, "yes\n")
	var out bytes.Buffer
	if err := target.confirm("https://journal.example.com", &out); err != nil {
		t.Fatalf("a yes on the terminal answered %v", err)
	}
	if !strings.Contains(out.String(), "/work/shop to https://journal.example.com") {
		t.Fatalf("the folder was not shown: %q", out.String())
	}
}

func TestAConnectedFolderShowsItsBindingAndLeavesTheNewLineUnused(t *testing.T) {
	root := t.TempDir()
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: root}
	binding := host.Binding{Enrollment: host.Enrollment{JournalURL: "https://journal.example.com"},
		ProjectLabel: "Shop", BindingID: "binding-1", CanonicalRoot: root}
	if err := state.SaveBinding(binding); err != nil {
		t.Fatal(err)
	}
	target := targetFolder{root: root, isGit: true}

	if err := target.assertNotConnected(state, &bytes.Buffer{}); err != nil {
		t.Fatalf("a connection whose setup was interrupted was refused: %v", err)
	}
	// A finished setup, as SetUp leaves it.
	if err := os.MkdirAll(filepath.Join(root, ".journal"), 0o700); err != nil {
		t.Fatal(err)
	}
	finished := `{"done":["connection","hooks","ignore"],"generation":1}`
	if err := os.WriteFile(filepath.Join(root, ".journal", "setup.json"), []byte(finished), 0o600); err != nil {
		t.Fatal(err)
	}
	if !(project.Folder{Root: root}).IsSetUp() {
		t.Fatal("the finished setup does not read as set up")
	}
	var out bytes.Buffer
	err := target.assertNotConnected(state, &out)

	if !errors.Is(err, errAlreadyConnected) {
		t.Fatalf("a connected folder answered %v", err)
	}
	for _, shown := range []string{"https://journal.example.com", "Shop", "binding-1", root, "journal disconnect"} {
		if !strings.Contains(out.String(), shown) {
			t.Errorf("the refusal does not show %q: %q", shown, out.String())
		}
	}
}

// copiedFolder is a folder holding the journal setup of binding-1, copied from another place: its marker, its
// finished setup record, a file of the user's and a worktree the original kept.
func copiedFolder(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	for _, folder := range []string{".journal", filepath.Join(".journal", "worktrees", "feature")} {
		if err := os.MkdirAll(filepath.Join(root, folder), 0o700); err != nil {
			t.Fatal(err)
		}
	}
	files := map[string]string{
		filepath.Join(".journal", "connection.json"): `{"protocol":2,"binding":"binding-1","rootId":"root-1"}`,
		filepath.Join(".journal", "setup.json"):      `{"done":["connection","hooks","ignore"],"generation":3}`,
		"notes.txt": "the user's own notes",
	}
	for name, content := range files {
		if err := os.WriteFile(filepath.Join(root, name), []byte(content), 0o600); err != nil {
			t.Fatal(err)
		}
	}

	return root
}

func TestACopiedFolderIsEnrolledFreshOnlyOnceConfirmedAndKeepsItsFilesAndWorktrees(t *testing.T) {
	root := copiedFolder(t)
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: root}
	target := targetFolder{root: root, isGit: true}

	answeringTerminal(t, "yes\n")
	var out bytes.Buffer
	if err := target.checkIdentity(state, &out); !errors.Is(err, errFreshNotConfirmed) {
		t.Fatalf("a copied folder went on without a fresh enrollment: %v", err)
	}
	if !strings.Contains(out.String(), "binding-1") || !strings.Contains(out.String(), "moved or copied") {
		t.Fatalf("the mismatch was not shown: %q", out.String())
	}
	if _, err := os.Stat(filepath.Join(root, ".journal", "connection.json")); err != nil {
		t.Fatalf("a refused fresh enrollment changed the folder: %v", err)
	}

	answeringTerminal(t, "fresh\n")
	if err := target.checkIdentity(state, &bytes.Buffer{}); err != nil {
		t.Fatal(err)
	}

	for _, gone := range []string{"connection.json", "setup.json"} {
		if _, err := os.Stat(filepath.Join(root, ".journal", gone)); !os.IsNotExist(err) {
			t.Fatalf("the copied %s is still there: %v", gone, err)
		}
	}
	for _, kept := range []string{"notes.txt", filepath.Join(".journal", "worktrees", "feature")} {
		if _, err := os.Stat(filepath.Join(root, kept)); err != nil {
			t.Fatalf("%s was not kept: %v", kept, err)
		}
	}
	if (project.Folder{Root: root}).SetupGeneration() != 0 {
		t.Fatal("the fresh enrollment would resume the copied setup's steps")
	}
}

func TestAFolderWhoseDisconnectWasCutShortIsFinishedBeforeAnyLineIsSpent(t *testing.T) {
	root := copiedFolder(t)
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: root}
	if err := (host.DisconnectRecord{BindingID: "binding-1", CanonicalRoot: root}).Save(state.Folder); err != nil {
		t.Fatal(err)
	}
	var out bytes.Buffer

	err := targetFolder{root: root, isGit: true}.checkIdentity(state, &out)

	if !errors.Is(err, errDisconnectUnfinished) || !strings.Contains(out.String(), "journal disconnect --resume binding-1") {
		t.Fatalf("an unfinished disconnect answered %v, %q", err, out.String())
	}
}
