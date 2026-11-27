// Package host keeps the host's private state: the folder with its enrollment and the secret it signs calls with.
package device

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"journal-runner/client"
)

const (
	stateFolderMode = 0o700
	secretFileMode  = 0o600
	enrollmentName  = "enrollment.json"
)

// DefaultStateFolder is the host's private folder unless --state names another.
func DefaultStateFolder() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return ".journal-runner"
	}
	return filepath.Join(home, ".journal-runner")
}

// MachineLabel is the name this machine goes by, or "this machine" when it has none.
func MachineLabel() string {
	machine, err := os.Hostname()
	if err != nil || machine == "" {
		return "this machine"
	}
	return machine
}

// Enrollment is what the journal's host enrollment handed this host; the client signs its calls with it.
type Enrollment = client.Enrollment

// State is the host's private folder; it refuses to be used when anyone but its owner can read it.
type State struct{ Folder string }

// ErrStateTooOpen is returned when the folder or the enrollment file is readable by others.
var ErrStateTooOpen = errors.New("the host state is readable by others")

// Save writes the enrollment into the folder, creating it with owner-only permissions.
func (state State) Save(enrollment Enrollment) error {
	if err := os.MkdirAll(state.Folder, stateFolderMode); err != nil {
		return err
	}
	if err := os.Chmod(state.Folder, stateFolderMode); err != nil {
		return err
	}
	content, err := json.Marshal(enrollment)
	if err != nil {
		return err
	}
	return os.WriteFile(state.enrollmentPath(), content, secretFileMode)
}

// Load reads the enrollment after checking that neither the folder nor the file is open to others.
func (state State) Load() (Enrollment, error) {
	if err := requireOwnerOnly(state.Folder, stateFolderMode); err != nil {
		return Enrollment{}, err
	}
	if err := requireOwnerOnly(state.enrollmentPath(), secretFileMode); err != nil {
		return Enrollment{}, err
	}
	content, err := os.ReadFile(state.enrollmentPath())
	if err != nil {
		return Enrollment{}, err
	}
	var enrollment Enrollment
	return enrollment, json.Unmarshal(content, &enrollment)
}

// HoldsEnrollment is whether the folder already holds this very enrollment, so enrolling again changes nothing; a
// folder with none, or with another journal, host or secret, does not: a host enrolled again under its own id takes
// the new secret.
func (state State) HoldsEnrollment(enrollment Enrollment) bool {
	held, err := state.Load()

	return err == nil && held == enrollment
}

func (state State) enrollmentPath() string { return filepath.Join(state.Folder, enrollmentName) }

// writePrivateJSON replaces a private file with the value encoded as JSON, in one step as writePrivateFile does.
func writePrivateJSON(path string, value any) error {
	content, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return WritePrivateFile(path, content)
}

// removePrivateFile removes a private file; one that is already gone counts as removed.
func removePrivateFile(path string) error {
	err := os.Remove(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	return err
}

// WritePrivateFile replaces a file readable by its owner alone in one step: the content goes to a new file beside it,
// is synced, and is renamed over the old one, so a crash leaves the old file or the new one, never half of either.
func WritePrivateFile(path string, content []byte) error {
	if err := os.MkdirAll(filepath.Dir(path), stateFolderMode); err != nil {
		return err
	}
	file, err := os.CreateTemp(filepath.Dir(path), "."+filepath.Base(path)+".writing-")
	if err != nil {
		return err
	}
	defer os.Remove(file.Name())
	if err := file.Chmod(secretFileMode); err != nil {
		file.Close()
		return err
	}
	if _, err := file.Write(content); err != nil {
		file.Close()
		return err
	}
	if err := file.Sync(); err != nil {
		file.Close()
		return err
	}
	if err := file.Close(); err != nil {
		return err
	}
	return os.Rename(file.Name(), path)
}

func requireOwnerOnly(path string, allowed os.FileMode) error {
	info, err := os.Stat(path)
	if err != nil {
		return err
	}
	if info.Mode().Perm()&^allowed != 0 {
		return fmt.Errorf("%w: %s has mode %o", ErrStateTooOpen, path, info.Mode().Perm())
	}
	return nil
}
