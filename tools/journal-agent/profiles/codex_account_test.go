package profiles

import (
	"journal-agent/recording"
	"slices"
	"strings"
	"testing"

	"journal-agent/profiles/contracts"
)

func TestACodexAccountStartUsesTheAccountHomeAndWritesNoSettings(t *testing.T) {
	start := contracts.Start{
		Mode: recording.ProcessMode, SettingsFolder: "/state/runtimes/r1",
		Account: &contracts.AccountStart{Folder: "/accounts/codex-a"},
	}

	files, err := Codex{}.SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	environment := Codex{}.Environment([]string{"CODEX_HOME=/Users/user/.codex", "LANG=C"}, start)

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

func TestAProtectedCodexStartRunsEveryToolThroughTheExecutorAndNothingInProcess(t *testing.T) {
	protected := contracts.Start{Mode: recording.ProcessMode, Protected: true, Account: &contracts.AccountStart{Folder: "/account"}}
	plain := contracts.Start{Mode: recording.ProcessMode, Account: &contracts.AccountStart{Folder: "/account"}}

	protectedArguments, err := Codex{}.Arguments(protected)
	if err != nil {
		t.Fatal(err)
	}
	plainArguments, err := Codex{}.Arguments(plain)
	if err != nil {
		t.Fatal(err)
	}
	files := Codex{}.ProtectedAccountFiles()

	for _, feature := range []string{"view_image", "code_mode", "code_mode_only", "code_mode_host"} {
		if !slices.Contains(protectedArguments, "features."+feature+"=false") {
			t.Fatalf("a protected start keeps %s on: %v", feature, protectedArguments)
		}
		if slices.Contains(plainArguments, "features."+feature+"=false") {
			t.Fatalf("a start that is not protected turned %s off", feature)
		}
	}
	if !slices.Contains(protectedArguments, "danger-full-access") || !slices.Contains(plainArguments, "workspace-write") {
		t.Fatalf("sandboxes: protected %v, plain %v", protectedArguments, plainArguments)
	}
	if len(files) != 1 || files[0].Name != "environments.toml" {
		t.Fatalf("protected account files %v", files)
	}
	environments := string(files[0].Content)
	for _, want := range []string{`default = "executor"`, "include_local = false", `program = "/opt/journal/shell/bash"`,
		`args = ["-c", "exec codex exec-server --listen stdio"]`} {
		if !strings.Contains(environments, want) {
			t.Fatalf("environments.toml lacks %q:\n%s", want, environments)
		}
	}
}

func TestCodexRefusesEveryArgumentThatWouldMoveAToolOffTheExecutorRoute(t *testing.T) {
	for _, argument := range []string{"--sandbox", "-s", "--ask-for-approval", "-a", "approval_policy=on-request",
		"sandbox_mode=read-only", "include_local=true", "features.code_mode=true", "features.view_image=true",
		"mcp_servers.local.command=sh", "--add-dir", "environments=local"} {
		if err := (Codex{}).RejectContrary([]string{"-c", argument}); err == nil {
			t.Fatalf("the argument %s was let through", argument)
		}
	}
	if err := (Codex{}).RejectContrary([]string{"-m", "gpt-6.1-sol"}); err != nil {
		t.Fatalf("a model choice was refused: %v", err)
	}
}
