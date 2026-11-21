//go:build linux

package host

import "os/exec"

// platformMechanisms is what the pinned clients can apply on this Linux host. Claude Code's sandbox needs bubblewrap
// and socat on the host; without them it has no mechanism at all.
func platformMechanisms() map[string]ProgramMechanisms {
	return linuxMechanisms(claudeOnLinux())
}

func claudeOnLinux() ProgramMechanisms {
	for _, tool := range []string{"bwrap", "socat"} {
		if _, err := exec.LookPath(tool); err != nil {
			return claudeWithoutSandbox("Claude Code's sandbox needs " + tool + ", which this host does not have")
		}
	}

	return claudeSandbox()
}
