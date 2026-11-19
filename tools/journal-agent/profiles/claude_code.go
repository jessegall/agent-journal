// Package profiles holds the start profile of each supported agent program build.
package profiles

import (
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"
	"slices"
	"strings"

	"journal-agent/profiles/contracts"
)

// ClaudeCode is the start profile of Claude Code 2.1.323: isolated settings, no user, project or local settings, no
// MCP servers, an explicit tool set without any route that starts another agent, and exact session IDs.
type ClaudeCode struct{}

var _ contracts.ProgramProfile = ClaudeCode{}

// claudeCodeAllowedTools is the evidence-checked inventory of 2.1.323 (task 887). It leaves out Agent, Task,
// Workflow, SendMessage, ListAgents, RemoteTrigger, Skill, the cron and wake-up tools and the worktree tools.
var claudeCodeAllowedTools = []string{"Bash", "Read", "Edit", "Write", "NotebookEdit", "WebFetch", "WebSearch", "ToolSearch"}

// claudeCodeDelegationTools are the native routes to another agent, denied by name on top of the explicit set.
var claudeCodeDelegationTools = []string{"Agent", "Task", "Workflow", "SendMessage", "ListAgents", "RemoteTrigger", "Skill"}

// nativeHookEvents are the hook events both programs send, the ones the journal answers.
var nativeHookEvents = []string{"SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop", "SessionEnd"}

// claudeCodeAllowedWithoutAsking is the pinned noninteractive allowlist of a one-shot turn, which has nobody to
// answer a prompt: reading and editing files, the journal's own commands and read-only git. Anything else is refused.
var claudeCodeAllowedWithoutAsking = []string{"Read", "Edit", "Write", "NotebookEdit", "Bash(journal:*)", "Bash(ls:*)", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)"}

// claudeCodeNestedPrograms are agent programs a shell command could start as an unseen child; Bash may not run them.
var claudeCodeNestedPrograms = []string{"Bash(claude:*)", "Bash(codex:*)", "Bash(*claude -p*)", "Bash(*codex exec*)"}

func (ClaudeCode) Program() string {
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
		"--strict-mcp-config",
		"--agents", "{}",
		"--tools", strings.Join(claudeCodeAllowedTools, ","),
		"--disallowedTools",
	}
	arguments = append(arguments, claudeCodeDelegationTools...)

	if start.Account != nil {
		arguments = append(arguments, "--restricted", "--mcp-config", filepath.Join(start.SettingsFolder, "mcp.json"))
	}

	if start.Model != "" {
		arguments = append(arguments, "--model", start.Model)
	}

	if start.Resume {
		arguments = append(arguments, "--resume", start.SessionID)
	} else {
		arguments = append(arguments, "--session-id", start.SessionID)
	}

	if start.Mode == contracts.ProcessMode {
		arguments = append(arguments, "--print", "--output-format", "stream-json", "--verbose")
	}

	if start.Prompt != "" {
		arguments = append(arguments, start.Prompt)
	}

	return arguments, nil
}

// Environment drops every inherited Claude Code variable: one from the starting session marks the program as its
// child (no transcript, the parent's permission mode) and others could turn on agent teams or forked skills.
func (ClaudeCode) Environment(inherited []string, _ contracts.Start) []string {
	kept := make([]string, 0, len(inherited))

	for _, entry := range inherited {
		name := strings.SplitN(entry, "=", 2)[0]
		if strings.HasPrefix(name, "CLAUDE_CODE_") || name == "CLAUDECODE" {
			continue
		}
		kept = append(kept, entry)
	}

	return kept
}

func (ClaudeCode) SettingsFiles(start contracts.Start) ([]contracts.SettingsFile, error) {
	settings := map[string]any{
		"permissions": map[string]any{
			"allow": claudeCodeAllowedWithoutAsking,
			"deny":  append(slices.Clone(claudeCodeDelegationTools), claudeCodeNestedPrograms...),
		},
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
	if err := mergeProtection(settings, start.Account.Protection); err != nil {
		return nil, err
	}
	if err := requireSandbox(settings); err != nil {
		return nil, err
	}
	content, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return nil, err
	}

	return []contracts.SettingsFile{
		{Name: "settings.json", Content: content},
		{Name: "mcp.json", Content: []byte(`{"mcpServers":{}}`)},
	}, nil
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

// requireSandbox refuses an account start whose effective settings would let a tool run outside Claude Code's
// sandbox or skip its permission rules: the boundary must hold before any tool runs, not only on paper.
func requireSandbox(settings map[string]any) error {
	sandbox, _ := settings["sandbox"].(map[string]any)
	permissions, _ := settings["permissions"].(map[string]any)
	if sandbox["enabled"] != true || sandbox["allowUnsandboxedCommands"] != false ||
		permissions["disableBypassPermissionsMode"] != "disable" {
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
		for _, refused := range []string{"--dangerously-skip-permissions", "--allowedTools", "--allowed-tools", "--tools", "--agents", "--setting-sources", "--continue", "-c", "--mcp-config"} {
			if argument == refused || strings.HasPrefix(argument, refused+"=") {
				return fmt.Errorf("the argument %s would undo the claude profile", argument)
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
