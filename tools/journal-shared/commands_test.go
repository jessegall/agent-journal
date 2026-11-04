package main

import (
	"bytes"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

func runIn(t *testing.T, folder string, arguments ...string) (string, int) {
	t.Helper()
	var out, errs bytes.Buffer
	status := run(append(arguments, "--data", folder), &out, &errs)
	return out.String() + errs.String(), status
}

func tokenIn(output string) string {
	for _, line := range strings.Split(output, "\n") {
		if strings.HasPrefix(line, store.TokenPrefix) {
			return line
		}
	}
	return ""
}

func TestVersionPrintsTheReleaseAndTheProtocol(t *testing.T) {
	var out bytes.Buffer
	if run([]string{"--version"}, &out, &out) != 0 || out.String() != "journal-shared dev protocol 1\n" {
		t.Fatalf("%q", out.String())
	}
}

func TestUserAddPrintsATokenOnceAndTheDatabaseHoldsOnlyItsDigest(t *testing.T) {
	folder := t.TempDir()
	output, status := runIn(t, folder, "user", "add", "Ada", "--role", "admin")
	text := tokenIn(output)
	if status != 0 || !strings.HasPrefix(text, "jsl_") {
		t.Fatalf("status %d: %s", status, output)
	}
	database, err := store.Open(folder)
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()
	caller, err := database.Authenticate(text)
	if err != nil || caller.User.Name != "Ada" || caller.User.Role != store.RoleAdmin {
		t.Fatalf("%+v, %v", caller, err)
	}
	var found int
	if err := database.DB.QueryRow("SELECT count(*) FROM tokens WHERE token_digest = ? OR label = ?", text, text).Scan(&found); err != nil || found != 0 {
		t.Fatalf("the token text is in the tokens table: %d, %v", found, err)
	}
}

func TestTheCommandsChangeRolesMakeAndRevokeTokensAndRemoveUsers(t *testing.T) {
	folder := t.TempDir()
	runIn(t, folder, "user", "add", "Ada", "--role", "admin")
	first, _ := runIn(t, folder, "user", "add", "Grace", "--role", "read")
	output, _ := runIn(t, folder, "user", "role", "Grace", "edit")
	if !strings.Contains(output, "user Grace is now edit") {
		t.Fatal(output)
	}
	second, _ := runIn(t, folder, "token", "new", "Grace", "--label", "laptop")
	listed, _ := runIn(t, folder, "user", "tokens", "Grace")
	if !strings.Contains(listed, `"laptop"`) || !strings.Contains(listed, "never used") {
		t.Fatal(listed)
	}
	runIn(t, folder, "token", "revoke", "3")
	database, err := store.Open(folder)
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()
	if _, err := database.Authenticate(tokenIn(first)); err != nil {
		t.Errorf("the first token of Grace stopped working: %v", err)
	}
	if _, err := database.Authenticate(tokenIn(second)); err != store.ErrNotAuthenticated {
		t.Errorf("the revoked token still works: %v", err)
	}
	runIn(t, folder, "user", "remove", "Grace")
	if _, err := database.Authenticate(tokenIn(first)); err != store.ErrNotAuthenticated {
		t.Errorf("the token of a removed user still works: %v", err)
	}
}

func TestACommandWithoutADataFolderOrWithABadRoleFails(t *testing.T) {
	var out bytes.Buffer
	if run([]string{"user", "add", "Ada", "--role", "admin"}, &out, &out) != 1 || !strings.Contains(out.String(), "--data") {
		t.Errorf("%q", out.String())
	}
	if output, status := runIn(t, t.TempDir(), "user", "add", "Ada", "--role", "boss"); status != 1 || !strings.Contains(output, "admin, edit or read") {
		t.Errorf("%d %q", status, output)
	}
}
