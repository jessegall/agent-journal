//go:build linux

package host

import (
	"fmt"
	"os/exec"
	"strings"
)

// localProjectConfinement is a bubblewrap namespace around the program over the machine's own folders. Mounts apply
// in order: the project and the relay's state are covered by empty folders, which also hide every socket in the state,
// and the child's own checkout and runtime folder are bound back writable over them. Git's common directory, when it
// lies outside the project, is bound read-only. Claude Code's own sandbox on Linux also needs socat.
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
		"--tmpfs", folders.Project, "--tmpfs", folders.State,
		"--bind", folders.Checkout, folders.Checkout, "--bind", folders.Runtime, folders.Runtime}
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
