package host

import (
	"bufio"
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"strings"
)

// StartupStanza is the exact text the installer appends to a shell startup file to put the journal command on PATH.
const StartupStanza = "\n# journal: the journal command\nexport PATH=\"$HOME/.local/bin:$PATH\"\n"

const machineChangesName = "machine-changes"

// MachineChanges are the changes the installer made outside every project, as it recorded them in the state folder:
// a startup file it added StartupStanza to, and a journal link it made.
type MachineChanges struct {
	StateFolder string
}

// Undo removes each recorded change that is still as the installer left it, then the releases and the record
// itself; it answers the changes it left because they were changed since, so the user can see to them.
func (changes MachineChanges) Undo() ([]string, error) {
	kept := []string{}
	file, err := os.Open(filepath.Join(changes.StateFolder, machineChangesName))
	if errors.Is(err, os.ErrNotExist) {
		return kept, os.RemoveAll(filepath.Join(changes.StateFolder, "releases"))
	}
	if err != nil {
		return nil, err
	}
	defer file.Close()

	lines := bufio.NewScanner(file)
	for lines.Scan() {
		kind, path, found := strings.Cut(lines.Text(), "\t")
		if !found {
			continue
		}
		undone, err := undoChange(kind, path)
		if err != nil {
			return kept, err
		}
		if !undone {
			kept = append(kept, path)
		}
	}
	if err := lines.Err(); err != nil {
		return kept, err
	}
	if err := os.RemoveAll(filepath.Join(changes.StateFolder, "releases")); err != nil {
		return kept, err
	}

	return kept, os.Remove(filepath.Join(changes.StateFolder, machineChangesName))
}

// undoChange removes one recorded change when it is unchanged, and answers whether it did.
func undoChange(kind string, path string) (bool, error) {
	if kind == "link" {
		return removeOwnLink(path)
	}
	if kind == "startup" {
		return removeStanza(path)
	}

	return false, nil
}

// removeOwnLink removes the journal link when it is still a link to a journal command, never a file put there since.
func removeOwnLink(path string) (bool, error) {
	target, err := os.Readlink(path)
	if errors.Is(err, os.ErrNotExist) {
		return true, nil
	}
	if err != nil || filepath.Base(target) != "journal" {
		return false, nil
	}

	return true, os.Remove(path)
}

// removeStanza takes StartupStanza out of the startup file when it is there exactly once, as it was written.
func removeStanza(path string) (bool, error) {
	content, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return true, nil
	}
	if err != nil {
		return false, err
	}
	if bytes.Count(content, []byte(StartupStanza)) != 1 {
		return false, nil
	}
	info, err := os.Stat(path)
	if err != nil {
		return false, err
	}

	return true, os.WriteFile(path, bytes.Replace(content, []byte(StartupStanza), nil, 1), info.Mode().Perm())
}
