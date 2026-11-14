package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// PanicFile is the file the main agent writes in the journal's home when the journal itself is broken or too slow
// to answer: while it exists, the main agent's hooks go through at once without asking the server, so the main
// agent can repair the journal. Helpers and workers stay checked.
const PanicFile = "panic"

// PanicReason is what the panic file says after "why:": the file names who wrote it and why, and one with no reason is
// not honoured, so a hook is never let through for nothing.
func PanicReason(root string) string {
	text, err := os.ReadFile(filepath.Join(root, ".journal", PanicFile))
	if err != nil {
		return ""
	}
	for _, line := range strings.Split(string(text), "\n") {
		if reason, ok := strings.CutPrefix(strings.TrimSpace(line), "why:"); ok {
			return strings.TrimSpace(reason)
		}
	}
	return ""
}

// Panicking says whether this hook belongs to the main agent while the panic file exists and gives a reason.
func Panicking(root, role string) bool {
	if !IsMainRole(role) {
		return false
	}
	return PanicReason(root) != ""
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
