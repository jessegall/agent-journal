package localsession

import (
	"os"
	"path/filepath"
	"testing"
)

func TestASignInIsKeptPerGenerationAndALogoutEndsIt(t *testing.T) {
	account := ClaudeAccount{StateFolder: t.TempDir(), BindingID: "binding-1"}
	first := t.TempDir()
	if err := os.WriteFile(filepath.Join(first, credentialName), []byte(`{"token":"one"}`), 0o600); err != nil {
		t.Fatal(err)
	}

	if err := account.Keep(first); err != nil {
		t.Fatal(err)
	}
	next := t.TempDir()
	if err := account.Provide(next); err != nil {
		t.Fatal(err)
	}
	given, err := os.ReadFile(filepath.Join(next, credentialName))
	if err != nil || string(given) != `{"token":"one"}` || !account.IsSignedIn() {
		t.Fatalf("the next session got %q, %v", given, err)
	}
	entries, _ := os.ReadDir(next)
	if len(entries) != 1 {
		t.Fatalf("the session home got %d files, want only the credential", len(entries))
	}

	if err := account.Logout(); err != nil {
		t.Fatal(err)
	}
	if account.IsSignedIn() || account.Generation() != 2 {
		t.Fatalf("after logout: signed in %v, generation %d", account.IsSignedIn(), account.Generation())
	}
}
