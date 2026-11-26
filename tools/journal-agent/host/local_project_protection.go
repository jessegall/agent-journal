package host

import (
	"errors"
	"fmt"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

// ErrLocalProjectUnprotected is returned on a machine with no native mechanism that confines a local-project start.
var ErrLocalProjectUnprotected = errors.New("this machine has no mechanism that confines a local-project start")

// The actions the protection probe runs inside the confinement, each against one path.
const (
	ProbeWrite   = "write"
	ProbeRead    = "read"
	ProbeConnect = "connect"
)

// Outcomes of a probe action.
const (
	allowedOutcome = "allowed"
	refusedOutcome = "refused"
)

// LocalProjectFolders are what a connected project's child start is confined to. Its own checkout is the one folder
// of the project it reads and writes: the rest of the canonical root, every sibling worktree and Git's common
// directory are closed to it. The relay's state folder, its sockets included, is closed too, but for the start's own
// runtime folder, which holds the program's settings. Of the Git brokers' sockets it reaches only its own.
type LocalProjectFolders struct {
	Checkout string
	Project  string
	Common   string
	State    string
	Runtime  string
	// Broker is the child's own Git broker socket, already listening, under the root of every broker socket.
	Broker string
	// Account is the saved account folder whose other workspaces' history stays closed, as in a session sandbox.
	Account string
}

// LocalProjectCheck is one action a program started under the confinement tried, the outcome the confinement must
// give and the one it gave.
type LocalProjectCheck struct {
	Action   string `json:"action"`
	Wanted   string `json:"wanted"`
	Observed string `json:"observed"`
	Held     bool   `json:"held"`
	Detail   string `json:"detail,omitempty"`
}

// LocalProjectProtection is what the confinement of a local-project start held on this machine. It is available
// only when every check held.
type LocalProjectProtection struct {
	Platform  string              `json:"platform"`
	Mechanism string              `json:"mechanism"`
	Checks    []LocalProjectCheck `json:"checks"`
	Available bool                `json:"available"`
}

// ChildConfinement is the native mechanism that runs a connected child's program confined to its folders.
type ChildConfinement struct {
	mechanism string
	command   func(program []string) []string
}

// ConfineChild prepares the confinement of a child start: its profile, where the platform needs one, goes in the
// start's own runtime folder. A platform with no confining mechanism refuses the start with
// ErrLocalProjectUnprotected.
func ConfineChild(folders LocalProjectFolders) (ChildConfinement, error) {
	paths := []string{folders.Checkout, folders.Project, folders.Common, folders.State, folders.Runtime, folders.Broker}
	for _, folder := range paths {
		if !filepath.IsAbs(folder) || strings.ContainsAny(folder, "\"\\\n") {
			return ChildConfinement{}, fmt.Errorf("the confined folder %q is not a plain absolute path", folder)
		}
	}
	if err := os.MkdirAll(folders.Runtime, 0o700); err != nil {
		return ChildConfinement{}, err
	}

	return localProjectConfinement(folders.real(), folders.Runtime)
}

// real resolves each folder's symbolic links, as the native mechanisms match the real path.
func (folders LocalProjectFolders) real() LocalProjectFolders {
	resolved := LocalProjectFolders{
		Checkout: realPath(folders.Checkout),
		Project:  realPath(folders.Project),
		Common:   realPath(folders.Common),
		State:    realPath(folders.State),
		Runtime:  realPath(folders.Runtime),
		Broker:   realPath(folders.Broker),
	}
	if folders.Account != "" {
		resolved.Account = realPath(folders.Account)
	}

	return resolved
}

// Command is the command line that runs the program confined.
func (confined ChildConfinement) Command(program []string) []string {
	return confined.command(program)
}

// brokerRoot is the folder every Git broker socket lives under, which the child may reach only for its own socket.
func (folders LocalProjectFolders) brokerRoot() string {
	return filepath.Dir(filepath.Dir(folders.Broker))
}

// Wrap makes the command run its program confined.
func (confined ChildConfinement) Wrap(command *exec.Cmd) {
	arguments := confined.command(append([]string{command.Path}, command.Args[1:]...))
	command.Path, command.Args = arguments[0], arguments
}

// localProjectProbe is one action the probe program tries, what it is tried against and the outcome wanted.
type localProjectProbe struct {
	description string
	action      string
	path        string
	wanted      string
}

// ProbeLocalProjectProtection starts the probe program under this machine's confinement of a child start, in a
// project laid out as a connected one is, and has it try each write and read the confinement allows or refuses. The
// probe program is a command line that takes the action and its path.
func ProbeLocalProjectProtection(probe []string) (LocalProjectProtection, error) {
	root, err := os.MkdirTemp("", "journal-protection-")
	if err != nil {
		return LocalProjectProtection{}, err
	}
	defer os.RemoveAll(root)

	root, err = filepath.EvalSymlinks(root)
	if err != nil {
		return LocalProjectProtection{}, err
	}

	project := filepath.Join(root, "project")
	worktrees := filepath.Join(project, ".journal", "worktrees")
	folders := LocalProjectFolders{
		Checkout: filepath.Join(worktrees, "child"),
		Project:  project,
		Common:   filepath.Join(project, ".git"),
		State:    filepath.Join(root, "state"),
		Runtime:  filepath.Join(root, "state", "runtimes", "child"),
	}
	sibling := filepath.Join(worktrees, "sibling")
	for _, folder := range []string{folders.Checkout, folders.Common, folders.Runtime, sibling} {
		if err := os.MkdirAll(folder, 0o700); err != nil {
			return LocalProjectProtection{}, err
		}
	}

	socket, err := net.Listen("unix", filepath.Join(folders.State, "s"))
	if err != nil {
		return LocalProjectProtection{}, err
	}
	defer socket.Close()

	brokers := map[string]string{}
	for _, child := range []string{"child", "sibling"} {
		path := BrokerSocketPath(root + "/" + child)
		listener, err := ListenBroker(path)
		if err != nil {
			return LocalProjectProtection{}, err
		}
		defer os.RemoveAll(filepath.Dir(path))
		defer listener.Close()
		brokers[child] = path
	}
	folders.Broker = brokers["child"]

	confined, err := ConfineChild(folders)
	if err != nil {
		return LocalProjectProtection{}, err
	}

	report := LocalProjectProtection{Platform: runtime.GOOS, Mechanism: confined.mechanism, Available: true}
	for _, check := range []localProjectProbe{
		{"write inside its own checkout", ProbeWrite, filepath.Join(folders.Checkout, "file"), allowedOutcome},
		{"write inside its own runtime folder", ProbeWrite, filepath.Join(folders.Runtime, "file"), allowedOutcome},
		{"write Git's common directory", ProbeWrite, filepath.Join(folders.Common, "file"), refusedOutcome},
		{"write a sibling worktree", ProbeWrite, filepath.Join(sibling, "file"), refusedOutcome},
		{"read a sibling worktree", ProbeRead, sibling, refusedOutcome},
		{"read the project's canonical checkout", ProbeRead, project, refusedOutcome},
		{"write the relay's state", ProbeWrite, filepath.Join(folders.State, "file"), refusedOutcome},
		{"connect to a socket of the relay", ProbeConnect, socket.Addr().String(), refusedOutcome},
		{"connect to its own Git broker", ProbeConnect, brokers["child"], allowedOutcome},
		{"connect to a sibling's Git broker", ProbeConnect, brokers["sibling"], refusedOutcome},
	} {
		result := check.run(confined, probe)
		report.Checks = append(report.Checks, result)
		report.Available = report.Available && result.Held
	}

	return report, nil
}

// run starts the probe program under the confinement for this one action and compares the outcome.
func (check localProjectProbe) run(confined ChildConfinement, probe []string) LocalProjectCheck {
	arguments := confined.Command(append(append([]string{}, probe...), check.action, check.path))
	printed, err := exec.Command(arguments[0], arguments[1:]...).CombinedOutput()

	observed := allowedOutcome
	if err != nil {
		observed = refusedOutcome
	}

	return LocalProjectCheck{
		Action:   check.description,
		Wanted:   check.wanted,
		Observed: observed,
		Held:     observed == check.wanted,
		Detail:   string(printed),
	}
}

// RunProtectionProbe is the probe program's side: it tries the one action and fails when it is refused.
func RunProtectionProbe(action string, path string) error {
	switch action {
	case ProbeWrite:
		return os.WriteFile(path, []byte("probe\n"), 0o600)
	case ProbeRead:
		_, err := os.ReadDir(path)
		return err
	case ProbeConnect:
		connection, err := net.Dial("unix", path)
		if err != nil {
			return err
		}
		return connection.Close()
	}

	return fmt.Errorf("the protection probe has no action %q", action)
}

// SandboxExecutable is macOS's Seatbelt launcher; the host wraps a confined child's program in it.
const SandboxExecutable = "/usr/bin/sandbox-exec"

// realPath resolves a folder's symbolic links, as Seatbelt matches the real path; a folder that does not exist yet
// stays as it is.
func realPath(folder string) string {
	resolved, err := filepath.EvalSymlinks(folder)
	if err != nil {
		return folder
	}
	return resolved
}
