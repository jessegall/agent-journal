package host

import (
	"context"
	"strings"
)

// ContainerPlatform names the platform of a contained host's tools in reports and evidence.
const ContainerPlatform = "linux-container"

// ProtectedContainerPlatform names the agent container under the protected-account launch profile: the program and
// the commands the model runs are two users, so its items hold by other mechanisms than the program's own sandbox.
const ProtectedContainerPlatform = "linux-container-protected"

// sandboxProbe is bubblewrap with the namespaces and mounts Claude Code's sandbox asks for: a fresh /proc in its own
// PID namespace, its own user and network namespaces and a new session.
var sandboxProbe = []string{
	"--ro-bind", "/", "/", "--proc", "/proc", "--dev", "/dev",
	"--unshare-user", "--unshare-pid", "--unshare-net", "--new-session", "--die-with-parent", "true",
}

// ContainedPlatform is the agent image on the agent daemon. Its mechanisms are Linux's, but whether Claude Code's
// sandbox runs is shown by running socat and bwrap inside the image under the agent containers' seccomp profile,
// never by the host's own PATH. Its evidence is kept per agent image, so a new image needs new evidence.
func ContainedPlatform(ctx context.Context, containers Containers, seccomp string) ProtectionPlatform {
	return ProtectionPlatform{
		Name:        ContainerPlatform,
		EvidenceKey: ContainerPlatform + "@" + containers.Rules.AgentImage,
		Mechanisms:  linuxMechanisms(claudeInContainer(ctx, containers, seccomp)),
	}
}

// ProtectedPlatform is the agent image under the protected-account launch profile. Its evidence is kept per agent
// image like the standard container's, under its own key.
func ProtectedPlatform(containers Containers) ProtectionPlatform {
	return ProtectionPlatform{
		Name:        ProtectedContainerPlatform,
		EvidenceKey: ProtectedContainerPlatform + "@" + containers.Rules.AgentImage,
		Mechanisms: map[string]DriverMechanisms{
			"claude": claudeProtected(),
			"codex":  codexProtected(),
		},
	}
}

func claudeInContainer(ctx context.Context, containers Containers, seccomp string) DriverMechanisms {
	if output, err := containers.RunCheck(ctx, seccomp, "socat", "-V"); err != nil {
		return claudeWithoutSandbox("Claude Code's sandbox needs socat, which does not run in the agent image: " +
			failureLine(output, err))
	}

	if output, err := containers.RunCheck(ctx, seccomp, "bwrap", sandboxProbe...); err != nil {
		return claudeWithoutSandbox("Claude Code's sandbox does not start in the agent container: " +
			failureLine(output, err))
	}

	mechanisms := claudeSandbox()
	mechanisms[ForeignHistory] = native("each session's own history volume over the account's projects folder")

	return mechanisms
}

// failureLine is the first line a failed check printed, or its error when it printed nothing.
func failureLine(output string, err error) string {
	if line, _, _ := strings.Cut(output, "\n"); line != "" {
		return line
	}

	return err.Error()
}
