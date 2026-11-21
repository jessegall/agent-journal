package profiles

import (
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"journal-agent/recording"
	"log"
	"os"
	"path/filepath"
	"strings"

	"journal-agent/profiles/contracts"
)

// Codex is the start profile of codex-cli 0.165.0: an isolated CODEX_HOME whose config turns every agent-spawning
// feature off, a workspace-write sandbox, native approvals in the terminal and none asked in a one-shot turn, and a
// resume only by the conversation ID Codex acknowledged.
type Codex struct{}

var _ contracts.ProgramProfile = Codex{}

// codexAgentFeatures are the features of 0.165.0 that start or coordinate another agent; all of them stay off.
var codexAgentFeatures = []string{"multi_agent", "multi_agent_mode", "multi_agent_v2", "multi_agent_v2_dynamic_tools", "agent_message_board", "runtime_agent_instances"}

// codexInProcessFeatures are the features of 0.165.0 that read files or run code in Codex's own process rather than
// through its environment, so a protected start, whose environment is the executor, turns them off (report 299).
var codexInProcessFeatures = []string{"view_image", "code_mode", "code_mode_only", "code_mode_host"}

// codexExecutorEnvironment is the CODEX_HOME/environments.toml of a protected start: one default environment whose
// program is the executor's shell, running the pinned Codex's own exec-server as the tools user, and no local
// environment, so every command, terminal, patch and file read of the model runs as the tools user (report 300).
const codexExecutorEnvironment = `default = "executor"
include_local = false

[[environments]]
id = "executor"
program = "/opt/journal/shell/bash"
args = ["-c", "exec codex exec-server --listen stdio"]
initialize_timeout_sec = 30
`

// codexRouteSettings are the flags and settings that would change where a tool runs or what it may do: the sandbox,
// the approval policy, the shell, the environments and the in-process tools. The profile alone sets them.
var codexRouteSettings = []string{
	"--sandbox", "-s", "sandbox_mode", "sandbox_workspace_write", "--ask-for-approval", "-a", "approval_policy",
	"--add-dir", "shell_environment_policy", "experimental_exec_server", "environments", "include_local",
	"features.view_image", "features.code_mode", "mcp_servers", "--cd", "-C",
}

// codexSandboxOf is the sandbox Codex itself applies: workspace-write, except in a protected start, where its bwrap
// cannot make namespaces inside the container and every tool already runs as the executor's user in the container,
// so Codex's own sandbox is off (task 1766's probe in the agent image).
func codexSandboxOf(start contracts.Start) string {
	if start.Protected {
		return "danger-full-access"
	}

	return "workspace-write"
}

// ProtectedAccountFiles is the environments.toml a protected start needs in its account's folder, CODEX_HOME.
func (Codex) ProtectedAccountFiles() []contracts.SettingsFile {
	return []contracts.SettingsFile{{Name: "environments.toml", Content: []byte(codexExecutorEnvironment)}}
}

// CodexAgentFeaturesOff are the config.toml lines that keep every agent-spawning feature of 0.165.0 off.
func CodexAgentFeaturesOff() []string {
	lines := make([]string, 0, len(codexAgentFeatures))
	for _, feature := range codexAgentFeatures {
		lines = append(lines, feature+" = false")
	}

	return lines
}

func (Codex) Program() string {
	return "codex"
}

func (Codex) Build() string {
	return "0.165.0"
}

// CheckBuild refuses any build but 0.165.0. That build still offers the collaboration tools (spawn_agent and the
// rest) with every agent feature off (task 888 evidence); the hook policy refuses every call to them, as version 5
// does (task 885), so no native child starts.
func (profile Codex) CheckBuild(reportedVersion string) error {
	if strings.TrimSpace(reportedVersion) == "codex-cli "+profile.Build() {
		return nil
	}

	return fmt.Errorf("codex build %q is not the proven build %s: refused before any work", strings.TrimSpace(reportedVersion), profile.Build())
}

// AllowedTools is empty for Codex: its tools are not named one by one; the agent features above are switched off.
func (Codex) AllowedTools() []string {
	return nil
}

