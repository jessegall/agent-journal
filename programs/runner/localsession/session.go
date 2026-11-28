// Package localsession prepares and starts a session of a project connected to a server journal on the owner's own
// machine: its own folder under .journal/sessions/<runtime>, the argv, files, folders and environment of the plan the
// journal sent with the runtime, its program from the sealed installation, and a clean environment.
package localsession

import (
	"errors"
	"fmt"
	"maps"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"

	"journal-runner/device"
	"journal-runner/hostapi"
)

// ErrSettingsOverride refuses an argument that would replace the journal's settings, hooks, tools or session.
var ErrSettingsOverride = errors.New("a connected session runs only the journal's own settings")

// ErrProgramNotSealed refuses a plan whose program is not one the installation sealed.
var ErrProgramNotSealed = errors.New("the plan's program is not one the installation sealed")

// ErrPlanEmpty refuses a plan the journal sent with no program to run.
var ErrPlanEmpty = errors.New("the journal sent no program to run")

// overridingArguments are the program arguments a user may not add to a connected session.
var overridingArguments = []string{
	"--settings", "--setting-sources", "--agents", "--tools", "--allowedTools", "--disallowedTools", "--mcp-config",
	"--strict-mcp-config", "--session-id", "--resume", "--continue", "--dangerously-skip-permissions",
	"--permission-mode", "--add-dir",
}

// platformVariables are the variables of the user's terminal a session keeps: none of its program, plugin, Git
// override or shell startup settings.
var platformVariables = []string{"LANG", "LC_ALL", "LC_CTYPE", "TERM", "COLORTERM", "TZ", "USER", "LOGNAME", "SHELL"}

// Session is one runtime's session of a connected folder.
type Session struct {
	Root         string
	RuntimeID    string
	SessionID    string
	Installation string
	JournalURL   string
	// Programs are the programs the installation sealed, by the names plans call them.
	Programs map[string]string
	// Plan is what the journal decided the session runs: its argv, files, folders and environment.
	Plan hostapi.OpenPlan
}

// Prepared is a session ready to start: its process, and the files its binding keeps once it ends.
type Prepared struct {
	Command   *exec.Cmd
	KeptFiles []string
}

// Folder is the session's own folder under the root's .journal/sessions.
func (session Session) Folder() string {
	return filepath.Join(session.Root, ".journal", "sessions", session.RuntimeID)
}

// RunFolder is where the session socket and the session's preparation record live.
func (session Session) RunFolder() string { return filepath.Join(session.Folder(), "run") }

// Prepare makes the session's folders and the journal's plan, and answers the sealed program's process to start,
// refusing any extra argument that would override what the journal owns.
func (session Session) Prepare(extra []string) (Prepared, error) {
	for _, argument := range extra {
		name, _, _ := strings.Cut(argument, "=")
		if slices.Contains(overridingArguments, name) {
			return Prepared{}, fmt.Errorf("%w: %s", ErrSettingsOverride, name)
		}
	}

	startFolder := filepath.Join(session.Folder(), "start")
	for _, folder := range []string{startFolder, session.RunFolder()} {
		if err := os.MkdirAll(folder, 0o700); err != nil {
			return Prepared{}, err
		}
	}

	names := device.InstalledPlanNames(session.JournalURL, session.Installation, session.Programs)
	plan, err := hostapi.PrepareOpenPlan(filepath.Join(session.Folder(), "plan"), session.Plan, names)
	if err != nil {
		return Prepared{}, err
	}
	if len(plan.Argv) == 0 {
		return Prepared{}, ErrPlanEmpty
	}
	if !slices.Contains(slices.Collect(maps.Values(session.Programs)), plan.Argv[0]) {
		return Prepared{}, fmt.Errorf("%w: %s", ErrProgramNotSealed, plan.Argv[0])
	}

	command := exec.Command(plan.Argv[0], append(plan.Argv[1:], extra...)...)
	command.Dir = startFolder
	command.Env = append(platformEnvironment(), append(plan.Environment, "JOURNAL_SESSION_RUN="+session.RunFolder())...)

	return Prepared{Command: command, KeptFiles: plan.KeptFiles}, nil
}

// platformEnvironment is the terminal's platform variables, the one part of the user's environment a session keeps.
func platformEnvironment() []string {
	environment := []string{}
	for _, entry := range os.Environ() {
		name, _, _ := strings.Cut(entry, "=")
		if slices.Contains(platformVariables, name) {
			environment = append(environment, entry)
		}
	}

	return environment
}
