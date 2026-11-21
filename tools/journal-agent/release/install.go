package release

import (
	"context"
	"crypto/ed25519"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"journal-agent/host"
)

// ErrDownloadFailed is returned when a release file could not be fetched from the journal.
var ErrDownloadFailed = errors.New("a release file could not be downloaded")

// ErrRedirected refuses a release file the origin answered with a redirect: the journal must serve every release
// file directly, so nothing is verified or installed from elsewhere.
var ErrRedirected = errors.New("a release file was redirected, not served by the journal itself; nothing was installed")

// Installer installs one target of a release from the journal that publishes it.
type Installer struct {
	Origin    string
	Target    Target
	Transport *http.Client
	PublicKey ed25519.PublicKey
}

// Install verifies the manifest's signature with the pinned key before reading it, downloads every file of the
// target into a private staging folder, verifies each against the manifest and installs them sealed into the
// folder. An installation already there is verified and kept, so a rerun changes nothing.
func (installer Installer) Install(ctx context.Context, manifest, signature []byte, folder string) error {
	if _, err := os.Lstat(folder); err == nil {
		_, err := host.Installation{Folder: folder}.Verify()
		return err
	}

	if !ed25519.Verify(installer.PublicKey, manifest, signature) {
		return ErrSignatureInvalid
	}

	var release Manifest
	if err := json.Unmarshal(manifest, &release); err != nil {
		return err
	}

	staging, err := os.MkdirTemp("", "journal-release-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(staging)

	files, err := release.artifactsOf(installer.Target)
	if err != nil {
		return err
	}
	for _, artifact := range files.Artifacts {
		if err := installer.download(ctx, release.Version, artifact, staging); err != nil {
			return err
		}
	}

	installation, err := Verify(manifest, signature, installer.PublicKey, installer.Target, staging)
	if err != nil {
		return err
	}

	return host.Install(installation, folder)
}

// download fetches one file of the target from the journal's release route into the staging folder.
func (installer Installer) download(ctx context.Context, version string, artifact host.Artifact, staging string) error {
	url := fmt.Sprintf("%s/releases/%s/%s/%s", installer.Origin, version, installer.Target.Folder(), artifact.Name)
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}

	// The release is served from the exact origin: a redirect is never followed, so its target is never trusted.
	direct := *installer.Transport
	direct.CheckRedirect = func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }
	response, err := direct.Do(request)
	if err != nil {
		return errors.Join(ErrDownloadFailed, err)
	}
	defer response.Body.Close()

	if response.StatusCode >= 300 && response.StatusCode < 400 {
		return fmt.Errorf("%w: %s answered %d towards %s", ErrRedirected, artifact.Name, response.StatusCode,
			response.Header.Get("Location"))
	}
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("%w: %s answered %d", ErrDownloadFailed, artifact.Name, response.StatusCode)
	}

	path := filepath.Join(staging, artifact.Source)
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	file, err := os.OpenFile(path, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	if _, err := io.Copy(file, response.Body); err != nil {
		file.Close()
		return err
	}

	return file.Close()
}
