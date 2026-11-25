// Package localsession prepares and starts a provider session of a project connected to a server journal on the
// owner's own machine: its own start folder, home and run folder under .journal/sessions/<runtime>, settings the
// journal owns with the sealed hook adapter, argv only from the pinned start profile, the provider from the sealed
// installation and a clean environment.
package localsession

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"

	"journal-agent/profiles"
	"journal-agent/profiles/contracts"
)

// ErrSettingsOverride refuses an argument that would replace the journal's settings, hooks, tools or session.
var ErrSettingsOverride = errors.New("a connected session runs only the journal's own settings")

// ErrProviderMissing is returned when the sealed installation holds no provider program.
var ErrProviderMissing = errors.New("the provider program is not in the installation")

// overridingArguments are the provider arguments a user may not add to a connected session.
var overridingArguments = []string{
	"--settings", "--setting-sources", "--agents", "--tools", "--allowedTools", "--disallowedTools", "--mcp-config",
	"--strict-mcp-config", "--session-id", "--resume", "--continue", "--dangerously-skip-permissions",
	"--permission-mode", "--add-dir",
}

// platformVariables are the variables of the user's terminal a session keeps: none of its provider, plugin, Git
// override or shell startup settings.
var platformVariables = []string{"LANG", "LC_ALL", "LC_CTYPE", "TERM", "COLORTERM", "TZ", "USER", "LOGNAME", "SHELL"}

// Session is one runtime's session of a connected folder.
type Session struct {
	Root         string
	RuntimeID    string
	SessionID    string
	Resume       bool
	Installation string
}

// Folder is the session's own folder under the root's .journal/sessions.
func (session Session) Folder() string {
	return filepath.Join(session.Root, ".journal", "sessions", session.RuntimeID)
}

// ConfigFolder is the session's own Claude Code configuration folder, CLAUDE_CONFIG_DIR.
func (session Session) ConfigFolder() string {
	return filepath.Join(session.Folder(), "home", "claude")
}

// RunFolder is where the session socket and the session's preparation record live.
func (session Session) RunFolder() string { return filepath.Join(session.Folder(), "run") }

// Command prepares the session's folders and settings and answers the Claude Code process to start, refusing any
// extra argument that would override what the journal owns.
func (session Session) Command(extra []string) (*exec.Cmd, error) {
	for _, argument := range extra {
		name, _, _ := strings.Cut(argument, "=")
		if slices.Contains(overridingArguments, name) {
			return nil, fmt.Errorf("%w: %s", ErrSettingsOverride, name)
		}
	}

	program := filepath.Join(session.Installation, "bin", "claude")
	if _, err := os.Stat(program); err != nil {
		return nil, fmt.Errorf("%w: %s", ErrProviderMissing, program)
	}

	startFolder := filepath.Join(session.Folder(), "start")
	home := filepath.Join(session.Folder(), "home")
	for _, folder := range []string{startFolder, filepath.Join(home, "claude"), session.RunFolder()} {
		if err := os.MkdirAll(folder, 0o700); err != nil {
			return nil, err
		}
	}

	profile := profiles.ClaudeCode{}
	start := contracts.BaseStart{
		SettingsFolder: home,
		SessionID:      session.SessionID,
		HookCommand:    profiles.LocalProjectHookCommand(session.Installation),
		WorkFolder:     session.Root,
	}.Terminal(session.Resume)
	if err := writeSettings(profile, start); err != nil {
		return nil, err
	}
	arguments, err := profile.Arguments(start)
	if err != nil {
		return nil, err
	}

	command := exec.Command(program, append(arguments, extra...)...)
	command.Dir = startFolder
	command.Env = session.environment(home)

	return command, nil
}

// environment is the clean environment of the session: the terminal's platform variables, an explicit PATH of the
// installation and the system, the session's own HOME and Claude Code configuration folder, and the run folder the
// hook adapter finds its socket in.
func (session Session) environment(home string) []string {
	environment := []string{}
	for _, entry := range os.Environ() {
		name, _, _ := strings.Cut(entry, "=")
		if slices.Contains(platformVariables, name) {
			environment = append(environment, entry)
		}
	}

	return append(environment,
		"HOME="+home,
		"CLAUDE_CONFIG_DIR="+filepath.Join(home, "claude"),
		"PATH="+filepath.Join(session.Installation, "journal/tools/accounts/no-keychain")+":"+
			filepath.Join(session.Installation, "bin")+":/usr/bin:/bin:/usr/sbin:/sbin",
		"JOURNAL_SESSION_RUN="+session.RunFolder(),
	)
}

// writeSettings writes the profile's settings files into the session home, readable by the user alone.
func writeSettings(profile contracts.DriverProfile, start contracts.Start) error {
	files, err := profile.SettingsFiles(start)
	if err != nil {
		return err
	}
	for _, file := range files {
		if err := os.WriteFile(filepath.Join(start.SettingsFolder, file.Name), file.Content, 0o600); err != nil {
			return err
		}
	}

	return nil
}
