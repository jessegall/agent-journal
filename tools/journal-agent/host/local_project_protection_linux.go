//go:build linux

package host

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// localProjectConfinement is a bubblewrap namespace around the program over the machine's own folders. Mounts apply
// in order: the project and the relay's state are covered by empty folders, which also hide every socket in the state,
// and every Git broker socket, and the child's own checkout, runtime folder and broker socket's folder are bound back
// writable over them. Git's common directory, when it
// lies outside the project, is bound read-only. A program's own bubblewrap sandbox on Linux also needs socat.
func localProjectConfinement(folders LocalProjectFolders, _ string) (ChildConfinement, error) {
	for _, tool := range []string{"bwrap", "socat"} {
		if _, err := exec.LookPath(tool); err != nil {
			return ChildConfinement{}, fmt.Errorf("%w: it needs %s, which this machine does not have", ErrLocalProjectUnprotected, tool)
		}
	}

	bwrap, err := exec.LookPath("bwrap")
	if err != nil {
		return ChildConfinement{}, err
	}

	arguments := []string{bwrap, "--die-with-parent", "--bind", "/", "/", "--dev", "/dev", "--proc", "/proc",
		"--tmpfs", folders.Project, "--tmpfs", folders.State, "--tmpfs", folders.brokerRoot(),
		"--bind", folders.Checkout, folders.Checkout, "--bind", folders.Runtime, folders.Runtime,
		"--bind", filepath.Dir(folders.Broker), filepath.Dir(folders.Broker)}
	if !strings.HasPrefix(folders.Common+"/", folders.Project+"/") {
		arguments = append(arguments, "--ro-bind", folders.Common, folders.Common)
	}
	arguments = append(arguments, "--chdir", folders.Checkout)

	return ChildConfinement{
		mechanism: "bubblewrap namespace with the project and the relay's state hidden but for the child's own folders",
		command: func(confined []string) []string {
			return append(append([]string{}, arguments...), confined...)
		},
	}, nil
}
