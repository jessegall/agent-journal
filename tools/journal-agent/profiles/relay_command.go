package profiles

import (
	"path/filepath"
	"strings"
)

// The names the journal gives the programs; its hook relay is told which program calls it.
const (
	claudeCodeJournalName = "claude-code"
	codexJournalName      = "codex"
)

// relayCommand is the hook command a program's settings run: the host's relay, followed by the journal's name for
// the program, unless the relay command already ends with it.
func relayCommand(hookCommand, journalName string) string {
	if strings.HasSuffix(strings.TrimSpace(hookCommand), " "+journalName) {
		return hookCommand
	}

	return hookCommand + " " + journalName
}

// LocalProjectHookCommand is the hook command of a session of a project connected to a server journal: the sealed
// hook adapter of the installation, never the PHP relay. Only the local-project arrangement runs it.
func LocalProjectHookCommand(installation string) string {
	return filepath.Join(installation, "bin", "journal-hook")
}
