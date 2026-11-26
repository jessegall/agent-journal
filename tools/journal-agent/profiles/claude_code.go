// Package profiles holds the start profile of each supported agent driver build.
package profiles

import (
	"encoding/json"
	"errors"
	"fmt"
	"journal-agent/recording"
	"journal-agent/shellwords"
	"maps"
	"path/filepath"
	"slices"
	"strings"

	"journal-agent/profiles/contracts"
)

// ClaudeCode is the start profile of Claude Code 2.1.323: isolated settings, no user, project or local settings, no
// MCP servers, an explicit tool set without any route that starts another agent, and exact session IDs.
type ClaudeCode struct{}

var _ contracts.DriverProfile = ClaudeCode{}

// claudeCodeAllowedTools is the evidence-checked inventory of 2.1.323. It leaves out Agent, Task,
// Workflow, SendMessage, ListAgents, RemoteTrigger, Skill, the cron and wake-up tools and the worktree tools.
var claudeCodeAllowedTools = []string{"Bash", "Read", "Edit", "Write", "NotebookEdit", "WebFetch", "WebSearch", "ToolSearch"}

// claudeCodeDelegationTools are the native routes to another agent, denied by name on top of the explicit set.
var claudeCodeDelegationTools = []string{"Agent", "Task", "Workflow", "SendMessage", "ListAgents", "RemoteTrigger", "Skill"}

// nativeHookEvents are the hook events both programs send, the ones the journal answers.
var nativeHookEvents = []string{"SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop", "SessionEnd"}

// claudeCodeNeverAsks is the permission mode every session runs in: Claude Code asks no user before a tool call.
// claudeCodeInContainer tells Claude Code it runs in a container, where it accepts that mode as the root user.
const (
	claudeCodeNeverAsks   = "bypassPermissions"
	claudeCodeInContainer = "IS_SANDBOX=1"
)

// claudeCodeAllowedWithoutAsking is the pinned noninteractive allowlist of a one-shot turn, which has nobody to
// answer a prompt: reading and editing files, the journal's own commands and read-only git. Anything else is refused.
var claudeCodeAllowedWithoutAsking = []string{"Read", "Edit", "Write", "NotebookEdit", "Bash(journal:*)", "Bash(ls:*)", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)"}

// claudeCodeNormalBuffer keeps Claude Code off its full-screen view: Screens reads the composer on the normal buffer,
// as every recording under resources/recordings/claude-code was made, and a prompt on the other buffer never reads as
// ready.
const claudeCodeNormalBuffer = "CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1"

// claudeCodeJournalServer is the name of the journal's MCP server in a start's server list.
const claudeCodeJournalServer = "journal"

// claudeCodeJournalTools is the one MCP allow rule of a start: the journal's own server, never a wildcard for others.
const claudeCodeJournalTools = "mcp__journal__*"

// The client's MCP timeouts in milliseconds: to start the server, and for one tool call.
const (
	claudeCodeMcpStartTimeout = "15000"
	// claudeCodeProtectedShell is the shell bridge of a protected start: Claude Code takes a shell only by the name bash
	// and starts it as a login shell, so the bridge takes the shell's place and hands every command, unparsed, to the
	// executor's user (docs/accounts/claude-integration.md, section Shell handoff).
	claudeCodeProtectedShell = "/opt/journal/shell/bash"
	claudeCodeMcpToolTimeout = "30000"
	claudeCodeJournalTimeout = 30000
)

// errUnresolvedStartSetting refuses a start whose generated settings would hold an empty, relative or placeholder
// path: the program would resolve it from a folder the model controls.
var errUnresolvedStartSetting = errors.New("the start has an unresolved setting")

// claudeCodeNestedDrivers are agent drivers a shell command could start as an unseen child; Bash may not run them.
var claudeCodeNestedDrivers = []string{"Bash(claude:*)", "Bash(codex:*)", "Bash(*claude -p*)", "Bash(*codex exec*)"}

func (ClaudeCode) Driver() string {
	return "claude"
}

func (ClaudeCode) Build() string {
	return "2.1.323"
}

