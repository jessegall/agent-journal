package host

import (
	"errors"
	"fmt"
	"regexp"
)

// InstallationName is the prefix of every container, network and volume of one journal on an Docker daemon, so two
// journals on one daemon never find each other's: lowercase letters, digits and dashes, 1 to 40 characters, never
// opening with a dash. A local host has none.
type InstallationName string

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
