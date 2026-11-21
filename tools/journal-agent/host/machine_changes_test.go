package host

import (
	"os"
	"path/filepath"
	"testing"
)

func TestUndoTakesOutWhatTheInstallerAddedAndKeepsWhatChangedSince(t *testing.T) {
	state := t.TempDir()
	home := t.TempDir()
	zshrc := filepath.Join(home, ".zshrc")
	bashrc := filepath.Join(home, ".bashrc")
	link := filepath.Join(home, "journal")
	if err := os.WriteFile(zshrc, []byte("alias ll='ls -l'"+StartupStanza), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(bashrc, []byte(StartupStanza+"# edited by hand"+StartupStanza), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(filepath.Join(state, "releases", "1.0.0", "bin", "journal"), link); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(state, "releases", "1.0.0", "bin"), 0o700); err != nil {
		t.Fatal(err)
	}
	record := "startup\t" + zshrc + "\nstartup\t" + bashrc + "\nlink\t" + link + "\n"
	if err := os.WriteFile(filepath.Join(state, machineChangesName), []byte(record), 0o600); err != nil {
		t.Fatal(err)
	}

	kept, err := MachineChanges{StateFolder: state}.Undo()
	if err != nil {
		t.Fatal(err)
	}

	if content, _ := os.ReadFile(zshrc); string(content) != "alias ll='ls -l'" {
		t.Fatalf("the startup file reads %q", content)
	}
	if len(kept) != 1 || kept[0] != bashrc {
		t.Fatalf("kept %v, want only the file holding the stanza twice", kept)
	}
	if _, err := os.Lstat(link); !os.IsNotExist(err) {
		t.Fatalf("the journal link is still there: %v", err)
	}
	if _, err := os.Stat(filepath.Join(state, "releases")); !os.IsNotExist(err) {
		t.Fatalf("the releases are still there: %v", err)
	}
}