func (profile ClaudeCode) CheckBuild(reportedVersion string) error {
	if strings.HasPrefix(strings.TrimSpace(reportedVersion), profile.Build()+" ") {
		return nil
	}

	return fmt.Errorf("claude build %q is not the proven build %s: refused before any work", strings.TrimSpace(reportedVersion), profile.Build())
}

func (ClaudeCode) AllowedTools() []string {
	return slices.Clone(claudeCodeAllowedTools)
}

func (profile ClaudeCode) Arguments(start contracts.Start) ([]string, error) {
	if start.SessionID == "" {
		return nil, errors.New("a claude start needs an exact session ID")
	}

	arguments := []string{
		"--settings", filepath.Join(start.SettingsFolder, "settings.json"),
		"--setting-sources", "",
		"--agents", "{}",
		"--tools", strings.Join(claudeCodeAllowedTools, ","),
		"--disallowedTools",
	}
	arguments = append(arguments, claudeCodeDelegationTools...)

	if start.Account == nil || start.Account.Transport != contracts.CliTransport {
		arguments = append(arguments, "--strict-mcp-config")
	}
	if startsJournalServer(start) {
		arguments = append(arguments, "--mcp-config", filepath.Join(start.SettingsFolder, "mcp.json"))
	}

	if start.Model != "" {
		arguments = append(arguments, "--model", start.Model)
	}

	if start.Resume {
		arguments = append(arguments, "--resume", start.SessionID)
	} else {
		arguments = append(arguments, "--session-id", start.SessionID)
	}

	if start.Mode == recording.ProcessMode {
		arguments = append(arguments, "--print", "--output-format", "stream-json", "--verbose")
	}

	if start.Prompt != "" {
		arguments = append(arguments, start.Prompt)
	}

	return arguments, nil
}

// Environment drops every inherited Claude Code and MCP variable: one from the starting session marks the program as
// its child (no transcript, the parent's permission mode) and others could turn on agent teams or forked skills. A
// start with the journal's server gets the client's MCP timeouts, and a start its reference. Every start draws on
// the normal buffer, the one the screen layout was measured on.
func (ClaudeCode) Environment(inherited []string, start contracts.Start) []string {
	kept := make([]string, 0, len(inherited)+3)

	for _, entry := range inherited {
		name := strings.SplitN(entry, "=", 2)[0]
		if strings.HasPrefix(name, "CLAUDE_CODE_") || name == "CLAUDECODE" || strings.HasPrefix(name, "MCP_") ||
			name == "JOURNAL_START_REF" {
			continue
		}
		kept = append(kept, entry)
	}
	kept = append(kept, claudeCodeNormalBuffer)
	if startsJournalServer(start) {
		kept = append(kept, "MCP_TIMEOUT="+claudeCodeMcpStartTimeout, "MCP_TOOL_TIMEOUT="+claudeCodeMcpToolTimeout)
	}
	if start.Account != nil {
		kept = append(kept, "JOURNAL_START_REF="+start.Account.StartReference)
	}
	if start.Protected {
		kept = append(kept, "CLAUDE_CODE_SHELL="+claudeCodeProtectedShell, claudeCodeInContainer)
	}

	return kept
}

