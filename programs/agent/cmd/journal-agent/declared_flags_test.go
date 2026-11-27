package main

import (
	"strings"
	"testing"
)

// The host's commands take exactly the flags protocol/host.json declares: each refuses an unknown flag as the flag
// package does, never for a declaration that differs.
func TestTheHostCommandsTakeExactlyTheirDeclaredFlags(t *testing.T) {
	for name, command := range map[string]func([]string) error{"enroll": enroll, "serve": serve} {
		err := command([]string{"-undeclared-flag"})
		if err == nil || !strings.Contains(err.Error(), "flag provided but not defined") {
			t.Errorf("%s with an unknown flag answered %v", name, err)
		}
	}
}
