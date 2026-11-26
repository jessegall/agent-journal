package release

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

var (
	// ErrSigningKeyInRepository is returned when the private signing key lies inside the repository, where a commit
	// could publish it.
	ErrSigningKeyInRepository = errors.New("the signing key lies inside the repository")
	// ErrSigningKeyUnreadable is returned when the key file holds no PEM PKCS #8 ed25519 private key.
	ErrSigningKeyUnreadable = errors.New("the signing key is not a PEM PKCS #8 ed25519 private key")
)

// ReadSigningKey reads the ed25519 private key from its file, which must lie outside the repository. The file is
// what openssl genpkey -algorithm ed25519 writes.
func ReadSigningKey(path string, repository string) (ed25519.PrivateKey, error) {
	inside, err := isInside(path, repository)
	if err != nil {
		return nil, err
	}

	if inside {
		return nil, fmt.Errorf("%w: %s", ErrSigningKeyInRepository, path)
	}

	content, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	block, _ := pem.Decode(content)
	if block == nil {
		return nil, ErrSigningKeyUnreadable
	}

	parsed, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("%w: %w", ErrSigningKeyUnreadable, err)
	}

	key, isEd25519 := parsed.(ed25519.PrivateKey)
	if !isEd25519 {
		return nil, ErrSigningKeyUnreadable
	}

	return key, nil
}

// isInside answers whether the path, its links resolved, lies in the folder or below it.
func isInside(path string, folder string) (bool, error) {
	resolvedPath, err := filepath.EvalSymlinks(path)
	if err != nil {
		return false, err
	}

	resolvedFolder, err := filepath.EvalSymlinks(folder)
	if err != nil {
		return false, err
	}

	absolutePath, err := filepath.Abs(resolvedPath)
	if err != nil {
		return false, err
	}

	absoluteFolder, err := filepath.Abs(resolvedFolder)
	if err != nil {
		return false, err
	}

	relative, err := filepath.Rel(absoluteFolder, absolutePath)
	if err != nil {
		return false, err
	}

	return filepath.IsLocal(relative), nil
}
