package host

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"syscall"
)

const (
	installedManifestName = "installation.json"
	installedFolderMode   = 0o555
	installedFileMode     = 0o444
	installedProgramMode  = 0o555
)

// Artifact is one file of the protected installation: where it is installed, where it comes from and the SHA-256
// it must have. The pinned agent drivers, journal-agent, PHP and the relay with its dependencies are artifacts.
// A release manifest also records the measured byte size of each file.
type Artifact struct {
	Name       string `json:"name"`
	Source     string `json:"source,omitempty"`
	SHA256     string `json:"sha256"`
	Size       int64  `json:"size,omitempty"`
	Executable bool   `json:"executable"`
}

// InstallationManifest is every artifact of one installation; nothing outside it is installed.
type InstallationManifest struct {
	Artifacts []Artifact `json:"artifacts"`
}

// Installation is a protected installation folder: read-only, outside every writable root, its files as the
// manifest recorded them.
type Installation struct {
	Folder string
}

// VerifiedArtifact is an installed file whose content, mode and place were checked.
type VerifiedArtifact struct {
	Name   string `json:"name"`
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
}

var (
	// ErrInstallationExists is returned when the folder is already installed: an installation is never upgraded
	// in place.
	ErrInstallationExists = errors.New("the installation folder already exists")
	// ErrInstallationChanged is returned when an installed file is not what the manifest recorded.
	ErrInstallationChanged = errors.New("the installation changed since it was installed")
	// ErrInstallationWritable is returned when the installation or a folder above it can be changed by others.
	ErrInstallationWritable = errors.New("the installation can be changed")
)

// Install copies every artifact into an owner-only staging folder beside the target, checks each digest, seals
// the folders inside it, publishes it with one rename and then seals its top folder, which a rename needs writable.
// A digest that differs leaves nothing installed.
func Install(manifest InstallationManifest, folder string) error {
	if !filepath.IsAbs(folder) {
		return fmt.Errorf("the installation folder %s is not absolute", folder)
	}
	if _, err := os.Lstat(folder); err == nil {
		return fmt.Errorf("%w: %s", ErrInstallationExists, folder)
	}
	if err := checkArtifactNames(manifest); err != nil {
		return err
	}
	staging, err := os.MkdirTemp(filepath.Dir(folder), "."+filepath.Base(folder)+".staging-")
	if err != nil {
		return err
	}
	defer removeStaging(staging)

	installed := InstallationManifest{}
	for _, artifact := range manifest.Artifacts {
		if err := copyArtifact(artifact, staging); err != nil {
			return err
		}
		installed.Artifacts = append(installed.Artifacts, Artifact{
			Name: artifact.Name, SHA256: artifact.SHA256, Executable: artifact.Executable,
		})
	}
	if err := writeInstalledManifest(installed, staging); err != nil {
		return err
	}
	if err := sealFolders(staging); err != nil {
		return err
	}
	if err := os.Rename(staging, folder); err != nil {
		return err
	}
	return os.Chmod(folder, installedFolderMode)
}

// Verify checks that the installation and every folder above it can be changed by its owner alone, and that each
// installed file is a plain read-only file with the digest the manifest recorded.
func (installation Installation) Verify() ([]VerifiedArtifact, error) {
	if !filepath.IsAbs(installation.Folder) {
		return nil, fmt.Errorf("the installation folder %s is not absolute", installation.Folder)
	}
	if err := requireUnchangeableAncestors(installation.Folder); err != nil {
		return nil, err
	}
	content, err := os.ReadFile(filepath.Join(installation.Folder, installedManifestName))
	if err != nil {
		return nil, err
	}
	var manifest InstallationManifest
	if err := json.Unmarshal(content, &manifest); err != nil {
		return nil, err
	}
	verified := make([]VerifiedArtifact, 0, len(manifest.Artifacts))
	for _, artifact := range manifest.Artifacts {
		path := filepath.Join(installation.Folder, artifact.Name)
		if err := requireSealedFile(path, artifact); err != nil {
			return nil, err
		}
		verified = append(verified, VerifiedArtifact{Name: artifact.Name, Path: path, SHA256: artifact.SHA256})
	}
	return verified, nil
}

// Path is the absolute path of an installed artifact, once the installation verified.
func (installation Installation) Path(name string) string {
	return filepath.Join(installation.Folder, name)
}

