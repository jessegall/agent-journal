// Package host keeps the host's private state: the folder with its enrollment and the secret it signs calls with.
package host

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"journal-agent/client"
)

const (
	stateFolderMode = 0o700
	secretFileMode  = 0o600
	enrollmentName  = "enrollment.json"
)

// Enrollment is what agents:host-enroll handed this host; the client signs its calls with it.
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

func (state State) enrollmentPath() string { return filepath.Join(state.Folder, enrollmentName) }

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
