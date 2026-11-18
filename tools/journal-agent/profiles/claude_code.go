// Package profiles holds the launch profile of each supported agent program build.
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

// ClaudeCode is the launch profile of Claude Code 2.1.323: isolated settings, no user, project or local settings, no
// MCP servers, an explicit tool set without any route that starts another agent, and exact session IDs.
type ClaudeCode struct{}

var _ contracts.ProgramProfile = ClaudeCode{}

// claudeCodeAllowedTools is the evidence-checked inventory of 2.1.323 (task 887). It leaves out Agent, Task,
// Workflow, SendMessage, ListAgents, RemoteTrigger, Skill, the cron and wake-up tools and the worktree tools.
var claudeCodeAllowedTools = []string{"Bash", "Read", "Edit", "Write", "NotebookEdit", "WebFetch", "WebSearch", "ToolSearch"}

// claudeCodeDelegationTools are the native routes to another agent, denied by name on top of the explicit set.
var claudeCodeDelegationTools = []string{"Agent", "Task", "Workflow", "SendMessage", "ListAgents", "RemoteTrigger", "Skill"}

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

func (profile ClaudeCode) Arguments(launch contracts.Launch) ([]string, error) {
	if launch.SessionID == "" {
		return nil, errors.New("a claude launch needs an exact session ID")
	}

	arguments := []string{
		"--settings", filepath.Join(launch.SettingsFolder, "settings.json"),
		"--setting-sources", "",
		"--strict-mcp-config",
		"--agents", "{}",
		"--tools", strings.Join(claudeCodeAllowedTools, ","),
		"--disallowedTools",
	}
	arguments = append(arguments, claudeCodeDelegationTools...)

	if launch.Resume {
		arguments = append(arguments, "--resume", launch.SessionID)
	} else {
		arguments = append(arguments, "--session-id", launch.SessionID)
	}

	if launch.Mode == contracts.ProcessMode {
		arguments = append(arguments, "--print", "--output-format", "stream-json", "--verbose")
	}

	if launch.Prompt != "" {
		arguments = append(arguments, launch.Prompt)
	}

	return arguments, nil
}

// Environment drops every inherited variable that could turn on agent teams, forked skills or a nested session.
func (ClaudeCode) Environment(inherited []string) []string {
	kept := make([]string, 0, len(inherited))

	for _, entry := range inherited {
		name := strings.SplitN(entry, "=", 2)[0]
		if strings.Contains(name, "AGENT_TEAM") || name == "CLAUDECODE" || name == "CLAUDE_CODE_ENTRYPOINT" {
			continue
		}
		kept = append(kept, entry)
	}

	return kept
}

func (ClaudeCode) SettingsFile() ([]byte, error) {
	return json.MarshalIndent(map[string]any{
		"permissions": map[string]any{
			"allow": claudeCodeAllowedWithoutAsking,
			"deny":  append(slices.Clone(claudeCodeDelegationTools), claudeCodeNestedPrograms...),
		},
	}, "", "  ")
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