func (ClaudeCode) SettingsFiles(start contracts.Start) ([]contracts.SettingsFile, error) {
	settings := map[string]any{
		"permissions": map[string]any{
			"allow":       claudeCodeAllowedWithoutAsking,
			"deny":        append(slices.Clone(claudeCodeDelegationTools), claudeCodeNestedDrivers...),
			"defaultMode": claudeCodeNeverAsks,
		},
		// The mode's own warning is answered here once, so no session opens on it.
		"skipDangerousModePermissionPrompt": true,
	}

	if start.Effort != "" {
		settings["effortLevel"] = start.Effort
	}

	if start.HookCommand != "" {
		hooks := map[string]any{}
		for _, event := range nativeHookEvents {
			hooks[event] = []map[string]any{{"hooks": []map[string]any{{"type": "command", "command": relayCommand(start.HookCommand, claudeCodeJournalName)}}}}
		}
		settings["hooks"] = hooks
	}

	if start.Account == nil {
		content, err := json.MarshalIndent(settings, "", "  ")
		return []contracts.SettingsFile{{Name: "settings.json", Content: content}}, err
	}
	if start.HookCommand != "" {
		if err := requireAbsoluteCommand(start.HookCommand); err != nil {
			return nil, err
		}
	}
	permissions, _ := settings["permissions"].(map[string]any)
	if startsJournalServer(start) {
		permissions["allow"] = append(slices.Clone(claudeCodeAllowedWithoutAsking), claudeCodeJournalTools)
	}
	if err := mergeProtection(settings, start.Account.Protection); err != nil {
		return nil, err
	}
	addStatusLine(settings, start)
	if start.Protected {
		leaveCommandsToExecutor(settings)
	}
	if err := requireBoundary(settings, start.Protected); err != nil {
		return nil, err
	}
	content, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return nil, err
	}
	files := []contracts.SettingsFile{{Name: "settings.json", Content: content}}

	if !startsJournalServer(start) {
		return files, nil
	}
	descriptor, err := journalDescriptor(start)
	if err != nil {
		return nil, err
	}

	return append(files, contracts.SettingsFile{Name: "mcp.json", Content: descriptor}), nil
}

// addStatusLine names the journal's status-line reader in a terminal start's settings when the host gave one. A status
// line the settings already hold is run by the reader with the same input, so it still renders; one the reader cannot
// run, such as one that is no command, is kept as it is and the reader is left out.
func addStatusLine(settings map[string]any, start contracts.Start) {
	reader := start.Account.StatusLine
	if reader == "" || start.Mode == recording.ProcessMode {
		return
	}
	existing, present := settings["statusLine"]
	if !present {
		settings["statusLine"] = map[string]any{"type": "command", "command": reader}
		return
	}
	line, isObject := existing.(map[string]any)
	if !isObject || line["type"] != "command" {
		return
	}
	command, isText := line["command"].(string)
	if !isText {
		return
	}
	composed := maps.Clone(line)
	composed["command"] = reader + " --then " + shellwords.Quoted(command)
	settings["statusLine"] = composed
}

func startsJournalServer(start contracts.Start) bool {
	return start.Account != nil && start.Account.Transport != contracts.CliTransport
}

// journalDescriptor is the start's MCP configuration: the journal's server alone, started by absolute path, with
// no token, environment or placeholder in it.
func journalDescriptor(start contracts.Start) ([]byte, error) {
	server := start.Account.JournalServer
	if server == nil {
		return nil, fmt.Errorf("%w: no journal MCP server", errUnresolvedStartSetting)
	}
	for _, path := range append([]string{server.Command}, server.Arguments()...) {
		if !isResolvedPath(path) {
			return nil, fmt.Errorf("%w: the journal MCP path %q", errUnresolvedStartSetting, path)
		}
	}
	return json.MarshalIndent(map[string]any{"mcpServers": map[string]any{claudeCodeJournalServer: map[string]any{
		"type":    "stdio",
		"command": server.Command,
		"args":    server.Arguments(),
		"timeout": claudeCodeJournalTimeout,
	}}}, "", "  ")
}

// requireAbsoluteCommand refuses a hook command whose program is not named by an absolute, resolved path.
func requireAbsoluteCommand(command string) error {
	fields := strings.Fields(command)
	if len(fields) == 0 || !isResolvedPath(fields[0]) {
		return fmt.Errorf("%w: the hook command %q", errUnresolvedStartSetting, command)
	}
	return nil
}

// isResolvedPath answers whether a path is absolute, clean and free of any variable or placeholder.
func isResolvedPath(path string) bool {
	return filepath.IsAbs(path) && filepath.Clean(path) == path && !strings.ContainsAny(path, "$%{}<>")
}

