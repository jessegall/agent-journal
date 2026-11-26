package localsession

import (
	"errors"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"journal-agent/host"
)

// KeptFiles are the files a binding's sessions keep between them, such as the program's sign-in, held in the host's
// private state per sign-in generation; which files they are, the journal's plan names. Nothing of the owner's own
// configuration is read.
type KeptFiles struct {
	StateFolder string
	BindingID   string
}

// Generation is the current sign-in generation; a logout starts the next one.
func (kept KeptFiles) Generation() int {
	content, err := os.ReadFile(kept.generationFile())
	if err != nil {
		return 1
	}
	generation, err := strconv.Atoi(strings.TrimSpace(string(content)))
	if err != nil {
		return 1
	}
	return generation
}

// HoldsAny is whether the current generation holds a kept file, as a session that signed in leaves one.
func (kept KeptFiles) HoldsAny() bool {
	entries, err := os.ReadDir(kept.generationFolder())
	return err == nil && len(entries) > 0
}

// Provide puts each kept file where a new session finds it, at the paths its plan names; a file not kept yet is
// left for the session to make.
func (kept KeptFiles) Provide(paths []string) error {
	for _, path := range paths {
		content, err := os.ReadFile(kept.storedPath(path))
		if errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err != nil {
			return err
		}
		if err := host.WritePrivateFile(path, content); err != nil {
			return err
		}
	}
	return nil
}

// Keep takes each file a session made or renewed at the paths its plan names into the current generation, apart
// from every session's own folder.
func (kept KeptFiles) Keep(paths []string) error {
	for _, path := range paths {
		content, err := os.ReadFile(path)
		if errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err != nil {
			return err
		}
		if err := host.WritePrivateFile(kept.storedPath(path), content); err != nil {
			return err
		}
	}
	return nil
}

// Logout ends the current generation: its files are removed and the next session starts signed out.
func (kept KeptFiles) Logout() error {
	if err := os.RemoveAll(kept.generationFolder()); err != nil {
		return err
	}
	return host.WritePrivateFile(kept.generationFile(), []byte(strconv.Itoa(kept.Generation()+1)+"\n"))
}

// Forget removes every generation of the binding's kept files, when its folder is disconnected.
func (kept KeptFiles) Forget() error {
	return os.RemoveAll(kept.folder())
}

func (kept KeptFiles) folder() string {
	return filepath.Join(kept.StateFolder, kept.BindingID, "kept")
}

func (kept KeptFiles) generationFile() string {
	return filepath.Join(kept.folder(), "generation")
}

func (kept KeptFiles) generationFolder() string {
	return filepath.Join(kept.folder(), strconv.Itoa(kept.Generation()))
}

// storedPath is where the generation keeps the file of a session's path, by its name.
func (kept KeptFiles) storedPath(path string) string {
	return filepath.Join(kept.generationFolder(), filepath.Base(path))
}
