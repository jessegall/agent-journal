package host

import (
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"journal-agent/client"
)

func TestAPreparedStartKeepsOnlyPlatformVariablesAndItsRecipe(t *testing.T) {
	folder := t.TempDir()
	inherited := []string{
		"LANG=en_US.UTF-8", "TERM=xterm-256color", "HOME=/Users/person", "PATH=/opt/homebrew/bin:/usr/bin",
		"ANTHROPIC_API_KEY=secret", "CLAUDE_CODE_OAUTH_TOKEN=secret", "OPENAI_BASE_URL=https://elsewhere",
		"AWS_PROFILE=personal",
	}
	recipe := client.AccountRecipe{
		Environment:          []client.StartSetting{{Name: "CLAUDE_CONFIG_DIR", Value: "/accounts/a"}},
		EmptyFolderVariables: []string{"ANTHROPIC_CONFIG_DIR"},
		RemovedVariables:     []string{"TERM"},
	}

	environment, err := CleanEnvironment(inherited, recipe, StartFolders{
		Home: filepath.Join(folder, "home"), EmptyFolders: filepath.Join(folder, "empty"), Installation: "/opt/journal",
	})
	if err != nil {
		t.Fatal(err)
	}

	want := []string{
		"LANG=en_US.UTF-8",
		"HOME=" + filepath.Join(folder, "home"),
		"PATH=/opt/journal/bin:" + systemPath,
		"ANTHROPIC_CONFIG_DIR=" + filepath.Join(folder, "empty", "ANTHROPIC_CONFIG_DIR"),
		"CLAUDE_CONFIG_DIR=/accounts/a",
	}
	if !slices.Equal(environment, want) {
		t.Fatalf("environment\n%s\nwant\n%s", strings.Join(environment, "\n"), strings.Join(want, "\n"))
	}
	for _, made := range []string{"home", filepath.Join("empty", "ANTHROPIC_CONFIG_DIR")} {
		entries, err := os.ReadDir(filepath.Join(folder, made))
		if err != nil || len(entries) != 0 {
			t.Fatalf("%s is not an empty folder: %v %v", made, entries, err)
		}
	}
}
