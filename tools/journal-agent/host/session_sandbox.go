package host

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// SandboxExecutable is macOS's Seatbelt launcher; the host wraps a session's program in it.
const SandboxExecutable = "/usr/bin/sandbox-exec"

// sandboxProfileName is the file in a session's settings folder that holds its Seatbelt profile.
const sandboxProfileName = "session.sb"

// SessionSandbox is the Seatbelt profile one session's program and every tool it starts run under: they cannot read
// or write another workspace's history in the account folder, see another process or signal one outside the
// session. It is what Claude Code's own sandbox lacks for foreign history and process inspection.
type SessionSandbox struct {
	ProfilePath string
}

// ClaudeProjectFolder is where Claude Code keeps the history of sessions that work in this folder, under an account.
func ClaudeProjectFolder(accountFolder string, workFolder string) string {
	project := strings.NewReplacer("/", "-", ".", "-").Replace(filepath.Clean(workFolder))
	return filepath.Join(accountFolder, "projects", project)
}

// WriteSessionSandbox writes the session's profile into its settings folder, readable by the host's owner alone.
func WriteSessionSandbox(settingsFolder string, accountFolder string, workFolder string) (SessionSandbox, error) {
	for _, folder := range []string{settingsFolder, accountFolder, workFolder} {
		if !filepath.IsAbs(folder) || strings.ContainsAny(folder, "\"\\\n") {
			return SessionSandbox{}, fmt.Errorf("the sandbox folder %q is not a plain absolute path", folder)
		}
	}
	rules := append([]string{"(version 1)", "(allow default)"},
		sessionSandboxRules(realPath(accountFolder), realPath(workFolder))...)
	profile := strings.Join(append(rules, ""), "\n")
	path := filepath.Join(settingsFolder, sandboxProfileName)
	if err := os.WriteFile(path, []byte(profile), 0o600); err != nil {
		return SessionSandbox{}, err
	}
	return SessionSandbox{ProfilePath: path}, nil
}

// sessionSandboxRules close the account's other workspaces' history and every process outside the sandbox; the
// folders are real paths.
func sessionSandboxRules(accountFolder string, workFolder string) []string {
	return []string{
		fmt.Sprintf("(deny file-read* file-write* (subpath %q))", filepath.Join(accountFolder, "projects")),
		fmt.Sprintf("(allow file-read* file-write* (subpath %q))", ClaudeProjectFolder(accountFolder, workFolder)),
		"(deny process-info*)",
		"(allow process-info* (target same-sandbox))",
		"(deny signal)",
		"(allow signal (target same-sandbox))",
	}
}

// realPath resolves a folder's symbolic links, as Seatbelt matches the real path; a folder that does not exist yet
// stays as it is.
func realPath(folder string) string {
	resolved, err := filepath.EvalSymlinks(folder)
	if err != nil {
		return folder
	}
	return resolved
}

// Wrap makes the command run its program inside the session's sandbox.
func (sandbox SessionSandbox) Wrap(command *exec.Cmd) {
	command.Args = append([]string{SandboxExecutable, "-f", sandbox.ProfilePath, command.Path}, command.Args[1:]...)
	command.Path = SandboxExecutable
}
