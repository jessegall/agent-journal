package host

import (
	"context"
	"errors"
	"fmt"
	"strings"
)

// Arrangement is where this host runs agents: on the machine itself, or each in a container of the agent daemon
// (doc 61, decision 1). The journal refuses a claim from a host whose arrangement is not the one it enrolled with.
type Arrangement string

const (
	// Local runs every agent on this machine, the default.
	Local Arrangement = "local"
	// Contained runs every agent in a container of the agent daemon, as the agent-host service does.
	Contained Arrangement = "contained"
	// LocalProject runs the agents of a project connected to a server journal on the owner's own machine, each
	// confined by the platform's native mechanism to its assigned folder.
	LocalProject Arrangement = "local-project"
)

// ErrUnknownArrangement is returned for an --arrangement that is not local, contained or local-project.
var ErrUnknownArrangement = errors.New("the arrangement is not local, contained or local-project")

// ErrContainedNeedsDocker is returned when a contained host has no agent daemon socket to start containers through.
var ErrContainedNeedsDocker = errors.New("a contained host needs --docker, the agent daemon's socket")

// ErrContainedNeedsInstallationName is returned when a contained host has no name to prefix its containers with.
var ErrContainedNeedsInstallationName = errors.New("a contained host needs --installation-name, the prefix of its containers")

// ParseArrangement reads the --arrangement flag.
func ParseArrangement(value string) (Arrangement, error) {
	switch Arrangement(value) {
	case Local, Contained, LocalProject:
		return Arrangement(value), nil
	}

	return "", fmt.Errorf("%w: %q", ErrUnknownArrangement, value)
}

// IsContained is whether agents run in containers of the agent daemon.
func (arrangement Arrangement) IsContained() bool {
	return arrangement == Contained
}

// AssertServable refuses a contained host that lacks the agent daemon's socket or its installation name; a local host
// ErrProgramNotContainable refuses a Codex start on a contained host, whatever its account's sign-in method: Codex's
// sandbox limits writes only, so its tools could read its sign-in (doc 61, decision 8).
var ErrProgramNotContainable = errors.New("Codex's sandbox does not keep tools from its sign-in; container starts " +
	"wait for the provider transport")

// AssertContainable refuses, on a contained host, a program whose sandbox does not keep its tools from its sign-in.
func (arrangement Arrangement) AssertContainable(program string) error {
	if arrangement.IsContained() && program == "codex" {
		return ErrProgramNotContainable
	}

	return nil
}

// needs neither.
func (arrangement Arrangement) AssertServable(dockerSocket string, installationName InstallationName) error {
	if !arrangement.IsContained() {
		return nil
	}

	if dockerSocket == "" {
		return ErrContainedNeedsDocker
	}

	if installationName == "" {
		return ErrContainedNeedsInstallationName
	}

	return nil
}

// ErrContainedNeedsImages is returned when a contained host is not told which agent and runner images to run.
var ErrContainedNeedsImages = errors.New("a contained host needs --agent-image and --runner-image, each by id or digest")

// PinnedImages are the agent and sign-in runner images a contained host runs, each named by its digest: the sealed
// installation of the contained arrangement (doc 61, decision 4).
type PinnedImages struct {
	Agent  string
	Runner string
}

// AssertLoaded refuses images that are not named by digest, or that the agent daemon lacks or holds under another
// digest.
func (images PinnedImages) AssertLoaded(ctx context.Context, containers Containers) error {
	for _, reference := range []string{images.Agent, images.Runner} {
		if !IsPinnedReference(reference) {
			return ErrContainedNeedsImages
		}

		if err := containers.AssertImagePinned(ctx, reference); err != nil {
			return err
		}
	}

	return nil
}

// Lines are the arrangement and both images, one to a line, for an operator to compare with
// docs/accounts/docker-images.json.
func (images PinnedImages) Lines(arrangement Arrangement) string {
	return strings.Join([]string{"arrangement " + string(arrangement), "agent-image " + images.Agent,
		"runner-image " + images.Runner}, "\n")
}
