package device

import (
	"crypto/rand"
	"encoding/hex"
	"os"
	"path/filepath"
)

// OwnInstallation is the sealed installation this command runs from: the folder above its bin folder.
func OwnInstallation() (string, error) {
	program, err := os.Executable()
	if err != nil {
		return "", err
	}
	program, err = filepath.EvalSymlinks(program)
	if err != nil {
		return "", err
	}

	return filepath.Dir(filepath.Dir(program)), nil
}

// NewRequestKey names one invocation or start before its first send.
func NewRequestKey() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return hex.EncodeToString(random), nil
}
