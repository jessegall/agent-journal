package release

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

// writeSigningKey writes a new ed25519 private key as PEM PKCS #8 into the folder and returns its path and public key.
func writeSigningKey(t *testing.T, folder string) (string, ed25519.PublicKey) {
	t.Helper()
	publicKey, privateKey, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}
	encoded, err := x509.MarshalPKCS8PrivateKey(privateKey)
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(folder, "release.key")
	if err := os.WriteFile(path, pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: encoded}), 0o600); err != nil {
		t.Fatal(err)
	}

	return path, publicKey
}

func TestReadSigningKeyReadsAKeyOutsideTheRepository(t *testing.T) {
	path, publicKey := writeSigningKey(t, t.TempDir())

	key, err := ReadSigningKey(path, t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if !publicKey.Equal(key.Public()) {
		t.Fatal("the key read is not the key written")
	}
}

func TestReadSigningKeyRefusesAKeyInsideTheRepository(t *testing.T) {
	repository := t.TempDir()
	if err := os.Mkdir(filepath.Join(repository, "keys"), 0o700); err != nil {
		t.Fatal(err)
	}
	path, _ := writeSigningKey(t, filepath.Join(repository, "keys"))

	_, err := ReadSigningKey(path, repository)
	if !errors.Is(err, ErrSigningKeyInRepository) {
		t.Fatalf("ReadSigningKey = %v, want ErrSigningKeyInRepository", err)
	}
}

func TestReadSigningKeyRefusesAFileWithNoKey(t *testing.T) {
	path := filepath.Join(t.TempDir(), "release.key")
	if err := os.WriteFile(path, []byte("not a key"), 0o600); err != nil {
		t.Fatal(err)
	}

	_, err := ReadSigningKey(path, t.TempDir())
	if !errors.Is(err, ErrSigningKeyUnreadable) {
		t.Fatalf("ReadSigningKey = %v, want ErrSigningKeyUnreadable", err)
	}
}
