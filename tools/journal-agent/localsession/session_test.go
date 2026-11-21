package localsession

import (
	"errors"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func sessionIn(t *testing.T) Session {
	t.Helper()
	installation := t.TempDir()
	if err := os.MkdirAll(filepath.Join(installation, "bin"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(installation, "bin", "claude"), []byte("#!/bin/sh\n"), 0o755); err != nil {
		t.Fatal(err)
	}

	return Session{Root: t.TempDir(), RuntimeID: "runtime-1", SessionID: "11111111-2222-3333-4444-555555555555", Installation: installation}
}

func TestASessionRunsTheSealedProviderWithTheJournalsOwnSettings(t *testing.T) {
	session := sessionIn(t)

	command, err := session.Command(nil)
	if err != nil {
		t.Fatal(err)
	}

	if command.Path != filepath.Join(session.Installation, "bin", "claude") {
		t.Fatalf("the provider came from %s", command.Path)
	}
	if command.Dir != filepath.Join(session.Folder(), "launch") {
		t.Fatalf("the session launches in %s", command.Dir)
	}
	arguments := strings.Join(command.Args, " ")
	for _, want := range []string{"--setting-sources", "--session-id " + session.SessionID, "--settings " + filepath.Join(session.Folder(), "home", "settings.json")} {
		if !strings.Contains(arguments, want) {
			t.Fatalf("argv %q lacks %q", arguments, want)
		}
	}
	settings, err := os.ReadFile(filepath.Join(session.Folder(), "home", "settings.json"))
	if err != nil || !strings.Contains(string(settings), filepath.Join(session.Installation, "bin", "journal-hook")) {
		t.Fatalf("the settings %s run no hook adapter: %v", settings, err)
	}
	if !slices.Contains(command.Env, "CLAUDE_CONFIG_DIR="+filepath.Join(session.Folder(), "home", "claude")) {
		t.Fatalf("the environment %v has no session configuration folder", command.Env)
	}
	for _, entry := range command.Env {
		if strings.HasPrefix(entry, "ANTHROPIC_") || strings.HasPrefix(entry, "GIT_") {
			t.Fatalf("the environment kept %s", entry)
		}
	}
}

func TestTwoSessionsOfOneRootHaveTheirOwnFolders(t *testing.T) {
	first := sessionIn(t)
	second := first
	second.RuntimeID = "runtime-2"

	if _, err := first.Command(nil); err != nil {
		t.Fatal(err)
	}
	if _, err := second.Command(nil); err != nil {
		t.Fatal(err)
	}

	if first.Folder() == second.Folder() || first.RunFolder() == second.RunFolder() {
		t.Fatal("two sessions share a folder")
	}
}

func TestOverridingTheJournalsSettingsIsRefusedByName(t *testing.T) {
	_, err := sessionIn(t).Command([]string{"--settings=/tmp/mine.json"})

	if !errors.Is(err, ErrSettingsOverride) || !strings.Contains(err.Error(), "--settings") {
		t.Fatalf("an override answered %v", err)
	}
}

func TestAMissingProviderIsNamed(t *testing.T) {
	session := sessionIn(t)
	if err := os.Remove(filepath.Join(session.Installation, "bin", "claude")); err != nil {
		t.Fatal(err)
	}

	if _, err := session.Command(nil); !errors.Is(err, ErrProviderMissing) {
		t.Fatalf("a missing provider answered %v", err)
	}
}
