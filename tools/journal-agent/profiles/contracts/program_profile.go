// Package contracts holds the interfaces of launch profiles.
package contracts

import "journal-agent/screen"

// Mode is how a program is launched: one child per turn, or one persistent terminal.
type Mode string

const (
	ProcessMode  Mode = "process"
	TerminalMode Mode = "terminal"
)

// Launch is what one start of a program needs: its isolated settings folder and the exact conversation it starts
// or resumes. A resume always names its conversation; "the latest" is never resumed.
type Launch struct {
	Mode           Mode
	SettingsFolder string
	SessionID      string
	Resume         bool
	Prompt         string
	// HookCommand, when set, is the command each native hook runs, such as the evidence harness's capture hook.
	HookCommand string
	Model       string
	Effort      string
	// WorkFolder is the folder the program works in, when the host knows it; a profile reads which of its own
	// discovery roots that folder holds.
	WorkFolder string
}

// SettingsFile is one file of the isolated settings folder: its name and content, or, for a login the person
// already holds, the path it links to so the secret is never copied.
type SettingsFile struct {
	Name    string
	Content []byte
	LinkTo  string
}

// ProgramProfile is how the host launches one pinned build of one agent program with its native subagents off
// (rule 36). Both programs implement it; nothing above it checks which program it has.
type ProgramProfile interface {
	// Program names the agent program, such as claude or codex.
	Program() string

	// Build is the one build this profile is proven against.
	Build() string

	// CheckBuild refuses any build but the pinned one, from what the program printed for its version.
	CheckBuild(reportedVersion string) error

	// Arguments are the command-line arguments of a launch, refusing a launch it cannot make safe.
	Arguments(launch Launch) ([]string, error)

	// Environment is the inherited environment with every variable that could turn native delegation on removed,
	// pointed at the launch's isolated settings folder where the program reads its settings from the environment.
	Environment(inherited []string, launch Launch) []string

	// SettingsFiles are the files the program reads from its isolated settings folder, with the launch's hook
	// command installed on every native hook event when it names one.
	SettingsFiles(launch Launch) ([]SettingsFile, error)

	// AllowedTools is the explicit native tool inventory; anything else is unavailable.
	AllowedTools() []string

	// RejectContrary refuses extra arguments that would undo the profile, such as re-enabling a delegation tool.
	RejectContrary(extraArguments []string) error

	// Screens is how the build draws its terminal: its composer, menus and other regions, measured from its
	// recordings.
	Screens() screen.Layout
}
