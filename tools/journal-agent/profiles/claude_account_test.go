package profiles

import (
	"encoding/json"
	"errors"
	"journal-agent/recording"
	"slices"
	"strings"
	"testing"

	"journal-agent/profiles/contracts"
)

var journalServer = contracts.JournalServer{Command: "/protected/bin/php", Relay: "/protected/journal/bin/journal-mcp"}

const accountProtection = `{"permissions":{"deny":["Read(//accounts/a/.credentials.json)","Bash(security:*)"],` +
	`"disableBypassPermissionsMode":"disable"},"sandbox":{"enabled":true,"allowUnsandboxedCommands":false}}`

func TestAnAccountStartMergesTheAccountProtectionIntoTheStartSettings(t *testing.T) {
	start := contracts.Start{
		Mode: recording.ProcessMode, SettingsFolder: "/state/runtimes/r1", SessionID: "session",
		Account: &contracts.AccountStart{
			Folder: "/accounts/a", Protection: accountProtection, JournalServer: &journalServer, LaunchReference: "r1",
		},
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
	if len(files) != 2 || files[1].Name != "mcp.json" {
		t.Fatalf("files %+v", files)
	}
	if !slices.Contains(arguments, "--restricted") || !slices.Contains(arguments, "/state/runtimes/r1/mcp.json") {
		t.Fatalf("arguments %v", arguments)
	}
}

func TestAnAccountSettingThatWouldReplaceTheStartsOwnIsRefused(t *testing.T) {
	start := contracts.Start{
		Mode: recording.ProcessMode, SettingsFolder: "/state", SessionID: "session", Effort: "high",
		Account: &contracts.AccountStart{Folder: "/accounts/a", Protection: `{"effortLevel":"low"}`, JournalServer: &journalServer},
	}

	if _, err := (ClaudeCode{}).SettingsFiles(start); err == nil {
		t.Fatal("an account setting replaced the start's own effort")
	}
}

func TestAnAccountStartWhoseProtectionLeavesTheSandboxOffIsRefused(t *testing.T) {
	start := contracts.Start{
		Mode: recording.ProcessMode, SettingsFolder: "/state", SessionID: "session",
		Account: &contracts.AccountStart{Folder: "/accounts/a", Protection: `{"sandbox":{"enabled":false}}`, JournalServer: &journalServer},
	}

	if _, err := (ClaudeCode{}).SettingsFiles(start); err == nil {
		t.Fatal("an account start without the sandbox was prepared")
	}
}

// A protected start runs every command as the executor's user through the shell bridge, so Claude Code's own sandbox,
// which cannot start in the agent container, is off; its permission rules still may not be skipped.
func TestAProtectedAccountStartLeavesCommandsToTheExecutorAndKeepsItsPermissionRules(t *testing.T) {
	start := contracts.Start{
		Mode: recording.ProcessMode, SettingsFolder: "/state", SessionID: "session", Protected: true,
		Account: &contracts.AccountStart{Folder: "/accounts/a", Protection: accountProtection, JournalServer: &journalServer},
	}

	files, err := (ClaudeCode{}).SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	var settings struct {
		Sandbox map[string]any `json:"sandbox"`
	}
	if err := json.Unmarshal(files[0].Content, &settings); err != nil {
		t.Fatal(err)
	}
	if settings.Sandbox["enabled"] != false {
		t.Fatalf("a protected start kept Claude Code's sandbox on: %v", settings.Sandbox)
	}

	start.Account.Protection = `{"sandbox":{"enabled":true,"allowUnsandboxedCommands":false}}`
	if _, err := (ClaudeCode{}).SettingsFiles(start); err == nil {
		t.Fatal("a protected start whose permission rules can be skipped was prepared")
	}
}

func accountStartWith(server *contracts.JournalServer, hookCommand string) contracts.Start {
	return contracts.Start{
		Mode: recording.ProcessMode, SettingsFolder: "/state/runtimes/r1", SessionID: "session", HookCommand: hookCommand,
		Account: &contracts.AccountStart{
			Folder: "/accounts/a", Protection: accountProtection, JournalServer: server, LaunchReference: "r1",
		},
	}
}

func TestAnAccountLaunchLoadsOnlyTheJournalServerByAbsolutePathWithNoToken(t *testing.T) {
	start := accountStartWith(&journalServer, "/protected/journal/bin/journal-hook claude")

	files, err := ClaudeCode{}.SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	arguments, err := ClaudeCode{}.Arguments(start)
	if err != nil {
		t.Fatal(err)
	}

	var descriptor struct {
		McpServers map[string]struct {
			Type    string   `json:"type"`
			Command string   `json:"command"`
			Args    []string `json:"args"`
			Timeout int      `json:"timeout"`
			Env     any      `json:"env"`
		} `json:"mcpServers"`
	}
	if err := json.Unmarshal(files[1].Content, &descriptor); err != nil {
		t.Fatal(err)
	}
	server, found := descriptor.McpServers["journal"]
	if len(descriptor.McpServers) != 1 || !found || server.Type != "stdio" || server.Command != journalServer.Command ||
		!slices.Equal(server.Args, []string{journalServer.Relay}) || server.Timeout != 30000 || server.Env != nil {
		t.Fatalf("descriptor %s", files[1].Content)
	}
	var settings struct {
		Permissions struct {
			Allow []string `json:"allow"`
		} `json:"permissions"`
	}
	if err := json.Unmarshal(files[0].Content, &settings); err != nil {
		t.Fatal(err)
	}
	mcpRules := slices.DeleteFunc(slices.Clone(settings.Permissions.Allow), func(rule string) bool {
		return !strings.HasPrefix(rule, "mcp__")
	})
	if !slices.Equal(mcpRules, []string{"mcp__journal__*"}) {
		t.Fatalf("mcp allow rules %v", mcpRules)
	}
	for _, file := range files {
		if strings.Contains(string(file.Content), "TOKEN") {
			t.Fatalf("%s names a token: %s", file.Name, file.Content)
		}
	}
	for _, wanted := range []string{"--restricted", "--strict-mcp-config", "--mcp-config", "--settings", "--tools"} {
		if !slices.Contains(arguments, wanted) {
			t.Fatalf("arguments %v lack %s", arguments, wanted)
		}
	}
	tools := arguments[slices.Index(arguments, "--tools")+1]
	if !strings.Contains(tools, "ToolSearch") || slices.Contains(arguments, "--bare") {
		t.Fatalf("arguments %v", arguments)
	}
}

func TestAnAccountLaunchGetsTheMcpTimeoutsAndItsReference(t *testing.T) {
	environment := ClaudeCode{}.Environment(
		[]string{"PATH=/usr/bin", "MCP_TIMEOUT=1", "JOURNAL_LAUNCH_REF=other"},
		accountStartWith(&journalServer, ""),
	)

	if !slices.Equal(environment, []string{"PATH=/usr/bin", "MCP_TIMEOUT=15000", "MCP_TOOL_TIMEOUT=30000",
		"JOURNAL_LAUNCH_REF=r1"}) {
		t.Fatalf("environment %v", environment)
	}
}

func TestCliLaunchKeepsClaudeProtectionWithoutJournalMcp(t *testing.T) {
	earlier := accountStartWith(&journalServer, "")
	cli := accountStartWith(nil, "")
	cli.Account.Transport = contracts.CliTransport
	profile := ClaudeCode{}

	files, err := profile.SettingsFiles(cli)
	if err != nil {
		t.Fatal(err)
	}
	if len(files) != 1 || strings.Contains(string(files[0].Content), claudeCodeJournalTools) ||
		!strings.Contains(string(files[0].Content), "Bash(security:*)") {
		t.Fatalf("CLI settings %v", files)
	}
	arguments, err := profile.Arguments(cli)
	if err != nil {
		t.Fatal(err)
	}
	if slices.Contains(arguments, "--strict-mcp-config") || slices.Contains(arguments, "--mcp-config") ||
		!slices.Contains(arguments, "--restricted") {
		t.Fatalf("CLI arguments %v", arguments)
	}

	for _, start := range []contracts.Start{earlier, accountStartWith(&journalServer, "")} {
		files, err := profile.SettingsFiles(start)
		if err != nil || len(files) != 2 || files[1].Name != "mcp.json" {
			t.Fatalf("MCP settings %v, %v", files, err)
		}
	}
}

// Where no console is installed the relay is the command itself: the server starts it with no script after it.
func TestAStandaloneRelayIsTheServersCommandWithNoScript(t *testing.T) {
	start := accountStartWith(&contracts.JournalServer{Command: "/opt/journal/bin/journal-mcp", Standalone: true}, "")

	files, err := (ClaudeCode{}).SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	for _, file := range files {
		if file.Name == "mcp.json" {
			compact := strings.Join(strings.Fields(string(file.Content)), "")
			if !strings.Contains(compact, `"command":"/opt/journal/bin/journal-mcp"`) || !strings.Contains(compact, `"args":[]`) {
				t.Fatalf("the server is started as %s", file.Content)
			}

			return
		}
	}
	t.Fatal("the start has no MCP configuration")
}

func TestAnAccountLaunchWithAnUnresolvedPathIsRefused(t *testing.T) {
	for name, start := range map[string]contracts.Start{
		"no server":        accountStartWith(nil, ""),
		"empty relay":      accountStartWith(&contracts.JournalServer{Command: "/protected/bin/php"}, ""),
		"relative command": accountStartWith(&contracts.JournalServer{Command: "php", Relay: journalServer.Relay}, ""),
		"placeholder":      accountStartWith(&contracts.JournalServer{Command: "${PHP}", Relay: journalServer.Relay}, ""),
		"bare hook":        accountStartWith(&journalServer, "journal-hook claude"),
	} {
		if _, err := (ClaudeCode{}).SettingsFiles(start); !errors.Is(err, errUnresolvedLaunchSetting) {
			t.Fatalf("%s: %v, want errUnresolvedLaunchSetting", name, err)
		}
	}
}

func TestBareAndPermissionModeArgumentsAreRefused(t *testing.T) {
	for _, argument := range []string{"--bare", "--permission-mode=bypassPermissions"} {
		if err := (ClaudeCode{}).RejectContrary([]string{argument}); err == nil {
			t.Fatalf("%s was accepted", argument)
		}
	}
}

func statusLineOf(t *testing.T, mode recording.Mode, protection, reader string) map[string]any {
	t.Helper()
	start := contracts.Start{
		Mode: mode, SettingsFolder: "/state/runtimes/r1", SessionID: "session",
		Account: &contracts.AccountStart{Folder: "/accounts/a", Protection: protection, JournalServer: &journalServer,
			LaunchReference: "r1", StatusLine: reader},
	}
	files, err := ClaudeCode{}.SettingsFiles(start)
	if err != nil {
		t.Fatal(err)
	}
	var settings struct {
		StatusLine map[string]any `json:"statusLine"`
	}
	if err := json.Unmarshal(files[0].Content, &settings); err != nil {
		t.Fatal(err)
	}
	return settings.StatusLine
}

func TestATerminalStartWithAStatusLineReaderNamesItAndKeepsAStatusLineItHadByRunningIt(t *testing.T) {
	reader := "'/opt/journal-agent' 'status-line' '--relay' '/state/runtimes/r1/status-line.sock'"
	withOwn := strings.TrimSuffix(accountProtection, "}") + `,"statusLine":{"type":"command","command":"echo it's mine","padding":1}}`

	if line := statusLineOf(t, recording.TerminalMode, accountProtection, reader); line["command"] != reader {
		t.Fatalf("the terminal start's status line is %v", line)
	}
	composed := statusLineOf(t, recording.TerminalMode, withOwn, reader)
	if composed["command"] != reader+` --then 'echo it'\''s mine'` || composed["padding"] != 1.0 {
		t.Fatalf("the status line the settings had became %v", composed)
	}
	if line := statusLineOf(t, recording.ProcessMode, accountProtection, reader); line != nil {
		t.Fatalf("a process start got a status line %v", line)
	}
	if line := statusLineOf(t, recording.TerminalMode, accountProtection, ""); line != nil {
		t.Fatalf("a start without a reader got a status line %v", line)
	}
}
