package host

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"
)

const (
	connectionsFolderName = "connections"
	pendingName           = "pending.json"
	bindingName           = "binding.json"
	lockName              = "lock"
	relayLockName         = "relay.lock"
	relayReportName       = "relay.json"
	deviceGrantName       = "device-grant"
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
	ProjectID     string `json:"project_id"`
	BindingID     string `json:"binding_id"`
	MainAgentID   string `json:"main_agent_id"`
	RootID        string `json:"root_id"`
	CanonicalRoot string `json:"canonical_root"`
}

// RelayReport is what the binding's relay last had acknowledged: its boot, the generation the journal holds for it
// and when that presence expires. connect waits for the first one.
type RelayReport struct {
	BootID     string    `json:"boot_id"`
	Generation int       `json:"generation"`
	ReportedAt time.Time `json:"reported_at"`
	ExpiresAt  time.Time `json:"expires_at"`
}

// ConnectionState is the private state of one project folder's connection, inside the host's state folder and
// outside the project, keyed by the folder's canonical root.
type ConnectionState struct {
	Folder        string
	CanonicalRoot string
}

// ErrNotConnected is returned for a folder whose connection holds no binding yet.
var ErrNotConnected = errors.New("this folder is not connected to a journal")

// ErrRelayRunning is returned when another relay already holds the binding.
var ErrRelayRunning = errors.New("a relay already runs for this binding")

// ConnectionOfBinding is the private state of the folder that redeemed this binding.
func ConnectionOfBinding(stateFolder string, bindingID string) (ConnectionState, Binding, error) {
	folders, err := filepath.Glob(filepath.Join(stateFolder, connectionsFolderName, "*", bindingName))
	if err != nil {
		return ConnectionState{}, Binding{}, err
	}
	for _, path := range folders {
		var binding Binding
		content, err := os.ReadFile(path)
		if err != nil || json.Unmarshal(content, &binding) != nil || binding.BindingID != bindingID {
			continue
		}

		return ConnectionState{Folder: stateFolder, CanonicalRoot: binding.CanonicalRoot}, binding, nil
	}

	return ConnectionState{}, Binding{}, ErrNotConnected
}

// LockRelay holds the binding for one relay until the returned unlock runs; a second relay gets ErrRelayRunning at
// once instead of waiting.
func (state ConnectionState) LockRelay() (func(), error) {
	file, err := os.OpenFile(filepath.Join(state.folder(), relayLockName), os.O_CREATE|os.O_RDWR, secretFileMode)
	if err != nil {
		return nil, err
	}
	if err := syscall.Flock(int(file.Fd()), syscall.LOCK_EX|syscall.LOCK_NB); err != nil {
		file.Close()
		return nil, ErrRelayRunning
	}

	return func() {
		_ = syscall.Flock(int(file.Fd()), syscall.LOCK_UN)
		file.Close()
	}, nil
}

// Remove removes this folder's private connection state: its binding, credential, device grant and relay record.
func (state ConnectionState) Remove() error {
	return os.RemoveAll(state.folder())
}

// RemainingBindings is how many connected folders this machine's state still holds.
func RemainingBindings(stateFolder string) int {
	folders, err := filepath.Glob(filepath.Join(stateFolder, connectionsFolderName, "*", bindingName))
	if err != nil {
		return 0
	}

	return len(folders)
}

// RelayIsRunning is whether a relay holds the binding now.
func (state ConnectionState) RelayIsRunning() bool {
	unlock, err := state.LockRelay()
	if err != nil {
		return true
	}
	unlock()

	return false
}

// StartRelay starts the binding's relay detached with the journal-agent program given, as this user, its output in
// the private state folder.
func StartRelay(program string, stateFolder string, bindingID string) error {
	logPath := filepath.Join(stateFolder, "relay-"+bindingID+".log")
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, secretFileMode)
	if err != nil {
		return err
	}
	defer logFile.Close()

	command := exec.Command(program, "relay", "--binding", bindingID, "--state", stateFolder)
	command.Stdout = logFile
	command.Stderr = logFile
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := command.Start(); err != nil {
		return err
	}

	return command.Process.Release()
}

// SaveDeviceGrant keeps a shell user's device grant for the binding, privately.
func (state ConnectionState) SaveDeviceGrant(grant string) error {
	return WritePrivateFile(filepath.Join(state.folder(), deviceGrantName), []byte(grant))
}

// DeviceGrant is the shell user's kept device grant; ErrNotConnected while there is none.
func (state ConnectionState) DeviceGrant() (string, error) {
	content, err := os.ReadFile(filepath.Join(state.folder(), deviceGrantName))
	if errors.Is(err, os.ErrNotExist) {
		return "", ErrNotConnected
	}

	return string(content), err
}

// SaveRelayReport keeps the relay's last acknowledged presence report.
func (state ConnectionState) SaveRelayReport(report RelayReport) error {
	return writePrivateJSON(filepath.Join(state.folder(), relayReportName), report)
}

// RelayReport is the relay's last acknowledged presence report; ErrNotConnected while it has none.
func (state ConnectionState) RelayReport() (RelayReport, error) {
	content, err := os.ReadFile(filepath.Join(state.folder(), relayReportName))
	if errors.Is(err, os.ErrNotExist) {
		return RelayReport{}, ErrNotConnected
	}
	if err != nil {
		return RelayReport{}, err
	}
	var report RelayReport

	return report, json.Unmarshal(content, &report)
}

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
