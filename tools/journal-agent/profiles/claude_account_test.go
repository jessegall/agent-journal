package profiles

import (
	"encoding/json"
	"slices"
	"testing"

	"journal-agent/profiles/contracts"
)

const accountProtection = `{"permissions":{"deny":["Read(//accounts/a/.credentials.json)","Bash(security:*)"],` +
	`"disableBypassPermissionsMode":"disable"},"sandbox":{"enabled":true,"allowUnsandboxedCommands":false}}`

func TestAnAccountStartMergesTheAccountProtectionIntoTheStartSettings(t *testing.T) {
	start := contracts.Start{
		Mode: contracts.ProcessMode, SettingsFolder: "/state/runtimes/r1", SessionID: "session",
		Account: &contracts.AccountStart{Folder: "/accounts/a", Protection: accountProtection},
	}

	files, err := ClaudeCode{}.SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	arguments, err := ClaudeCode{}.Arguments(start)
	if err != nil {
		t.Fatal(err)
	}

	var settings struct {
		Permissions struct {
			Allow                        []string `json:"allow"`
			Deny                         []string `json:"deny"`
			DisableBypassPermissionsMode string   `json:"disableBypassPermissionsMode"`
		} `json:"permissions"`
		Sandbox map[string]bool `json:"sandbox"`
	}
	if err := json.Unmarshal(files[0].Content, &settings); err != nil {
		t.Fatal(err)
	}
	if !slices.Contains(settings.Permissions.Deny, "Bash(security:*)") ||
		!slices.Contains(settings.Permissions.Deny, claudeCodeDelegationTools[0]) {
		t.Fatalf("the deny rules lost a side: %v", settings.Permissions.Deny)
	}
	if len(settings.Permissions.Allow) == 0 || settings.Permissions.DisableBypassPermissionsMode != "disable" ||
		!settings.Sandbox["enabled"] {
		t.Fatalf("settings %+v", settings)
	}
	if len(files) != 2 || files[1].Name != "mcp.json" || string(files[1].Content) != `{"mcpServers":{}}` {
		t.Fatalf("files %+v", files)
	}
	if !slices.Contains(arguments, "--restricted") || !slices.Contains(arguments, "/state/runtimes/r1/mcp.json") {
		t.Fatalf("arguments %v", arguments)
	}
}

func TestAnAccountSettingThatWouldReplaceTheStartsOwnIsRefused(t *testing.T) {
	start := contracts.Start{
		Mode: contracts.ProcessMode, SettingsFolder: "/state", SessionID: "session", Effort: "high",
		Account: &contracts.AccountStart{Folder: "/accounts/a", Protection: `{"effortLevel":"low"}`},
	}

	if _, err := (ClaudeCode{}).SettingsFiles(start); err == nil {
		t.Fatal("an account setting replaced the start's own effort")
	}
}
