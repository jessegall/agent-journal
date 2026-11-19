package profiles

import (
	"slices"
	"strings"
	"testing"

	"journal-agent/profiles/contracts"
)

func TestACodexAccountStartUsesTheAccountHomeAndWritesNoSettings(t *testing.T) {
	start := contracts.Start{
		Mode: contracts.ProcessMode, SettingsFolder: "/state/runtimes/r1",
		Account: &contracts.AccountStart{Folder: "/accounts/codex-a"},
	}

	files, err := Codex{}.SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	environment := Codex{}.Environment([]string{"CODEX_HOME=/Users/person/.codex", "LANG=C"}, start)

	if len(files) != 0 {
		t.Fatalf("an account start wrote %d settings files", len(files))
	}
	if !slices.Equal(environment, []string{"LANG=C", "CODEX_HOME=/accounts/codex-a"}) {
		t.Fatalf("environment %v", environment)
	}
}

func TestTheAccountHooksComeWithOneTrustTableEach(t *testing.T) {
	hooks, tables, err := CodexAccountHooks("/accounts/codex-a", "/bin/journal-hook codex")
	if err != nil {
		t.Fatal(err)
	}

	if len(tables) != len(codexHookEvents) || !strings.Contains(string(hooks), "/bin/journal-hook codex") {
		t.Fatalf("%d tables for %d events", len(tables), len(codexHookEvents))
	}
	for _, table := range tables {
		if !strings.HasPrefix(table, `[hooks.state."/accounts/codex-a/hooks.json:`) ||
			!strings.Contains(table, "trusted_hash") {
			t.Fatalf("table %q", table)
		}
	}
}
