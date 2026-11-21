package host

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"syscall"
)

const (
	connectionsFolderName = "connections"
	pendingName           = "pending.json"
	bindingName           = "binding.json"
	lockName              = "lock"
	// credentialBytes gives a credential of 64 base64url characters, as strong as the secret Host makes.
	credentialBytes = 48
	nonceBytes      = 16
	rootIDBytes     = 16
)

// PendingConnection is what a relay stages, privately, before it redeems an install line: the opaque id it names the
// folder by, the credential its host will sign with and the installation's one-time nonce. A reply that is lost is
// recovered with the same credential and nonce.
type PendingConnection struct {
	Origin            string `json:"origin"`
	CanonicalRoot     string `json:"canonical_root"`
	RootID            string `json:"root_id"`
	HostCredential    string `json:"host_credential"`
	InstallationNonce string `json:"installation_nonce"`
}

// Binding is a project folder's connection once redeemed: the host enrollment it signs with and the project and
// binding it belongs to.
type Binding struct {
	Enrollment
	ProjectID string `json:"project_id"`
	BindingID string `json:"binding_id"`
	RootID    string `json:"root_id"`
}

// ConnectionState is the private state of one project folder's connection, inside the host's state folder and
// outside the project, keyed by the folder's canonical root.
type ConnectionState struct {
	Folder        string
	CanonicalRoot string
}

// ErrNotConnected is returned for a folder whose connection holds no binding yet.
var ErrNotConnected = errors.New("this folder is not connected to a journal")

// Lock holds the folder's connection for this process alone until the returned unlock runs: two runs for one root
// never stage or redeem at once.
func (state ConnectionState) Lock() (func(), error) {
	if err := os.MkdirAll(state.folder(), stateFolderMode); err != nil {
		return nil, err
	}
	file, err := os.OpenFile(filepath.Join(state.folder(), lockName), os.O_CREATE|os.O_RDWR, secretFileMode)
	if err != nil {
		return nil, err
	}
	if err := syscall.Flock(int(file.Fd()), syscall.LOCK_EX); err != nil {
		file.Close()
		return nil, err
	}

	return func() {
		_ = syscall.Flock(int(file.Fd()), syscall.LOCK_UN)
		file.Close()
	}, nil
}

// Pending is the staged connection of the folder, staged now with new random values when there is none, and written
// with mode 0600 before any call is made.
func (state ConnectionState) Pending(origin string) (PendingConnection, error) {
	var pending PendingConnection
	content, err := os.ReadFile(state.pendingPath())
	if err == nil {
		return pending, json.Unmarshal(content, &pending)
	}
	if !errors.Is(err, os.ErrNotExist) {
		return PendingConnection{}, err
	}

	pending = PendingConnection{Origin: origin, CanonicalRoot: state.CanonicalRoot}
	for _, value := range []struct {
		target *string
		bytes  int
	}{{&pending.RootID, rootIDBytes}, {&pending.HostCredential, credentialBytes}, {&pending.InstallationNonce, nonceBytes}} {
		random, err := randomText(value.bytes)
		if err != nil {
			return PendingConnection{}, err
		}
		*value.target = random
	}

	return pending, writePrivateJSON(state.pendingPath(), pending)
}

// SaveBinding keeps the redeemed binding and drops the staged connection it came from.
func (state ConnectionState) SaveBinding(binding Binding) error {
	if err := writePrivateJSON(state.bindingPath(), binding); err != nil {
		return err
	}

	return removePrivateFile(state.pendingPath())
}

// Binding is the folder's redeemed binding.
func (state ConnectionState) Binding() (Binding, error) {
	err := requireOwnerOnly(state.bindingPath(), secretFileMode)
	if errors.Is(err, os.ErrNotExist) {
		return Binding{}, ErrNotConnected
	}
	if err != nil {
		return Binding{}, err
	}
	content, err := os.ReadFile(state.bindingPath())
	if err != nil {
		return Binding{}, err
	}
	var binding Binding

	return binding, json.Unmarshal(content, &binding)
}

// folder is the connection's own private folder, named by a digest of the canonical root so the path never appears.
func (state ConnectionState) folder() string {
	digest := sha256.Sum256([]byte(state.CanonicalRoot))

	return filepath.Join(state.Folder, connectionsFolderName, hex.EncodeToString(digest[:16]))
}

func (state ConnectionState) pendingPath() string { return filepath.Join(state.folder(), pendingName) }

func (state ConnectionState) bindingPath() string { return filepath.Join(state.folder(), bindingName) }

func randomText(size int) (string, error) {
	random := make([]byte, size)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(random), nil
}
