//go:build darwin

package host

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// localProjectConfinement is a Seatbelt profile (sandbox-exec) around the program: writes only inside the assigned
// folder, no read of the private state folder and no Unix socket outside the assigned folder.
func localProjectConfinement(folders LocalProjectFolders, scratch string, _ string) (confinement, error) {
	if _, err := os.Stat(SandboxExecutable); err != nil {
		return confinement{}, fmt.Errorf("%w: %s is missing", ErrLocalProjectUnprotected, SandboxExecutable)
	}

	for _, folder := range []string{folders.Assigned, folders.Private} {
		if !filepath.IsAbs(folder) || strings.ContainsAny(folder, "\"\\\n") {
			return confinement{}, fmt.Errorf("the confined folder %q is not a plain absolute path", folder)
		}
	}

	profile := strings.Join([]string{
		"(version 1)",
		"(allow default)",
		"(deny file-write*)",
		fmt.Sprintf("(allow file-write* (subpath %q) (literal \"/dev/null\") (literal \"/dev/tty\"))", folders.Assigned),
		fmt.Sprintf("(deny file-read* (subpath %q))", folders.Private),
		"(deny network-outbound (remote unix-socket))",
		fmt.Sprintf("(allow network-outbound (remote unix-socket (subpath %q)))", folders.Assigned),
		"",
	}, "\n")
	path := filepath.Join(scratch, "local-project.sb")
	if err := os.WriteFile(path, []byte(profile), 0o600); err != nil {
		return confinement{}, err
	}

	return confinement{
		mechanism: "Seatbelt profile (sandbox-exec) around the program",
		command: func(program []string) []string {
			return append([]string{SandboxExecutable, "-f", path}, program...)
		},
	}, nil
}