func checkArtifactNames(manifest InstallationManifest) error {
	seen := map[string]bool{installedManifestName: true}
	for _, artifact := range manifest.Artifacts {
		clean := filepath.Clean(artifact.Name)
		if clean != artifact.Name || filepath.IsAbs(clean) || strings.HasPrefix(clean, "..") || seen[clean] {
			return fmt.Errorf("the artifact name %q is not a plain, unique path inside the installation", artifact.Name)
		}
		if artifact.Source == "" || len(artifact.SHA256) != sha256.Size*2 {
			return fmt.Errorf("the artifact %s names no source or no SHA-256", artifact.Name)
		}
		seen[clean] = true
	}
	return nil
}

func copyArtifact(artifact Artifact, staging string) error {
	source, err := os.Open(artifact.Source)
	if err != nil {
		return err
	}
	defer source.Close()
	target := filepath.Join(staging, artifact.Name)
	if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
		return err
	}
	file, err := os.OpenFile(target, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	digest := sha256.New()
	if _, err := io.Copy(io.MultiWriter(file, digest), source); err != nil {
		file.Close()
		return err
	}
	if err := file.Close(); err != nil {
		return err
	}
	if hex.EncodeToString(digest.Sum(nil)) != artifact.SHA256 {
		return fmt.Errorf("%w: %s from %s has another SHA-256 than the manifest's", ErrInstallationChanged,
			artifact.Name, artifact.Source)
	}
	return os.Chmod(target, modeOf(artifact))
}

func writeInstalledManifest(manifest InstallationManifest, staging string) error {
	content, err := json.MarshalIndent(manifest, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(staging, installedManifestName), content, installedFileMode)
}

// sealFolders makes every folder inside the staged installation read-only, the deepest first; the staging folder
// itself stays writable until it is renamed into place.
func sealFolders(staging string) error {
	var folders []string
	err := filepath.WalkDir(staging, func(path string, entry os.DirEntry, err error) error {
		if err == nil && entry.IsDir() {
			folders = append(folders, path)
		}
		return err
	})
	if err != nil {
		return err
	}
	for index := len(folders) - 1; index >= 1; index-- {
		if err := os.Chmod(folders[index], installedFolderMode); err != nil {
			return err
		}
	}
	return nil
}

// removeStaging deletes a staging folder that was not published; a published one was renamed away already.
func removeStaging(staging string) {
	_ = filepath.WalkDir(staging, func(path string, entry os.DirEntry, err error) error {
		if err == nil && entry.IsDir() {
			_ = os.Chmod(path, 0o700)
		}
		return nil
	})
	_ = os.RemoveAll(staging)
}

func requireSealedFile(path string, artifact Artifact) error {
	info, err := os.Lstat(path)
	if err != nil {
		return err
	}
	if !info.Mode().IsRegular() || info.Mode().Perm() != modeOf(artifact) {
		return fmt.Errorf("%w: %s is not a sealed plain file", ErrInstallationWritable, path)
	}
	content, err := os.Open(path)
	if err != nil {
		return err
	}
	defer content.Close()
	digest := sha256.New()
	if _, err := io.Copy(digest, content); err != nil {
		return err
	}
	if hex.EncodeToString(digest.Sum(nil)) != artifact.SHA256 {
		return fmt.Errorf("%w: %s", ErrInstallationChanged, path)
	}
	return nil
}

// requireUnchangeableAncestors refuses a folder that is a link, or that has a folder above it others may write
// into. A root-owned shared folder with the sticky bit, such as /tmp, lets nobody else rename what is inside it.
func requireUnchangeableAncestors(folder string) error {
	for _, path := range folderAndAncestors(folder) {
		info, err := os.Lstat(path)
		if err != nil {
			return err
		}
		if info.Mode()&os.ModeSymlink != 0 {
			return fmt.Errorf("%w: %s is a link", ErrInstallationWritable, path)
		}
		if info.Mode().Perm()&0o022 != 0 && !stickyRootFolder(info) {
			return fmt.Errorf("%w: others may write into %s", ErrInstallationWritable, path)
		}
	}
	return nil
}

// folderAndAncestors is the folder and every folder above it, up to the root.
func folderAndAncestors(folder string) []string {
	paths := []string{folder}
	for path := folder; path != filepath.Dir(path); {
		path = filepath.Dir(path)
		paths = append(paths, path)
	}
	return paths
}

func stickyRootFolder(info os.FileInfo) bool {
	owner, known := info.Sys().(*syscall.Stat_t)
	return known && owner.Uid == 0 && info.Mode()&os.ModeSticky != 0
}

func modeOf(artifact Artifact) os.FileMode {
	if artifact.Executable {
		return installedProgramMode
	}
	return installedFileMode
}
