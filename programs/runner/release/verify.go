package release

import (
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"

	"journal-runner/host"
)

var (
	// ErrSignatureInvalid is returned when the signature is not the pinned key's signature over the manifest.
	ErrSignatureInvalid = errors.New("the release manifest is not signed by the pinned key")
	// ErrTargetMissing is returned when the release has no files for the machine's target.
	ErrTargetMissing = errors.New("the release has no files for this target")
	// ErrArtifactMissing is returned when a file the manifest records for the target is not in the release folder.
	ErrArtifactMissing = errors.New("a release file the manifest records is missing")
	// ErrArtifactChanged is returned when a release file has another SHA-256 or byte size than the manifest's.
	ErrArtifactChanged = errors.New("a release file is not the one the manifest records")
)

// Verify checks the signature of the manifest with the pinned public key before reading it, then checks each file
// of the target in the release folder against its recorded SHA-256 and byte size. The installation manifest it
// returns names those files by their absolute paths, ready for host.Install.
func Verify(
	manifest []byte,
	signature []byte,
	publicKey ed25519.PublicKey,
	target Target,
	folder string,
) (host.InstallationManifest, error) {
	if len(publicKey) != ed25519.PublicKeySize || !ed25519.Verify(publicKey, manifest, signature) {
		return host.InstallationManifest{}, ErrSignatureInvalid
	}

	var release Manifest
	if err := json.Unmarshal(manifest, &release); err != nil {
		return host.InstallationManifest{}, err
	}

	targetArtifacts, err := release.artifactsOf(target)
	if err != nil {
		return host.InstallationManifest{}, err
	}

	installation := host.InstallationManifest{}
	for _, artifact := range targetArtifacts.Artifacts {
		verified, err := verifyArtifact(artifact, folder)
		if err != nil {
			return host.InstallationManifest{}, err
		}

		installation.Artifacts = append(installation.Artifacts, verified)
	}

	return installation, nil
}

// verifyArtifact measures the file a release artifact names and refuses one that differs from the manifest.
func verifyArtifact(artifact host.Artifact, folder string) (host.Artifact, error) {
	if !filepath.IsLocal(artifact.Source) {
		return host.Artifact{}, fmt.Errorf("%w: %s lies outside the release folder", ErrArtifactChanged, artifact.Source)
	}

	path := filepath.Join(folder, artifact.Source)
	measured, err := measure(path)
	if errors.Is(err, fs.ErrNotExist) {
		return host.Artifact{}, fmt.Errorf("%w: %s", ErrArtifactMissing, artifact.Source)
	}

	if err != nil {
		return host.Artifact{}, err
	}

	if measured.SHA256 != artifact.SHA256 || measured.Size != artifact.Size {
		return host.Artifact{}, fmt.Errorf("%w: %s", ErrArtifactChanged, artifact.Source)
	}

	artifact.Source = path

	return artifact, nil
}

// measure is the SHA-256 and byte size of the file at the path, read once.
func measure(path string) (host.Artifact, error) {
	file, err := os.Open(path)
	if err != nil {
		return host.Artifact{}, err
	}
	defer file.Close()

	digest := sha256.New()
	size, err := io.Copy(digest, file)
	if err != nil {
		return host.Artifact{}, err
	}

	return host.Artifact{SHA256: hex.EncodeToString(digest.Sum(nil)), Size: size}, nil
}
