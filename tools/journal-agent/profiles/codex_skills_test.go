package profiles

import (
	"os"
	"path/filepath"
	"testing"
)

func TestEveryUserHomeSkillIsSwitchedOffByPath(t *testing.T) {
	folder := t.TempDir()
	for _, name := range []string{"graphify", "synced"} {
		if err := os.MkdirAll(filepath.Join(folder, name), 0o700); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(folder, name, "SKILL.md"), []byte("---\nname: "+name+"\n---\n"), 0o600); err != nil {
			t.Fatal(err)
		}
	}

	want := `skills.config=[{path="` + filepath.Join(folder, "graphify", "SKILL.md") + `", enabled=false}, {path="` +
		filepath.Join(folder, "synced", "SKILL.md") + `", enabled=false}]`
	if got := skillsSwitchedOff(folder); got != want {
		t.Fatalf("got %s, want %s", got, want)
	}
}

func TestAFolderWithoutSkillsSwitchesNothingOff(t *testing.T) {
	if got := skillsSwitchedOff(filepath.Join(t.TempDir(), "missing")); got != "" {
		t.Fatalf("got %q, want nothing", got)
	}
}
