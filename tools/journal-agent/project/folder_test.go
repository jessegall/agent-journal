package project

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/host"
	"journal-agent/release"
)

const claudeTemplate = `{"hooks":{"PreToolUse":[{"hooks":[{"type":"command","command":"{{hook-entry}} claude-code"}]}]}}`

// installation seals a small remote-project installation with its hook entry point and one hook template.
func installation(t *testing.T) host.Installation {
	t.Helper()
	base, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chmod(base, 0o700); err != nil {
		t.Fatal(err)
	}
	manifest := host.InstallationManifest{}
	for name, content := range map[string]string{
		"bin/journal-hook":                "#!/bin/sh\nexit 2\n",
		"hooks/claude-code/settings.json": claudeTemplate,
	} {
		source := filepath.Join(base, strings.ReplaceAll(name, "/", "-"))
		if err := os.WriteFile(source, []byte(content), 0o600); err != nil {
			t.Fatal(err)
		}
		digest := sha256.Sum256([]byte(content))
		manifest.Artifacts = append(manifest.Artifacts, host.Artifact{
			Name: name, Source: source, SHA256: hex.EncodeToString(digest[:]), Executable: strings.HasPrefix(name, "bin/"),
		})
	}
	folder := filepath.Join(base, "installation")
	if err := host.Install(manifest, folder); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		_ = filepath.WalkDir(folder, func(path string, entry os.DirEntry, err error) error {
			if err == nil && entry.IsDir() {
				_ = os.Chmod(path, 0o700)
			}
			return nil
		})
	})

	return host.Installation{Folder: folder}
}

func gitFolder(t *testing.T, ignore string) Folder {
	t.Helper()
	root, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if printed, err := exec.Command("git", "-C", root, "init", "-q").CombinedOutput(); err != nil {
		t.Fatalf("git init: %v\n%s", err, printed)
	}
	if err := os.WriteFile(filepath.Join(root, ".gitignore"), []byte(ignore), 0o644); err != nil {
		t.Fatal(err)
	}

	return Folder{Root: root}
}

var connection = Connection{Protocol: 2, BindingID: "binding", ProjectID: "project", HostID: "host", Origin: "https://journal.example.com", RootID: "root"}

func TestSetUpWritesTheConnectionTheHooksAndOneIgnoreRuleKeepingTheIgnoreBytes(t *testing.T) {
	folder := gitFolder(t, "node_modules\r\nvendor")
	installed := installation(t)

	if err := folder.SetUp(connection, installed); err != nil {
		t.Fatal(err)
	}
	if err := folder.SetUp(connection, installed); err != nil {
		t.Fatal(err)
	}

	ignore, _ := os.ReadFile(filepath.Join(folder.Root, ".gitignore"))
	if string(ignore) != "node_modules\r\nvendor\r\n/.journal/\r\n" {
		t.Fatalf(".gitignore is %q", ignore)
	}
	hooks, err := os.ReadFile(filepath.Join(folder.Root, ".journal/hooks/claude-code/settings.json"))
	if err != nil || !strings.Contains(string(hooks), installed.Path("bin/journal-hook")+" claude-code") ||
		strings.Contains(string(hooks), release.HookEntryPlaceholder) {
		t.Fatalf("the hooks hold %s, %v", hooks, err)
	}
	stored, err := os.ReadFile(filepath.Join(folder.Root, ".journal/connection.json"))
	if err != nil || !strings.Contains(string(stored), `"binding":"binding"`) || strings.Contains(string(stored), "secret") {
		t.Fatalf("connection.json holds %s, %v", stored, err)
	}
	if printed, _ := exec.Command("git", "-C", folder.Root, "diff", "--cached", "--name-only").Output(); len(printed) != 0 {
		t.Fatalf("setup staged %s", printed)
	}
}

func TestAFolderGitAlreadyIgnoresGetsNoRule(t *testing.T) {
	folder := gitFolder(t, ".journal\n")

	if err := folder.SetUp(connection, installation(t)); err != nil {
		t.Fatal(err)
	}

	ignore, _ := os.ReadFile(filepath.Join(folder.Root, ".gitignore"))
	if string(ignore) != ".journal\n" {
		t.Fatalf(".gitignore is %q", ignore)
	}
}

func TestAnInterruptedSetupFinishesOnTheNextRun(t *testing.T) {
	folder := gitFolder(t, "")
	if err := os.MkdirAll(filepath.Join(folder.Root, ".journal"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := writeJSON(folder.path(connectionName), connection); err != nil {
		t.Fatal(err)
	}
	if err := writeJSON(folder.path(setupName), setupProgress{Done: []string{stepConnection}}); err != nil {
		t.Fatal(err)
	}

	if err := folder.SetUp(connection, installation(t)); err != nil {
		t.Fatal(err)
	}

	if folder.progress().Done[2] != stepIgnore {
		t.Fatalf("the setup did not finish: %+v", folder.progress())
	}
	if _, err := os.Stat(filepath.Join(folder.Root, ".journal/hooks/claude-code/settings.json")); err != nil {
		t.Fatal(err)
	}
}

func TestACopyOfAConnectedFolderElsewhereReadsAsNotConnected(t *testing.T) {
	state := host.ConnectionState{Folder: t.TempDir()}
	folder := gitFolder(t, "")
	state.CanonicalRoot = folder.Root
	if err := state.SaveBinding(host.Binding{BindingID: "binding", RootID: "root"}); err != nil {
		t.Fatal(err)
	}
	if err := folder.SetUp(connection, installation(t)); err != nil {
		t.Fatal(err)
	}
	copied := gitFolder(t, "")
	content, _ := os.ReadFile(folder.path(connectionName))
	if err := os.MkdirAll(copied.journalFolder(), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(copied.path(connectionName), content, 0o600); err != nil {
		t.Fatal(err)
	}

	if _, err := folder.Connected(state); err != nil {
		t.Fatalf("the connected folder reads %v", err)
	}
	if _, err := copied.Connected(state); !errors.Is(err, ErrNotConnected) {
		t.Fatalf("the copy reads %v, want ErrNotConnected", err)
	}
}
