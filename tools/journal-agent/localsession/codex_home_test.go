package localsession

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestACodexGenerationIsPreparedPrivatelyWithOneHookCommand(t *testing.T) {
	codex := CodexHome{StateFolder: t.TempDir(), BindingID: "binding-1", Account: "account-1", Generation: 1}

	root, err := codex.Prepare("/installation/bin/journal-hook", "runtime-1")
	if err != nil {
		t.Fatal(err)
	}

	hooks, _ := os.ReadFile(filepath.Join(codex.Folder(), "hooks.json"))
	config, _ := os.ReadFile(filepath.Join(codex.Folder(), "config.toml"))
	if !strings.Contains(string(hooks), "/installation/bin/journal-hook codex") || !strings.Contains(string(config), "multi_agent = false") {
		t.Fatalf("hooks %s, config %s", hooks, config)
	}
	if root == codex.RootOf("runtime-2") || !strings.HasPrefix(root, codex.StateFolder) {
		t.Fatalf("the prepared root %s is not the runtime's own", root)
	}
	if _, err := codex.Prepare("/another/journal-hook", "runtime-2"); !errors.Is(err, ErrHookCommandChanged) {
		t.Fatalf("a second hook command answered %v", err)
	}
}

func TestTheLocalCodexTargetIsWithheldByName(t *testing.T) {
	if !strings.Contains(ErrCodexWithheld.Error(), "per-thread capability") {
		t.Fatalf("the withholding names no reason: %v", ErrCodexWithheld)
	}
}
