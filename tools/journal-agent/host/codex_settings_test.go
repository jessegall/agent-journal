package host

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestARootIsPreparedWithTheAccountsHooksAndItsTrustTables(t *testing.T) {
	folder := t.TempDir()
	account := filepath.Join(folder, "account")
	if err := os.Mkdir(account, 0o700); err != nil {
		t.Fatal(err)
	}
	request := filepath.Join(folder, "request.json")
	php := filepath.Join(folder, "php")
	script := "#!/bin/sh\ncat > " + request + "\necho '{\"root\":\"/roots/thread-1\"}'\n"
	if err := os.WriteFile(php, []byte(script), 0o700); err != nil {
		t.Fatal(err)
	}

	root, err := CodexPreparation{PHP: php, Script: "prepare-codex.php"}.PrepareRoot(context.Background(),
		CodexRootRequest{
			Account: account, WorkingRoots: "/roots", Root: "thread-1",
			Hooks: []byte(`{"hooks":{}}`), HookTables: []string{"[hooks.state.\"a\"]\nenabled = true\n"},
		})
	if err != nil {
		t.Fatal(err)
	}

	if root != "/roots/thread-1" {
		t.Fatalf("root %s", root)
	}
	hooks, err := os.ReadFile(filepath.Join(account, "hooks.json"))
	if err != nil || string(hooks) != `{"hooks":{}}` {
		t.Fatalf("hooks.json %q %v", hooks, err)
	}
	var sent map[string]any
	content, _ := os.ReadFile(request)
	if err := json.Unmarshal(content, &sent); err != nil {
		t.Fatal(err)
	}
	if sent["account"] != account || sent["root"] != "thread-1" || len(sent["tables"].([]any)) != 1 {
		t.Fatalf("sent %v", sent)
	}
}

func TestAFailedPreparationNamesWhy(t *testing.T) {
	folder := t.TempDir()
	php := filepath.Join(folder, "php")
	if err := os.WriteFile(php, []byte("#!/bin/sh\necho 'root not empty' >&2\nexit 1\n"), 0o700); err != nil {
		t.Fatal(err)
	}

	_, err := CodexPreparation{PHP: php}.PrepareRoot(context.Background(), CodexRootRequest{Account: folder})

	if err == nil {
		t.Fatal("a failed preparation answered a root")
	}
}
