package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// PanicFileName is the file in the journal's home that, while it gives a reason, lets the main agent's hooks go through
// without the journal; the hook script reads it as PanicFile.
const PanicFileName = "panic"

// WritePanic writes the panic file for `journal panic "<why>"` itself, never reaching the server or the database, so the
// main agent can get out of a journal that refuses everything, even one whose database is locked.
func WritePanic(home string, argv []string, stdout, stderr io.Writer) int {
	reason := strings.TrimSpace(strings.Join(argv, " "))
	if reason == "" {
		fmt.Fprintln(stderr, `say why the journal must be gone around: journal panic "<what is wrong>"`)
		return UsageCode
	}
	path := filepath.Join(home, PanicFileName)
	text := fmt.Sprintf("who: journal panic\nwhen: %s\nwhy: %s\n", time.Now().UTC().Format(time.RFC3339), strings.ReplaceAll(reason, "\n", " "))
	if err := os.WriteFile(path, []byte(text), 0o644); err != nil {
		fmt.Fprintf(stderr, "the panic file could not be written: %v\n", err)
		return ErrorCode
	}
	fmt.Fprintf(stdout, "panic file written: %s\nthe main agent's hooks go through without the journal until the file is removed\n", path)
	return SuccessCode
}
