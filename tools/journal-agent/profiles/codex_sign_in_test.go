package profiles

import (
	"journal-agent/recording"
	"strings"
	"testing"

	"journal-agent/profiles/contracts"
)

func TestTheCodexSettingsNameNoSignIn(t *testing.T) {
	for _, mode := range []recording.Mode{recording.ProcessMode, recording.TerminalMode} {
		files, err := Codex{}.SettingsFiles(contracts.Start{Mode: mode, SettingsFolder: t.TempDir()})
		if err != nil {
			t.Fatal(err)
		}

		for _, file := range files {
			if file.Name == "auth.json" || strings.Contains(string(file.Content), ".codex/auth.json") {
				t.Fatalf("the %s settings name a sign-in in %s", mode, file.Name)
			}
		}
	}
}
