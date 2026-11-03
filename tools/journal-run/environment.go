package main

import (
	"os"
	"path/filepath"
)

func journalEnvironment(home string) []string {
	path := filepath.Join(home, "bin") + string(os.PathListSeparator) + os.Getenv("PATH")
	return append(os.Environ(), "JOURNAL_HOME="+home, "PATH="+path)
}
