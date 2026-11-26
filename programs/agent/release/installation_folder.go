package release

import (
	"crypto/sha256"
	"encoding/hex"
	"path/filepath"
)

// InstallationFolder is where a release is sealed under the root: its version and the first eight hex digits of the
// program list's SHA-256, so a changed list seals a folder of its own beside the old one.
func InstallationFolder(root string, version string, programList []byte) string {
	digest := sha256.Sum256(programList)

	return filepath.Join(root, "releases", version+"-"+hex.EncodeToString(digest[:])[:8])
}
