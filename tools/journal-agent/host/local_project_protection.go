package host

import (
	"errors"
	"fmt"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
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

// LocalProjectFolders are what a local-project start is confined to: the one folder it may write in, and the private
// state folder it may not read. A socket outside the assigned folder is never reachable.
type LocalProjectFolders struct {
	Assigned string
	Private  string
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

// confinement is the native mechanism that runs a command confined to the folders.
type confinement struct {
	mechanism string
	command   func(program []string) []string
}

// localProjectProbe is one action the probe program tries, what it is tried against and the outcome wanted.
type localProjectProbe struct {
	description string
	action      string
	path        string
	wanted      string
}

// ProbeLocalProjectProtection starts the probe program under this machine's confinement of a local-project start
// and has it write inside the assigned folder, write outside it, read the private state folder and connect to a
// socket outside the assigned folder. The probe program is a command line that takes the action and its path; the
// private folder is the host's state folder, or a new one when that does not exist yet.
func ProbeLocalProjectProtection(probe []string, private string) (LocalProjectProtection, error) {
	root, err := os.MkdirTemp("", "journal-protection-")
	if err != nil {
		return LocalProjectProtection{}, err
	}
	defer os.RemoveAll(root)

	root, err = filepath.EvalSymlinks(root)
	if err != nil {
		return LocalProjectProtection{}, err
	}

	folders := LocalProjectFolders{Assigned: filepath.Join(root, "assigned"), Private: filepath.Join(root, "private")}
	outside := filepath.Join(root, "outside")
	for _, folder := range []string{folders.Assigned, folders.Private, outside} {
		if err := os.Mkdir(folder, 0o700); err != nil {
			return LocalProjectProtection{}, err
		}
	}

	if resolved, err := filepath.EvalSymlinks(private); private != "" && err == nil {
		folders.Private = resolved
	}

	socket, err := net.Listen("unix", filepath.Join(outside, "s"))
	if err != nil {
		return LocalProjectProtection{}, err
	}
	defer socket.Close()

	confined, err := localProjectConfinement(folders, root, probe[0])
	if err != nil {
		return LocalProjectProtection{}, err
	}

	report := LocalProjectProtection{Platform: runtime.GOOS, Mechanism: confined.mechanism, Available: true}
	for _, check := range []localProjectProbe{
		{"write inside the assigned folder", ProbeWrite, filepath.Join(folders.Assigned, "file"), allowedOutcome},
		{"write outside the assigned folder", ProbeWrite, filepath.Join(outside, "file"), refusedOutcome},
		{"read the private state folder", ProbeRead, folders.Private, refusedOutcome},
		{"connect to a socket outside the assigned folder", ProbeConnect, socket.Addr().String(), refusedOutcome},
	} {
		result := check.run(confined, probe)
		report.Checks = append(report.Checks, result)
		report.Available = report.Available && result.Held
	}

	return report, nil
}

// run starts the probe program under the confinement for this one action and compares the outcome.
func (check localProjectProbe) run(confined confinement, probe []string) LocalProjectCheck {
	arguments := confined.command(append(append([]string{}, probe...), check.action, check.path))
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