func (Codex) Arguments(start contracts.Start) ([]string, error) {
	if start.Resume && start.SessionID == "" {
		return nil, errors.New("a codex resume needs the conversation ID codex acknowledged; the latest is never resumed")
	}

	arguments := []string{}
	if start.Mode == recording.ProcessMode {
		arguments = append(arguments, "exec")
	}
	// codex exec resume takes none of exec's options, so a one-shot resume names the thread after them.
	if start.Resume && start.Mode != recording.ProcessMode {
		arguments = append(arguments, "resume", start.SessionID)
	}

	arguments = append(arguments, "--sandbox", codexSandboxOf(start))
	if start.Model != "" {
		arguments = append(arguments, "-m", start.Model)
	}
	if start.Effort != "" {
		arguments = append(arguments, "-c", "model_reasoning_effort="+start.Effort)
	}
	if start.Mode == recording.ProcessMode {
		arguments = append(arguments, "--json", "--skip-git-repo-check")
	}
	for _, feature := range codexAgentFeatures {
		arguments = append(arguments, "-c", "features."+feature+"=false")
	}
	if start.Protected {
		for _, feature := range codexInProcessFeatures {
			arguments = append(arguments, "-c", "features."+feature+"=false")
		}
	}
	if foreignSkills := foreignSkillsSwitchedOff(start.WorkFolder); foreignSkills != "" {
		arguments = append(arguments, "-c", foreignSkills)
	}

	if start.Resume && start.Mode == recording.ProcessMode {
		arguments = append(arguments, "resume", start.SessionID)
	}

	if start.Prompt != "" {
		arguments = append(arguments, start.Prompt)
	}

	return arguments, nil
}

// foreignSkillsSwitchedOff is the setting that turns off every skill the journal did not select which codex-cli 0.165.0
// would still offer whatever CODEX_HOME is (report 171): the user's own ~/.agents/skills and the work folder's
// .agents/skills. Each is reported with its path and left unchanged; empty when there is none.
func foreignSkillsSwitchedOff(workFolder string) string {
	folders := []string{}
	if home, err := os.UserHomeDir(); err == nil {
		folders = append(folders, filepath.Join(home, ".agents", "skills"))
	}
	if workFolder != "" {
		folders = append(folders, filepath.Join(workFolder, ".agents", "skills"))
	}
	return skillsSwitchedOff(folders...)
}

// skillsSwitchedOff lists each SKILL.md under the folders as a disabled skills.config entry.
func skillsSwitchedOff(folders ...string) string {
	entries := []string{}
	for _, folder := range folders {
		files, err := filepath.Glob(filepath.Join(folder, "*", "SKILL.md"))
		if err != nil {
			continue
		}
		for _, file := range files {
			log.Printf("codex would offer %s, which the journal did not select: it is switched off for this start "+
				"and left unchanged; move it out of .agents/skills to keep it off for good", file)
			path, _ := json.Marshal(file)
			entries = append(entries, "{path="+string(path)+", enabled=false}")
		}
	}
	if len(entries) == 0 {
		return ""
	}
	return "skills.config=[" + strings.Join(entries, ", ") + "]"
}

// Environment points Codex at the isolated home and drops inherited Codex variables. The isolated home holds no
// sign-in: a start signs in only through the saved account the journal prepared for it.
func (Codex) Environment(inherited []string, start contracts.Start) []string {
	kept := make([]string, 0, len(inherited)+1)

	for _, entry := range inherited {
		if strings.HasPrefix(entry, "CODEX_") {
			continue
		}
		kept = append(kept, entry)
	}

	if start.Account != nil {
		return append(kept, "CODEX_HOME="+start.Account.Folder)
	}
	return append(kept, "CODEX_HOME="+start.SettingsFolder)
}

