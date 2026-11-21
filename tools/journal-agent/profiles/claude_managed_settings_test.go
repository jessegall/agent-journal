package profiles

import (
	"encoding/json"
	"os"
	"slices"
	"strings"
	"testing"
)

// managedSettings is Claude Code's managed policy as the agent image installs it at /etc/claude-code.
type managedSettings struct {
	AllowManagedPermissionRulesOnly bool `json:"allowManagedPermissionRulesOnly"`
	AllowManagedHooksOnly           bool `json:"allowManagedHooksOnly"`
	AllowManagedMcpServersOnly      bool `json:"allowManagedMcpServersOnly"`
	AllowedMcpServers               []struct {
		ServerName string `json:"serverName"`
	} `json:"allowedMcpServers"`
	Permissions struct {
		DisableBypassPermissionsMode string   `json:"disableBypassPermissionsMode"`
		Allow                        []string `json:"allow"`
		Deny                         []string `json:"deny"`
	} `json:"permissions"`
	Hooks map[string][]struct {
		Hooks []struct {
			Command string `json:"command"`
		} `json:"hooks"`
	} `json:"hooks"`
}

func readManagedSettings(t *testing.T) managedSettings {
	t.Helper()
	content, err := os.ReadFile("../../../.docker/helper/claude-managed-settings.json")
	if err != nil {
		t.Fatal(err)
	}
	var settings managedSettings
	if err := json.Unmarshal(content, &settings); err != nil {
		t.Fatal(err)
	}

	return settings
}

// The managed policy ignores every rule and hook a launch's own settings carry, so it must hold the launch's rules
// itself: the same delegation and nested-program denies, the same allow list with file tools scoped to the workspace,
// the journal's MCP tools and its hook on every event.
func TestTheManagedPolicyCarriesEveryRuleAndHookOfTheLaunch(t *testing.T) {
	settings := readManagedSettings(t)

	if !settings.AllowManagedPermissionRulesOnly || !settings.AllowManagedHooksOnly || !settings.AllowManagedMcpServersOnly ||
		settings.Permissions.DisableBypassPermissionsMode != "disable" {
		t.Fatalf("the policy leaves a setting source open: %+v", settings)
	}
	if len(settings.AllowedMcpServers) != 1 || settings.AllowedMcpServers[0].ServerName != claudeCodeJournalServer {
		t.Fatalf("MCP servers allowed: %+v", settings.AllowedMcpServers)
	}

	for _, rule := range append(slices.Clone(claudeCodeDelegationTools), claudeCodeNestedPrograms...) {
		if !slices.Contains(settings.Permissions.Deny, rule) {
			t.Errorf("the policy does not deny %s", rule)
		}
	}
	for _, rule := range append(slices.Clone(claudeCodeAllowedWithoutAsking), claudeCodeJournalTools) {
		if !strings.HasPrefix(rule, "Bash(") && rule != claudeCodeJournalTools {
			continue
		}
		if !slices.Contains(settings.Permissions.Allow, rule) {
			t.Errorf("the policy does not allow %s", rule)
		}
	}
	for _, rule := range settings.Permissions.Allow {
		if (strings.HasPrefix(rule, "Read") || strings.HasPrefix(rule, "Edit")) &&
			!strings.HasPrefix(rule, "Read(//workspace/") && !strings.HasPrefix(rule, "Edit(//workspace/") &&
			!strings.HasPrefix(rule, "Read(//tmp/") && !strings.HasPrefix(rule, "Edit(//tmp/") {
			t.Errorf("the file rule %s reaches past the workspace and /tmp", rule)
		}
	}
	for _, rule := range []string{"Read(//home/**)", "Edit(//home/**)", "Read(//proc/**)", "Read(//dev/fd/**)", "Read(//run/**)"} {
		if !slices.Contains(settings.Permissions.Deny, rule) {
			t.Errorf("the policy does not deny %s", rule)
		}
	}

	hook := relayCommand("/opt/journal/bin/journal-hook", claudeCodeJournalName)
	for _, event := range nativeHookEvents {
		matchers := settings.Hooks[event]
		if len(matchers) != 1 || len(matchers[0].Hooks) != 1 || matchers[0].Hooks[0].Command != hook {
			t.Errorf("the %s hook is not %q: %+v", event, hook, matchers)
		}
	}
}
