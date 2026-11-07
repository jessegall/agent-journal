package main

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// PanicFile is the file the main agent writes in the journal's home when the journal itself is broken or too slow
// to answer: while it exists, the main agent's hooks go through at once without asking the server, so the main
// agent can repair the journal. Helpers and workers stay checked.
const PanicFile = "panic"

// Panicking says whether this hook belongs to the main agent while the panic file exists.
func Panicking(root, role string) bool {
	if role != "" && role != "main" {
		return false
	}
	_, err := os.Stat(filepath.Join(root, ".journal", PanicFile))
	return err == nil
}

// NotePanicBypass records the hook that went around the journal in bypass.log, so the journal can say so once it is back.
func NotePanicBypass(root, program string) {
	log, err := os.OpenFile(filepath.Join(root, ".journal", "runtime", "bypass.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer log.Close()
	fmt.Fprintf(log, "%d hook %s panic\n", time.Now().Unix(), program)
}
