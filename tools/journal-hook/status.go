package main

import (
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"regexp"
)

var sessionPattern = regexp.MustCompile(`^[A-Za-z0-9_.-]+$`)

// KeepStatus keeps the status JSON Claude Code's status line hands over, one file per session in the journal's
// runtime/status folder, and prints nothing.
func KeepStatus(stdin io.Reader, root string) error {
	body, err := io.ReadAll(stdin)
	if err != nil {
		return err
	}
	var status struct {
		SessionID string `json:"session_id"`
	}
	if json.Unmarshal(body, &status) != nil || !sessionPattern.MatchString(status.SessionID) {
		return nil
	}
	folder := filepath.Join(root, ".journal", "runtime", "status")
	if err := os.MkdirAll(folder, 0o755); err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(folder, status.SessionID+".json"), body, 0o644)
}
