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

// The kinds of change the installer records: a startup file it added StartupStanza to, and a journal link.
const (
	ChangeStartup = "startup"
	ChangeLink    = "link"
)

// MachineChange is one change the installer made outside every project, by its kind and path.
type MachineChange struct {
	Kind string
	Path string
}

// MachineUndo is what undoing the machine changes did: the shared releases folder it removed, the changes it removed
// and those it kept because they changed since, so the user sees to them.
type MachineUndo struct {
	Releases string
	Removed  []MachineChange
	Kept     []MachineChange
}

// Undo removes each recorded change that is still as the installer left it, then the releases and the record
// itself, and answers what it removed and what it kept.
func (changes MachineChanges) Undo() (MachineUndo, error) {
	undo := MachineUndo{
		Releases: filepath.Join(changes.StateFolder, "releases"),
		Removed:  []MachineChange{},
		Kept:     []MachineChange{},
	}
	file, err := os.Open(filepath.Join(changes.StateFolder, machineChangesName))
	if errors.Is(err, os.ErrNotExist) {
		return undo, os.RemoveAll(undo.Releases)
	}
	if err != nil {
		return undo, err
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
			return undo, err
		}
		if undone {
			undo.Removed = append(undo.Removed, MachineChange{Kind: kind, Path: path})
			continue
		}
		undo.Kept = append(undo.Kept, MachineChange{Kind: kind, Path: path})
	}
	if err := lines.Err(); err != nil {
		return undo, err
	}
	if err := os.RemoveAll(undo.Releases); err != nil {
		return undo, err
	}

	return undo, os.Remove(filepath.Join(changes.StateFolder, machineChangesName))
}

// undoChange removes one recorded change when it is unchanged, and answers whether it did.
func undoChange(kind string, path string) (bool, error) {
	if kind == ChangeLink {
		return removeOwnLink(path)
	}
	if kind == ChangeStartup {
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
