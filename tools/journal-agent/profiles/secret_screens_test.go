package profiles

import (
	"testing"
	"time"

	screencontracts "journal-agent/screen/contracts"
)

func rowsOf(rows ...string) screencontracts.Snapshot {
	return screencontracts.Snapshot{Buffer: screencontracts.NormalBuffer, Rows: rows}
}

func TestOnlyTheApiKeyScreenAsksForASecretWithOrWithoutItsOptions(t *testing.T) {
	layout := ClaudeCode{}.Screens()
	screens := map[string]struct {
		snapshot screencontracts.Snapshot
		secret   bool
	}{
		"api key with options": {rowsOf(
			" Detected a custom API key in your environment",
			" ANTHROPIC_API_KEY: sk-ant-...",
			" Do you want to use this API key?",
			" ❯ 1. Yes",
			"   2. No (recommended)",
		), true},
		"api key prompt": {rowsOf(
			" Paste your custom API key, the one ANTHROPIC_API_KEY holds:",
			" > ",
		), true},
		"login method": {rowsOf(
			" Select login method:",
			" ❯ 1. Claude account with subscription · Pro, Max, Team or Enterprise",
			"   2. Anthropic Console account · API usage billing",
			"   3. 3rd-party platform · Amazon Bedrock or Google Vertex AI",
		), false},
		"unknown":      {rowsOf(" Choose an output style", " ❯ Default", "   Learning"), false},
		"folder trust": {screenAt(t, "claude-code/2.1.323/screens/folder-trust", layout, time.Hour), false},
	}

	for name, each := range screens {
		if asks := layout.AsksForSecret(each.snapshot); asks != each.secret {
			t.Fatalf("the %s screen asks for a secret: %v", name, asks)
		}
		if exportable := layout.IsExportable(each.snapshot); exportable == each.secret {
			t.Fatalf("the %s screen is exportable: %v", name, exportable)
		}
	}
}

func TestNoCodexScreenIsMarkedSecret(t *testing.T) {
	for _, family := range (Codex{}).Screens().Menus {
		if family.Secret {
			t.Fatalf("the Codex %s family is marked secret; none of them asks for a key or password", family.Name)
		}
	}
}
