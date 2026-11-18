// Package contracts holds the interfaces of launch profiles.
package contracts

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

	// Environment is the inherited environment with every variable that could turn native delegation on removed.
	Environment(inherited []string) []string

	// SettingsFile is the content of the isolated settings file the program reads from its settings folder.
	SettingsFile() ([]byte, error)

	// AllowedTools is the explicit native tool inventory; anything else is unavailable.
	AllowedTools() []string

	// RejectContrary refuses extra arguments that would undo the profile, such as re-enabling a delegation tool.
	RejectContrary(extraArguments []string) error
}
