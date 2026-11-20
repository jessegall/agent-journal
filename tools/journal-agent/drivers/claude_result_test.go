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

func TestTheSignInMustBeAJournalMethodInTheAccountsOwnFolder(t *testing.T) {
	folder := t.TempDir()
	answers := map[string]error{
		`{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"/accounts/a"}`:       nil,
		`{"loggedIn":true,"authMethod":"oauth_token","configDirectory":"/accounts/a"}`:     nil,
		`{"loggedIn":true,"authMethod":"api_key_helper","configDirectory":"/accounts/a"}`:  nil,
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

		err := CheckClaudeSignIn(context.Background(), executable, nil, nil, "/accounts/a")

		if !errors.Is(err, want) && !(want == nil && err == nil) {
			t.Fatalf("answer %s: got %v, want %v", answer, err, want)
		}
	}
}

func TestTheTokenFileReachesTheCheckOnDescriptorThreeAndNotItsEnvironment(t *testing.T) {
	folder := t.TempDir()
	token := filepath.Join(folder, "provider-token")
	if err := os.WriteFile(token, []byte("valid-token"), 0o600); err != nil {
		t.Fatal(err)
	}
	executable := filepath.Join(folder, "claude")
	script := "#!/bin/sh\n[ \"$(cat <&3)\" = valid-token ] || exit 1\nenv | grep -q valid-token && exit 1\n" +
		"echo '{\"loggedIn\":true,\"authMethod\":\"oauth_token\",\"configDirectory\":\"/accounts/a\"}'\n"
	if err := os.WriteFile(executable, []byte(script), 0o700); err != nil {
		t.Fatal(err)
	}

	err := CheckClaudeSignIn(context.Background(), executable, nil, []string{token}, "/accounts/a")

	if err != nil {
		t.Fatalf("a token read on descriptor 3 was not accepted: %v", err)
	}
}
