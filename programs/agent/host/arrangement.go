package host

import (
	"context"
	"errors"
	"fmt"
	"strings"
)

// Arrangement is where this host runs its processes: on the machine itself, or each in a container of its Docker daemon
// . The journal refuses a claim from a host whose arrangement is not the one it enrolled with.
type Arrangement string

const (
	// Local runs every process on this machine, the default.
	Local Arrangement = "local"
	// Contained runs every process in a container of the Docker daemon.
	Contained Arrangement = "contained"
	// LocalProject runs the processes of a project connected to a server journal on the owner's own machine, each
	// confined by the platform's native mechanism to its assigned folder.
	LocalProject Arrangement = "local-project"
)

// ErrUnknownArrangement is returned for an --arrangement that is not local, contained or local-project.
var ErrUnknownArrangement = errors.New("the arrangement is not local, contained or local-project")

// ErrContainedNeedsDocker is returned when a contained host has no Docker socket to start containers through.
var ErrContainedNeedsDocker = errors.New("a contained host needs --docker, the Docker daemon's socket")

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

// IsContained is whether processes run in containers of the Docker daemon.
func (arrangement Arrangement) IsContained() bool {
	return arrangement == Contained
}

// AssertServable refuses a contained host that lacks the Docker daemon's socket or its installation name; a local host
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

// ErrContainedNeedsImages is returned when a contained host is not told which images it was installed with.
var ErrContainedNeedsImages = errors.New("a contained host needs --pinned-images, each by id or digest")

// PinnedImages are the images a contained host was installed with, each named by its digest, which the daemon must
// hold as named when the host starts.
type PinnedImages []string

// AssertLoaded refuses images that are not named by digest, or that the Docker daemon lacks or holds under another
// digest.
func (images PinnedImages) AssertLoaded(ctx context.Context, containers Containers) error {
	if len(images) == 0 {
		return ErrContainedNeedsImages
	}
	for _, reference := range images {
		if !IsPinnedReference(reference) {
			return ErrContainedNeedsImages
		}

		if err := containers.AssertImagePinned(ctx, reference); err != nil {
			return err
		}
	}

	return nil
}

// Lines are the arrangement and each pinned image, one to a line, for an operator to compare with
// docs/accounts/docker-images.json.
func (images PinnedImages) Lines(arrangement Arrangement) string {
	lines := []string{"arrangement " + string(arrangement)}
	for _, reference := range images {
		lines = append(lines, "pinned-image "+reference)
	}
	return strings.Join(lines, "\n")
}
