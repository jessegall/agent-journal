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
)

// ErrUnknownArrangement is returned for an --arrangement that is neither local nor contained.
var ErrUnknownArrangement = errors.New("the arrangement is neither local nor contained")

// ErrContainedNeedsDocker is returned when a contained host has no agent daemon socket to start containers through.
var ErrContainedNeedsDocker = errors.New("a contained host needs --docker, the agent daemon's socket")

// ErrContainedNeedsInstallationName is returned when a contained host has no name to prefix its containers with.
var ErrContainedNeedsInstallationName = errors.New("a contained host needs --installation-name, the prefix of its containers")

// ParseArrangement reads the --arrangement flag.
func ParseArrangement(value string) (Arrangement, error) {
	switch Arrangement(value) {
	case Local, Contained:
		return Arrangement(value), nil
	}

	return "", fmt.Errorf("%w: %q", ErrUnknownArrangement, value)
}

// IsContained is whether agents run in containers of the agent daemon.
func (arrangement Arrangement) IsContained() bool {
	return arrangement == Contained
}

// AssertServable refuses a contained host that lacks the agent daemon's socket or its installation name; a local host
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
var ErrContainedNeedsImages = errors.New("a contained host needs --agent-image and --runner-image, each by digest")

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
		if !strings.Contains(reference, "@sha256:") {
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
