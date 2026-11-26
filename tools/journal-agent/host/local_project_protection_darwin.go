//go:build darwin

package host

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// childProfileName is the file in a child start's runtime folder that holds its Seatbelt profile.
const childProfileName = "child.sb"

// localProjectConfinement is a Seatbelt profile (sandbox-exec) around the program. Seatbelt takes the last rule that
// matches, so the project is closed first and the child's own checkout opened after it; Git's common directory and
// the relay's state, its sockets included, are closed after that, and the start's own runtime folder opened. Every
// Git broker socket is closed last but for the child's own.
// With a saved account, the session sandbox's rules join the same profile, as sandboxes do not nest.
func localProjectConfinement(folders LocalProjectFolders, scratch string) (ChildConfinement, error) {
	if _, err := os.Stat(SandboxExecutable); err != nil {
		return ChildConfinement{}, fmt.Errorf("%w: %s is missing", ErrLocalProjectUnprotected, SandboxExecutable)
	}

	rules := []string{
		"(version 1)",
		"(allow default)",
		fmt.Sprintf("(deny file-read* file-write* (subpath %q))", folders.Project),
		fmt.Sprintf("(allow file-read* file-write* (subpath %q))", folders.Checkout),
		fmt.Sprintf("(deny file-write* (subpath %q))", folders.Common),
		fmt.Sprintf("(deny file-read* file-write* (subpath %q))", folders.State),
		fmt.Sprintf("(deny network-outbound (remote unix-socket (subpath %q)))", folders.State),
		fmt.Sprintf("(allow file-read* file-write* (subpath %q))", folders.Runtime),
		fmt.Sprintf("(deny file-read* file-write* (subpath %q))", folders.brokerRoot()),
		fmt.Sprintf("(deny network-outbound (remote unix-socket (subpath %q)))", folders.brokerRoot()),
		fmt.Sprintf("(allow file-read* file-write* (literal %q))", folders.Broker),
		fmt.Sprintf("(allow network-outbound (remote unix-socket (path-literal %q)))", folders.Broker),
	}
	if folders.Account != "" {
		rules = append(rules, sessionSandboxRules(folders.Account, folders.Checkout)...)
	}
	path := filepath.Join(scratch, childProfileName)
	if err := os.WriteFile(path, []byte(strings.Join(append(rules, ""), "\n")), 0o600); err != nil {
		return ChildConfinement{}, err
	}

	return ChildConfinement{
		mechanism: "Seatbelt profile (sandbox-exec) around the program",
		command: func(program []string) []string {
			return append([]string{SandboxExecutable, "-f", path}, program...)
		},
	}, nil
}

// sessionSandboxRules close the account's other workspaces' history and every process outside the sandbox; the
// folders are real paths.
func sessionSandboxRules(accountFolder string, workFolder string) []string {
	project := strings.NewReplacer("/", "-", ".", "-").Replace(filepath.Clean(workFolder))
	return []string{
		fmt.Sprintf("(deny file-read* file-write* (subpath %q))", filepath.Join(accountFolder, "projects")),
		fmt.Sprintf("(allow file-read* file-write* (subpath %q))", filepath.Join(accountFolder, "projects", project)),
		"(deny process-info*)",
		"(allow process-info* (target same-sandbox))",
		"(deny signal)",
		"(allow signal (target same-sandbox))",
	}
}
