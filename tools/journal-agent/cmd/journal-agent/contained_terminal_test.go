package main

import (
	"slices"
	"strings"
	"testing"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/profiles"
	"journal-agent/profiles/contracts"
)

func containedStart() host.PreparedStart {
	return host.PreparedStart{
		Grant: client.Grant{
			Token: "start-token", ProfileKey: "main-agent", ProfileRevision: 3,
			Runtime: client.RuntimeStart{Variant: "terminal", SessionID: "session-7", ProcessGeneration: 2},
		},
		Claim: client.ClaimedStart{
			StartKey: "start-key-7", Directory: "/srv/journal/accounts/a7", AccountID: "a7",
			Recipe: client.AccountRecipe{
				Environment: []client.StartSetting{
					{Name: "CLAUDE_CONFIG_DIR", Value: "/srv/journal/accounts/a7"},
					{Name: "DISABLE_AUTOUPDATER", Value: "1"},
					{Name: "SOME_HOST_FOLDER", Value: "/var/lib/journal-agent/runtimes/r7"},
				},
				EmptyFolderVariables: []string{"ANTHROPIC_CONFIG_DIR"},
				ProtectionSettings: `{"permissions":{"deny":["Read(//srv/journal/accounts/a7/.credentials.json)"]},` +
					`"sandbox":{"enabled":true,"allowUnsandboxedCommands":false}}`,
			},
		},
	}
}

// A terminal session started as haiku ran the account's default model, because the terminal
// start named no model. Every terminal start names the model the journal asked for, new and resumed alike.
func TestAContainedTerminalStartRunsOnTheModelTheJournalAskedFor(t *testing.T) {
	asked := "haiku"
	prepared := containedStart()
	prepared.Grant.Runtime.Model = &asked

	for _, driver := range []struct {
		profile contracts.DriverProfile
		option  string
	}{{profiles.ClaudeCode{}, "--model"}, {profiles.Codex{}, "-m"}} {
		base := startInContainer(prepared.Grant, "conversation-7", host.ContainerManifest{})

		for _, each := range []contracts.Start{base.Terminal(false), base.Terminal(true)} {
			process, err := containedProcessOf(driver.profile, "http://journal:8000", prepared, "runtime-7", each, 2, nil)
			if err != nil {
				t.Fatal(err)
			}

			option := slices.Index(process.Command, driver.option)
			if option < 0 || process.Command[option+1] != asked {
				t.Fatalf("%s starts without the model asked for: %v", driver.profile.Driver(), process.Command)
			}
		}
	}
}

func TestAContainedProgramIsTheProfilesCommandWithItsSettingsInlineAndNoHostPath(t *testing.T) {
	inherited := []string{"HTTPS_PROXY=http://egress:3128", "SECRET_OF_THE_HOST=x", "HOME=/root"}

	process, err := containedProcessOf(profiles.ClaudeCode{}, "http://journal:8000", containedStart(), "runtime-7",
		contracts.BaseStart{SessionID: "conversation-7"}.Terminal(false), 2, inherited)
	if err != nil {
		t.Fatal(err)
	}

	if process.Command[0] != "claude" {
		t.Fatalf("the program is %q", process.Command[0])
	}
	settings := process.Command[slices.Index(process.Command, "--settings")+1]
	if !strings.HasPrefix(settings, "{") || !strings.Contains(settings, "/opt/journal/bin/journal-hook") ||
		!strings.Contains(settings, "/home/journal/.account/.credentials.json") {
		t.Fatalf("the settings are not inline with the image's hook relay: %s", settings)
	}
	for _, want := range []string{
		"HOME=/home/journal", "CLAUDE_CONFIG_DIR=/home/journal/.account", "DISABLE_AUTOUPDATER=1",
		"ANTHROPIC_CONFIG_DIR=/home/journal/.empty/ANTHROPIC_CONFIG_DIR", "JOURNAL_START_TOKEN=start-token",
		"JOURNAL_PROCESS_GENERATION=2", "JOURNAL_START_KEY=start-key-7", "JOURNAL_PROFILE=main-agent",
		"HTTPS_PROXY=http://egress:3128",
	} {
		if !slices.Contains(process.Environment, want) {
			t.Fatalf("the environment lacks %s: %v", want, process.Environment)
		}
	}
	for _, entry := range append(append([]string{}, process.Environment...), process.Command...) {
		if strings.Contains(entry, "/var/lib/journal-agent") || strings.Contains(entry, "SECRET_OF_THE_HOST") ||
			strings.Contains(entry, "/root") || strings.Contains(entry, "/srv/journal/accounts") {
			t.Fatalf("a path or variable of the host reached the container: %s", entry)
		}
	}
}

func TestAHeadlessTurnInItsContainerRunsThePromptAtItsGenerationWithNoHostPath(t *testing.T) {
	hostStart := contracts.BaseStart{SessionID: "conversation-7", SettingsFolder: "/var/lib/journal-agent/runtimes/r7", HookCommand: "/var/lib/journal-agent/bin/journal-hook", WorkFolder: "/var/lib/journal-agent/work"}.Turn("Check your pending journal work.", false)

	process, err := containedProcessOf(profiles.ClaudeCode{}, "http://journal:8000", containedStart(), "runtime-7",
		hostStart, 5, nil)
	if err != nil {
		t.Fatal(err)
	}

	if !slices.Contains(process.Command, "--print") || process.Command[len(process.Command)-1] != hostStart.Prompt {
		t.Fatalf("the turn is not the prompt in print mode: %v", process.Command)
	}
	if !slices.Contains(process.Environment, "JOURNAL_PROCESS_GENERATION=5") {
		t.Fatalf("the turn's generation is missing: %v", process.Environment)
	}
	for _, entry := range append(append([]string{}, process.Environment...), process.Command...) {
		if strings.Contains(entry, "/var/lib/journal-agent") {
			t.Fatalf("a path of the host reached the container: %s", entry)
		}
	}
}

func TestInlineSettingsReplacesOnlyTheSettingsFoldersOwnFiles(t *testing.T) {
	arguments := []string{"--settings", "/settings/settings.json", "--model", "/settings/other.json"}
	inlined := inlineSettings(arguments, "/settings", []contracts.SettingsFile{{Name: "settings.json", Content: []byte(`{"a":1}`)}})

	if strings.Join(inlined, " ") != `--settings {"a":1} --model /settings/other.json` {
		t.Fatalf("inlined %v", inlined)
	}
}