// SettingsFiles are the isolated home's files of a start with no account. A saved account's config.toml and hooks
// belong to the account, prepared by the host under the account's lock, and are never replaced from here.
func (Codex) SettingsFiles(start contracts.Start) ([]contracts.SettingsFile, error) {
	if start.Account != nil {
		return nil, nil
	}
	var config strings.Builder
	config.WriteString("[features]\n")
	for _, feature := range codexAgentFeatures {
		config.WriteString(feature + " = false\n")
	}

	files := []contracts.SettingsFile{}
	if start.HookCommand != "" {
		hookFile := filepath.Join(start.SettingsFolder, "hooks.json")
		hooks, trust, err := codexHooks(hookFile, relayCommand(start.HookCommand, codexJournalName))
		if err != nil {
			return nil, err
		}
		config.WriteString(trust)
		files = append(files, contracts.SettingsFile{Name: "hooks.json", Content: hooks})
	}

	return append(files, contracts.SettingsFile{Name: "config.toml", Content: []byte(config.String())}), nil
}

func (Codex) RejectContrary(extraArguments []string) error {
	for _, argument := range extraArguments {
		if strings.HasPrefix(argument, "--dangerously") || argument == "--last" || argument == "--full-auto" {
			return fmt.Errorf("the argument %s would undo the codex profile", argument)
		}
		for _, feature := range codexAgentFeatures {
			if strings.Contains(argument, feature) {
				return fmt.Errorf("the argument %s touches the agent feature %s", argument, feature)
			}
		}
		for _, setting := range codexRouteSettings {
			if argument == setting || strings.HasPrefix(argument, setting+"=") || strings.Contains(argument, setting+"=") ||
				strings.HasPrefix(argument, setting+".") {
				return fmt.Errorf("the argument %s changes %s, which keeps every tool on the executor's route", argument, setting)
			}
		}
	}

	return nil
}

// codexHookEvent is one hook event of Codex: its name in hooks.json, its key in a trust entry, and its timeout.
type codexHookEvent struct {
	name    string
	key     string
	timeout int
}

var codexHookEvents = []codexHookEvent{
	{"SessionStart", "session_start", 600},
	{"UserPromptSubmit", "user_prompt_submit", 600},
	{"PreToolUse", "pre_tool_use", 600},
	{"PostToolUse", "post_tool_use", 600},
	{"Stop", "stop", 600},
	{"SessionEnd", "session_end", 1},
}

// CodexAccountHooks are a saved account's hooks.json, which relays every native event to the journal, and the
// config.toml tables that trust each of those hooks, one table a hook.
func CodexAccountHooks(accountFolder, hookCommand string) ([]byte, []string, error) {
	hooks, trust, err := codexHooks(filepath.Join(accountFolder, "hooks.json"), relayCommand(hookCommand, codexJournalName))
	if err != nil {
		return nil, nil, err
	}
	var tables []string
	for _, table := range strings.Split(trust, "\n[") {
		if table = strings.TrimSpace(table); table != "" {
			tables = append(tables, "["+strings.TrimPrefix(table, "[")+"\n")
		}
	}
	return hooks, tables, nil
}

// codexHooks gives the hooks.json that runs the command on every event, and the [hooks.state] tables that mark each
// hook trusted, hashed the way Codex hashes a command hook's identity, so the hooks run without a trust prompt.
func codexHooks(hookFile, command string) ([]byte, string, error) {
	events := map[string]any{}
	var trust strings.Builder

	for _, event := range codexHookEvents {
		events[event.name] = []map[string]any{{"hooks": []map[string]any{{"type": "command", "command": command}}}}

		identity := map[string]any{
			"event_name": event.key,
			"hooks":      []map[string]any{{"type": "command", "command": command, "timeout": event.timeout, "async": false}},
		}
		body, err := json.Marshal(identity)
		if err != nil {
			return nil, "", err
		}
		digest := sha256.Sum256(body)
		fmt.Fprintf(&trust, "\n[hooks.state.%q]\nenabled = true\ntrusted_hash = \"sha256:%x\"\n", hookFile+":"+event.key+":0:0", digest)
	}

	hooks, err := json.MarshalIndent(map[string]any{"hooks": events}, "", "  ")

	return hooks, trust.String(), err
}
