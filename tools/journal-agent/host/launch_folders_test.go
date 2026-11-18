package host

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"journal-agent/client"
)

func TestLaunchFoldersAreWrittenInsideTheSettingsFolderWithTheirArguments(t *testing.T) {
	settings := t.TempDir()
	folders := []client.LaunchFolder{
		{Name: "journal-skills", Arguments: []string{"--plugin-dir"}, Files: []client.LaunchFile{
			{Path: ".claude-plugin/plugin.json", Content: "{}"},
			{Path: "skills/journal/SKILL.md", Content: "# Journal\n"},
		}},
		{Name: "skills", Files: []client.LaunchFile{{Path: "journal/SKILL.md", Content: "# Journal\n"}}},
	}

	arguments, err := WriteLaunchFolders(settings, folders)
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

func TestALaunchPathLeavingTheSettingsFolderIsRefusedBeforeAnyWrite(t *testing.T) {
	settings := t.TempDir()
	folders := []client.LaunchFolder{
		{Name: "skills", Files: []client.LaunchFile{{Path: "journal/SKILL.md", Content: "ok"}}},
		{Name: "skills-2", Files: []client.LaunchFile{{Path: "../../escape.md", Content: "no"}}},
	}

	if _, err := WriteLaunchFolders(settings, folders); err == nil {
		t.Fatal("a path leaving the settings folder was accepted")
	}
	if _, err := os.Stat(filepath.Join(settings, "skills")); !os.IsNotExist(err) {
		t.Fatal("a folder was written before the refusal")
	}
}