// mergeProtection adds the account's checked protection settings to the start's own: permission lists are joined,
// and any other setting is added when the start has none, never replaced. A setting both name differently refuses
// the start, since one side would lose.
func mergeProtection(settings map[string]any, protection string) error {
	var account map[string]any
	if err := json.Unmarshal([]byte(protection), &account); err != nil {
		return fmt.Errorf("the account's protection settings are not JSON: %w", err)
	}
	permissions, _ := settings["permissions"].(map[string]any)
	accountPermissions, _ := account["permissions"].(map[string]any)
	delete(account, "permissions")
	for name, value := range accountPermissions {
		list, isList := value.([]any)
		if !isList {
			if err := addSetting(permissions, "permissions."+name, name, value); err != nil {
				return err
			}
			continue
		}
		permissions[name] = joinRules(permissions[name], list)
	}
	for name, value := range account {
		if err := addSetting(settings, name, name, value); err != nil {
			return err
		}
	}
	return nil
}

// leaveCommandsToExecutor turns Claude Code's own sandbox off for a protected start: bubblewrap cannot make its
// namespaces in the agent container, and every command already runs as the executor's user through the shell bridge,
// which with the container is the boundary there.
func leaveCommandsToExecutor(settings map[string]any) {
	settings["sandbox"] = map[string]any{"enabled": false}
}

// requireBoundary refuses an account start whose effective settings would make Claude Code ask a user, or, outside
// a protected start, run a tool outside Claude Code's sandbox: every session runs without permission questions, and what a tool may do is decided by the journal's hook, the deny rules and the
// sandbox or the container.
func requireBoundary(settings map[string]any, protected bool) error {
	sandbox, _ := settings["sandbox"].(map[string]any)
	permissions, _ := settings["permissions"].(map[string]any)
	if permissions["defaultMode"] != claudeCodeNeverAsks || permissions["disableBypassPermissionsMode"] == "disable" {
		return errors.New("the account start's settings would make Claude Code ask a user: it is not started")
	}
	if !protected && (sandbox["enabled"] != true || sandbox["allowUnsandboxedCommands"] != false) {
		return errors.New("the account start's settings do not keep every tool in the sandbox: it is not started")
	}
	return nil
}

func addSetting(settings map[string]any, path, name string, value any) error {
	existing, present := settings[name]
	if present && fmt.Sprint(existing) != fmt.Sprint(value) {
		return fmt.Errorf("the account's protection setting %s would replace the start's own", path)
	}
	settings[name] = value
	return nil
}

// joinRules is the start's rules followed by each account rule it does not have yet.
func joinRules(own any, account []any) []string {
	var joined []string
	if rules, isList := own.([]string); isList {
		joined = slices.Clone(rules)
	}
	for _, rule := range account {
		text := fmt.Sprint(rule)
		if !slices.Contains(joined, text) {
			joined = append(joined, text)
		}
	}
	return joined
}

func (ClaudeCode) RejectContrary(extraArguments []string) error {
	for _, argument := range extraArguments {
		for _, refused := range []string{"--allowedTools", "--allowed-tools", "--tools", "--agents", "--setting-sources", "--continue", "-c", "--mcp-config", "--bare", "--permission-mode"} {
			if argument == refused || strings.HasPrefix(argument, refused+"=") {
				return fmt.Errorf("the argument %s would undo the claude profile", argument)
			}
		}
		for _, name := range []string{"CLAUDE_CODE_SHELL", "shellPrefix", "CLAUDE_CONFIG_DIR"} {
			if strings.Contains(argument, name) {
				return fmt.Errorf("the argument %s names %s, which a protected start fixes", argument, name)
			}
		}
		for _, tool := range claudeCodeDelegationTools {
			if strings.Contains(argument, tool) {
				return fmt.Errorf("the argument %s names the delegation tool %s", argument, tool)
			}
		}
	}

	return nil
}

// OffersTerminal: Claude Code has terminal the host attaches the user to.
func (ClaudeCode) OffersTerminal() bool {
	return true
}

// KeepsToolsFromSignIn: Claude Code's sandbox keeps its tools from its sign-in.
func (ClaudeCode) KeepsToolsFromSignIn() bool {
	return true
}

// ReportsLimitWindows: Claude Code gives its limit windows through its status line.
func (ClaudeCode) ReportsLimitWindows() bool {
	return true
}
