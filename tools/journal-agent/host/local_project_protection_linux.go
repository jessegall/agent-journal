//go:build linux

package host

import (
	"fmt"
	"os"
	"os/exec"
)

// localProjectSystemFolders are the folders of the system a confined program sees, read-only.
var localProjectSystemFolders = []string{"/usr", "/bin", "/sbin", "/lib", "/lib64", "/etc"}

// localProjectConfinement is a bubblewrap namespace around the program that holds only the system folders read-only,
// the program itself and the assigned folder writable: the private state folder and every socket outside the
// assigned folder are not there at all. Claude Code's own sandbox on Linux also needs socat.
func localProjectConfinement(folders LocalProjectFolders, _ string, program string) (confinement, error) {
	for _, tool := range []string{"bwrap", "socat"} {
		if _, err := exec.LookPath(tool); err != nil {
			return confinement{}, fmt.Errorf("%w: it needs %s, which this machine does not have", ErrLocalProjectUnprotected, tool)
		}
	}

	bwrap, err := exec.LookPath("bwrap")
	if err != nil {
		return confinement{}, err
	}

	arguments := []string{bwrap, "--die-with-parent", "--unshare-all", "--dev", "/dev", "--proc", "/proc", "--tmpfs", "/tmp"}
	for _, folder := range localProjectSystemFolders {
		if _, err := os.Stat(folder); err == nil {
			arguments = append(arguments, "--ro-bind", folder, folder)
		}
	}
	arguments = append(arguments, "--ro-bind", program, program, "--bind", folders.Assigned, folders.Assigned,
		"--chdir", folders.Assigned)

	return confinement{
		mechanism: "bubblewrap namespace with only the system folders and the assigned folder",
		command: func(confined []string) []string {
			return append(append([]string{}, arguments...), confined...)
		},
	}, nil
}
