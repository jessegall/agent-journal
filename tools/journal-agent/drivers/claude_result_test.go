package drivers

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestATurnSucceedsOnlyOnASuccessfulResult(t *testing.T) {
	outputs := map[string]bool{
		`{"type":"system"}` + "\n" + `{"type":"result","subtype":"success","is_error":false}`:                true,
		`{"type":"result","subtype":"success","is_error":true,"result":"Not logged in · Please run /login"}`: false,
		`{"type":"result","subtype":"error_during_execution","is_error":false}`:                              false,
		`{"type":"assistant"}`: false,
	}
	for output, succeeds := range outputs {
		err := readClaudeResult(strings.NewReader(output))

		if succeeds != (err == nil) || (!succeeds && !errors.Is(err, ErrProviderTurnFailed)) {
			t.Fatalf("output %s: got %v", output, err)
		}
	}
}

func TestTheSignInMustBeClaudeAiInTheAccountsOwnFolder(t *testing.T) {
	folder := t.TempDir()
	answers := map[string]error{
		`{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"/accounts/a"}`:       nil,
		`{"loggedIn":true,"authMethod":"api_key","configDirectory":"/accounts/a"}`:         ErrNotSignedIn,
		`{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"/Users/me/.claude"}`: ErrNotSignedIn,
		`{"loggedIn":false,"authMethod":"none","configDirectory":"/accounts/a"}`:           ErrNotSignedIn,
	}
	for answer, want := range answers {
		executable := filepath.Join(folder, "claude")
		script := "#!/bin/sh\ncat <<'JSON'\n" + answer + "\nJSON\n"
		if err := os.WriteFile(executable, []byte(script), 0o700); err != nil {
			t.Fatal(err)
		}

		err := CheckClaudeSignIn(context.Background(), executable, nil, "/accounts/a")

		if !errors.Is(err, want) && !(want == nil && err == nil) {
			t.Fatalf("answer %s: got %v, want %v", answer, err, want)
		}
	}
}
