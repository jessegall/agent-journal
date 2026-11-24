// Package contracts holds the interfaces of start profiles.
package contracts

import (
	"journal-agent/recording"
	"journal-agent/screen"
)

// BaseStart is what every start of one runtime's program has, however the program runs: where its settings and its
// work live, the exact conversation, the account, and the model and effort the journal asked for. A terminal and a
// headless turn each take their start from it and add only what is theirs, so a value such as the model is never in
// one and missing in the other.
type BaseStart struct {
	SettingsFolder string
	// SessionID is the exact conversation the start begins or resumes; "the latest" is never resumed.
	SessionID string
	// HookCommand, when set, is the command each native hook runs, such as the evidence harness's capture hook.
	HookCommand string
	Model       string
	Effort      string
	// WorkFolder is the folder the program works in, when the host knows it; a profile reads which of its own
	// discovery roots that folder holds.
	WorkFolder string
	// Account is the saved account the start signs in with, as its prepared claim gives it; nil for a start with
	// no account, such as a recording.
	Account *AccountStart
	// Protected is whether the start runs under the protected-account launch profile: the program alone reads the
	// sign-in, and every command the model runs goes to the executor's user.
	Protected bool
}

// Terminal is the base's interactive start; resume restarts the conversation the base names.
func (base BaseStart) Terminal(resume bool) Start {
	return base.In(recording.TerminalMode, "", resume)
}

// Turn is one headless turn of the base's conversation with its prompt; resume goes on from an earlier turn.
func (base BaseStart) Turn(prompt string, resume bool) Start {
	return base.In(recording.ProcessMode, prompt, resume)
}

// In is the base's start in the mode given, for a caller that takes the mode from outside, such as a recording.
func (base BaseStart) In(mode recording.Mode, prompt string, resume bool) Start {
	return Start{BaseStart: base, Mode: mode, Prompt: prompt, Resume: resume}
}

// Start is one start of a program: its base and what the way it runs adds, the mode, the prompt of a headless turn
// and whether it resumes its conversation. It is made from a BaseStart, never written out field by field.
type Start struct {
	BaseStart
	Mode   recording.Mode
	Resume bool
	Prompt string
}

// JournalServer is how a start runs the journal's MCP server, by absolute path, with no token or placeholder: the
// protected PHP binary running the protected installation's bin/journal-mcp, or, where no console is installed, as
// in a session container, the standalone relay as the command itself.
type JournalServer struct {
	Command string
	Relay   string
	// Standalone says the command is the relay itself and runs with no script; without it a missing relay script is
	// refused, since the PHP binary alone would run whatever it is handed.
	Standalone bool
}

// Arguments are what follows the command: the relay script the PHP binary runs, or nothing for a standalone relay.
func (server JournalServer) Arguments() []string {
	if server.Standalone {
		return []string{}
	}

	return []string{server.Relay}
}

type TransportProfile string

const (
	McpTransport TransportProfile = "mcp"
	CliTransport TransportProfile = "cli"
)

// AccountStart is what a start on a saved account adds to the profile's own settings: the account's folder on the
// host and the native protection settings its adapter checked, as JSON, merged into the start's settings.
type AccountStart struct {
	Folder     string
	Protection string
	Transport  TransportProfile
	// JournalServer is the journal's own MCP server the start loads; an account start is refused without it.
	JournalServer *JournalServer
	// LaunchReference names the launch to the journal's relays; it is no secret.
	LaunchReference string
	// StatusLine is the command of the journal's status-line reader for a terminal start whose status line reports
	// limit windows; empty for a start that reads none there.
	StatusLine string
}

// SettingsFile is one generated file of the isolated settings folder: its name and content. A sign-in is never one:
// a start signs in only through the saved account the journal prepared for it.
type SettingsFile struct {
	Name    string
	Content []byte
}

// ProtectedAccountFiles is a profile whose protected start needs files in the account's folder that no argument can
// carry, such as Codex's environments.toml; the host writes them for the program's user before the container starts.
type ProtectedAccountFiles interface {
	ProtectedAccountFiles() []SettingsFile
}

// DriverProfile is how the host starts one pinned build of one agent driver with its native subagents off
//. Both programs implement it; nothing above it checks which program it has.
type DriverProfile interface {
	// Driver names the agent driver, such as claude or codex.
	Driver() string

	// Build is the one build this profile is proven against.
	Build() string

	// CheckBuild refuses any build but the pinned one, from what the program printed for its version.
	CheckBuild(reportedVersion string) error

	// Arguments are the command-line arguments of a start, refusing a start it cannot make safe.
	Arguments(start Start) ([]string, error)

	// Environment is the inherited environment with every variable that could turn native delegation on removed,
	// pointed at the start's isolated settings folder where the program reads its settings from the environment.
	Environment(inherited []string, start Start) []string

	// SettingsFiles are the files the program reads from its isolated settings folder, with the start's hook
	// command installed on every native hook event when it names one.
	SettingsFiles(start Start) ([]SettingsFile, error)

	// AllowedTools is the explicit native tool inventory; anything else is unavailable.
	AllowedTools() []string

	// RejectContrary refuses extra arguments that would undo the profile, such as re-enabling a delegation tool.
	RejectContrary(extraArguments []string) error

	// OffersTerminal says whether the program has an interactive terminal the user can attach to.
	OffersTerminal() bool

	// KeepsToolsFromSignIn says whether the program's sandbox keeps its tools from reading its own sign-in, as a
	// contained host needs before it starts the program.
	KeepsToolsFromSignIn() bool

	// ReportsTurnResults says whether a headless turn prints its result and usage for the host to read, and its
	// account's sign-in can be checked in its own folder before the first turn.
	ReportsTurnResults() bool

	// ReportsLimitWindows says whether the program's status line gives its subscription's limit windows.
	ReportsLimitWindows() bool

	// Screens is how the build draws its terminal: its composer, menus and other regions, measured from its
	// recordings.
	Screens() screen.Layout
}
