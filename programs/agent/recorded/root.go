package recorded

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
)

// rootMark is the file only the repository root holds, the one source of the host protocol.
const rootMark = "protocol/host.json"

// pinsFile names the driver builds the agent image installs, the builds a driver's recordings are made with.
const pinsFile = ".docker/helper/driver-digests.txt"

// imagePrograms is the digest scripts/agent-image-programs.sh prints, worked out once for the whole test run.
var imagePrograms = sync.OnceValues(func() (string, error) {
	root, err := Root()
	if err != nil {
		return "", err
	}
	printed, err := exec.Command("sh", filepath.Join(root, "scripts/agent-image-programs.sh")).Output()
	return strings.TrimSpace(string(printed)), err
})

// Root is the repository the working directory is in, found by walking up to the folder that holds the protocol.
func Root() (string, error) {
	folder, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(folder, rootMark)); err == nil {
			return folder, nil
		}
		parent := filepath.Dir(folder)
		if parent == folder {
			return "", errors.New("no folder above the working directory holds " + rootMark)
		}
		folder = parent
	}
}

// folderOf is where the scenario's recording is kept: a driver's under the build the agent image installs, the
// host's and the installer's under their name alone, as the PHP Recordings::folderOf.
func folderOf(root, driver, name string) (string, error) {
	build, err := buildOf(root, driver)
	if err != nil {
		return "", err
	}
	return filepath.Join(root, "resources/recordings", driver, build, name), nil
}

func buildOf(root, driver string) (string, error) {
	pins, err := os.Open(filepath.Join(root, pinsFile))
	if err != nil {
		return "", err
	}
	defer pins.Close()
	lines := bufio.NewScanner(pins)
	for lines.Scan() {
		fields := strings.Fields(lines.Text())
		if len(fields) == 4 && fields[0] == driver {
			return fields[1], nil
		}
	}
	return "", lines.Err()
}

func fileDigest(file string) (string, error) {
	content, err := os.ReadFile(file)
	if err != nil {
		return "", err
	}
	digest := sha256.Sum256(content)
	return hex.EncodeToString(digest[:]), nil
}
