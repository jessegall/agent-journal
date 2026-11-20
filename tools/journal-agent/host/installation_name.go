package host

import (
	"errors"
	"fmt"
	"regexp"
)

// InstallationName is the prefix of every container, network and volume of one journal on an agent daemon, so two
// journals on one daemon never find each other's: lowercase letters, digits and dashes, 1 to 40 characters, never
// opening with a dash. A local host has none.
type InstallationName string

// VolumeType is what a named volume of a contained session holds.
type VolumeType string

const (
	// WorkspaceVolume holds a session's workspace, kept after the session ends.
	WorkspaceVolume VolumeType = "workspace"
	// CheckoutVolume holds a writer's own clone, removed once its commits are taken.
	CheckoutVolume VolumeType = "checkout"
	// HistoryVolume holds a session's program history, kept after the session ends.
	HistoryVolume VolumeType = "history"
)

// ErrInstallationNameInvalid is returned for an --installation-name that is not lowercase letters, digits and dashes.
var ErrInstallationNameInvalid = errors.New("the installation name is not 1 to 40 lowercase letters, digits and dashes")

var installationNamePattern = regexp.MustCompile(`^[a-z0-9][a-z0-9-]{0,39}$`)

// ParseInstallationName reads the --installation-name flag; an empty flag is no name, as on a local host.
func ParseInstallationName(value string) (InstallationName, error) {
	if value != "" && !installationNamePattern.MatchString(value) {
		return "", fmt.Errorf("%w: %q", ErrInstallationNameInvalid, value)
	}

	return InstallationName(value), nil
}

// ResourceName is the name of a session's container and of its launch network: <installation>-<session>, or
// journal-<session> on a host with no installation name, as local launches have always been named.
func (name InstallationName) ResourceName(session string) string {
	if name == "" {
		return "journal-" + session
	}

	return string(name) + "-" + session
}

// VolumeName is the name of a named volume: <installation>-<type>-<id>.
func (name InstallationName) VolumeName(volume VolumeType, id string) string {
	return string(name) + "-" + string(volume) + "-" + id
}
