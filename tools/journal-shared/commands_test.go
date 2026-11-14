package main

import (
	"bytes"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

func runIn(t *testing.T, folder string, arguments ...string) (string, int) {
	t.Helper()
	var output, errs bytes.Buffer
	status := run(append(arguments, "--data", folder), &output, &errs)
	return output.String() + errs.String(), status
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
	var output bytes.Buffer
	if run([]string{"--version"}, &output, &output) != 0 || output.String() != "journal-shared dev protocol 1\n" {
		t.Fatalf("%q", output.String())
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
	var matchingTokens int
	if err := database.DB.QueryRow("SELECT count(*) FROM tokens WHERE token_digest = ? OR label = ?", text, text).Scan(&matchingTokens); err != nil || matchingTokens != 0 {
		t.Fatalf("the token text is in the tokens table: %d, %v", matchingTokens, err)
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
	var output bytes.Buffer
	if run([]string{"user", "add", "Ada", "--role", "admin"}, &output, &output) != 1 || !strings.Contains(output.String(), "--data") {
		t.Errorf("%q", output.String())
	}
	if output, status := runIn(t, t.TempDir(), "user", "add", "Ada", "--role", "boss"); status != 1 || !strings.Contains(output, "admin, edit or read") {
		t.Errorf("%d %q", status, output)
	}
}

func TestItemHistoryListsTheVersionsAndPurgeDeletesThemForGood(t *testing.T) {
	folder := t.TempDir()
	runIn(t, folder, "user", "add", "Ada", "--role", "admin")
	database, err := store.Open(folder)
	if err != nil {
		t.Fatal(err)
	}
	ada, _ := database.UserByName("Ada")
	kind, _ := store.KindByName("doc")
	item, _ := database.CreateItem(kind, store.Fields{"title": "T", "abstract": "A", "body": "secret text"}, store.Caller{User: ada})
	database.UpdateItem(kind, item.ID, 1, store.Fields{"body": "more secret text"}, store.Caller{User: ada})
	database.Close()
	history, status := runIn(t, folder, "item", "history", "doc", "1")
	if status != 0 || !strings.Contains(history, "version 2  update  by Ada") || !strings.Contains(history, "version 1  create") || strings.Contains(history, "secret") {
		t.Fatalf("%d %s", status, history)
	}
	purged, status := runIn(t, folder, "item", "purge", "doc", "1")
	if status != 0 || !strings.Contains(purged, "doc 1 purged with its 2 versions") {
		t.Fatalf("%d %s", status, purged)
	}
	after, _ := runIn(t, folder, "item", "history", "doc", "1")
	if strings.Contains(after, "create") || !strings.Contains(after, "purge") {
		t.Errorf("%s", after)
	}
	if output, status := runIn(t, folder, "item", "purge", "doc", "1"); status != 1 || !strings.Contains(output, "not found") {
		t.Errorf("%d %s", status, output)
	}
	if output, status := runIn(t, folder, "item", "history", "note", "1"); status != 1 || !strings.Contains(output, "no kind") {
		t.Errorf("%d %s", status, output)
	}
}
