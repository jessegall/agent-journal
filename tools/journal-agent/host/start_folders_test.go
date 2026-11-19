package host

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"journal-agent/client"
)

func TestStartFoldersAreWrittenInsideTheSettingsFolderWithTheirArguments(t *testing.T) {
	settings := t.TempDir()
	folders := []client.StartFolder{
		{Name: "journal-skills", Arguments: []string{"--plugin-dir"}, Files: []client.StartFile{
			{Path: ".claude-plugin/plugin.json", Content: "{}"},
			{Path: "skills/journal/SKILL.md", Content: "# Journal\n"},
		}},
		{Name: "skills", Files: []client.StartFile{{Path: "journal/SKILL.md", Content: "# Journal\n"}}},
	}

	arguments, err := WriteStartFolders(settings, folders)
	if err != nil {
		t.Fatal(err)
	}

	want := []string{"--plugin-dir", filepath.Join(settings, "journal-skills")}
	if !reflect.DeepEqual(arguments, want) {
		t.Fatalf("arguments %v, want %v", arguments, want)
	}
	content, err := os.ReadFile(filepath.Join(settings, "skills", "journal", "SKILL.md"))
	if err != nil || string(content) != "# Journal\n" {
		t.Fatalf("codex skill not written: %q %v", content, err)
	}
	if _, err := os.Stat(filepath.Join(settings, "journal-skills", ".claude-plugin", "plugin.json")); err != nil {
		t.Fatalf("plugin manifest not written: %v", err)
	}
}

func TestAStartPathLeavingTheSettingsFolderIsRefusedBeforeAnyWrite(t *testing.T) {
	settings := t.TempDir()
	folders := []client.StartFolder{
		{Name: "skills", Files: []client.StartFile{{Path: "journal/SKILL.md", Content: "ok"}}},
		{Name: "skills-2", Files: []client.StartFile{{Path: "../../escape.md", Content: "no"}}},
	}

	if _, err := WriteStartFolders(settings, folders); err == nil {
		t.Fatal("a path leaving the settings folder was accepted")
	}
	if _, err := os.Stat(filepath.Join(settings, "skills")); !os.IsNotExist(err) {
		t.Fatal("a folder was written before the refusal")
	}
}

func TestASettingsFolderReachedThroughALinkIsRefused(t *testing.T) {
	state := t.TempDir()
	elsewhere := t.TempDir()
	if err := os.Symlink(elsewhere, filepath.Join(state, "runtimes")); err != nil {
		t.Fatal(err)
	}

	if err := RequireNoLinks(state, filepath.Join(state, "runtimes", "r1")); err == nil {
		t.Fatal("a settings folder behind a link was accepted")
	}
	if err := RequireNoLinks(state, filepath.Join(state, "..", "r1")); err == nil {
		t.Fatal("a settings folder outside the state was accepted")
	}
	if err := RequireNoLinks(state, filepath.Join(state, "plain", "r1")); err != nil {
		t.Fatalf("a plain settings folder was refused: %v", err)
	}
}
