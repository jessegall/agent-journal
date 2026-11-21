// Package project sets up a project folder connected to a server journal: its .journal folder, the hook entry
// points it runs and the rule that keeps .journal out of Git.
package project

import (
	"bytes"
	"encoding/json"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"

	"journal-agent/host"
	"journal-agent/release"
)

const (
	journalFolderName  = ".journal"
	connectionName     = "connection.json"
	hooksFolderName    = "hooks"
	setupName          = "setup.json"
	ignoreRule         = "/.journal/"
	privateFolderMode  = 0o700
	stepConnection     = "connection"
	stepHooks          = "hooks"
	stepIgnore         = "ignore"
	hookEntryProgram   = "bin/journal-hook"
	hookTemplateFolder = "hooks"
)

// ErrNotConnected is returned for a folder whose connection.json no private state of this machine matches, such as a
// copy of a connected folder.
var ErrNotConnected = errors.New("this folder is not connected to a journal")

// Connection is what .journal/connection.json holds: identifiers only, never a credential.
type Connection struct {
	Protocol  int    `json:"protocol"`
	BindingID string `json:"binding"`
	ProjectID string `json:"project"`
	HostID    string `json:"host"`
	Origin    string `json:"origin"`
	RootID    string `json:"rootId"`
}

// ConnectionOf is the connection a redeemed binding writes into its folder.
func ConnectionOf(binding host.Binding, protocol int) Connection {
	return Connection{
		Protocol:  protocol,
		BindingID: binding.BindingID,
		ProjectID: binding.ProjectID,
		HostID:    binding.HostID,
		Origin:    binding.JournalURL,
		RootID:    binding.RootID,
	}
}

// ErrRootMoved is returned for a folder whose connection belongs to a binding redeemed in another folder: the
// project moved, or the folder is a copy. Work never starts there.
var ErrRootMoved = errors.New("this folder was connected in another place")

// Find is the nearest folder at or above the start whose .journal holds a connection.json, with its links
// resolved, and that connection; ErrNotConnected when no folder up to the root holds one.
func Find(start string) (Folder, Connection, error) {
	folder, err := filepath.EvalSymlinks(start)
	if err != nil {
		return Folder{}, Connection{}, err
	}
	for {
		connection, err := Folder{Root: folder}.Marker()
		if err == nil {
			return Folder{Root: folder}, connection, nil
		}
		if !errors.Is(err, ErrNotConnected) {
			return Folder{}, Connection{}, err
		}
		if filepath.Dir(folder) == folder {
			return Folder{}, Connection{}, ErrNotConnected
		}
		folder = filepath.Dir(folder)
	}
}

// Folder is a connected project folder, by its canonical root.
type Folder struct {
	Root string
}

// setupProgress is .journal/setup.json: the steps a setup finished, so a rerun finishes what an interrupted one left.
type setupProgress struct {
	Done []string `json:"done"`
	// IgnoreAddition is the exact text setup appended to .gitignore, so disconnecting can take it out unchanged.
	IgnoreAddition string `json:"ignoreAddition,omitempty"`
	// Generation rises on every setup or resume, so only a relay report of the current setup can make it ready.
	Generation int `json:"generation"`
}

// SetUp writes the connection, the hook entry points of the verified installation and the ignore rule, each step
// recorded once it is done; the caller holds the root's lock. A step already done is not done again, and the ignore
// file is never staged.
func (folder Folder) SetUp(connection Connection, installation host.Installation) error {
	if err := os.MkdirAll(folder.journalFolder(), privateFolderMode); err != nil {
		return err
	}

	progress := folder.progress()
	progress.Generation++
	if err := writeJSON(folder.path(setupName), progress); err != nil {
		return err
	}
	steps := []struct {
		name string
		run  func() error
	}{
		{stepConnection, func() error { return folder.writeConnection(connection) }},
		{stepHooks, func() error { return folder.writeHooks(installation) }},
		{stepIgnore, func() error {
			addition, err := folder.ignoreJournalFolder()
			progress.IgnoreAddition = addition

			return err
		}},
	}
	for _, step := range steps {
		if slices.Contains(progress.Done, step.name) {
			continue
		}
		if err := step.run(); err != nil {
			return err
		}
		progress.Done = append(progress.Done, step.name)
		if err := writeJSON(folder.path(setupName), progress); err != nil {
			return err
		}
	}

	return nil
}

// IsSetUp is whether every step of the folder's setup is done.
func (folder Folder) IsSetUp() bool {
	progress := folder.progress()
	for _, step := range []string{stepConnection, stepHooks, stepIgnore} {
		if !slices.Contains(progress.Done, step) {
			return false
		}
	}

	return true
}

// SetupGeneration is the generation of the folder's latest setup or resume; none before the first.
func (folder Folder) SetupGeneration() int {
	return folder.progress().Generation
}

// Connected is the folder's connection when the private state of this machine holds the same binding for this very
// root; a connection.json copied elsewhere, or one the state does not know, is not connected.
func (folder Folder) Connected(state host.ConnectionState) (Connection, error) {
	connection, err := folder.Marker()
	if err != nil {
		return Connection{}, err
	}

	binding, err := host.ConnectionState{Folder: state.Folder, CanonicalRoot: folder.Root}.Binding()
	if err != nil || binding.BindingID != connection.BindingID || binding.RootID != connection.RootID {
		return Connection{}, ErrNotConnected
	}

	return connection, nil
}

// Marker is what the folder's connection.json holds, the binding it names; ErrNotConnected without one.
func (folder Folder) Marker() (Connection, error) {
	content, err := os.ReadFile(folder.path(connectionName))
	if errors.Is(err, os.ErrNotExist) {
		return Connection{}, ErrNotConnected
	}
	if err != nil {
		return Connection{}, err
	}
	var connection Connection

	return connection, json.Unmarshal(content, &connection)
}

func (folder Folder) writeConnection(connection Connection) error {
	return writeJSON(folder.path(connectionName), connection)
}

// writeHooks writes each provider's hook template of the installation with its sealed hook entry point filled in.
func (folder Folder) writeHooks(installation host.Installation) error {
	verified, err := installation.Verify()
	if err != nil {
		return err
	}

	entry := installation.Path(hookEntryProgram)
	for _, artifact := range verified {
		if !strings.HasPrefix(artifact.Name, hookTemplateFolder+"/") {
			continue
		}
		template, err := os.ReadFile(artifact.Path)
		if err != nil {
			return err
		}
		filled := bytes.ReplaceAll(template, []byte(release.HookEntryPlaceholder), []byte(entry))
		target := folder.path(filepath.Join(hooksFolderName, strings.TrimPrefix(artifact.Name, hookTemplateFolder+"/")))
		if err := host.WritePrivateFile(target, filled); err != nil {
			return err
		}
	}

	return nil
}

// ignoreJournalFolder appends /.journal/ to the root's .gitignore, in its own line endings, unless Git already
// ignores .journal there, later negations included. A folder outside Git needs no rule.
func (folder Folder) ignoreJournalFolder() (string, error) {
	if exec.Command("git", "-C", folder.Root, "rev-parse", "--git-dir").Run() != nil {
		return "", nil
	}
	if exec.Command("git", "-C", folder.Root, "check-ignore", "-q", journalFolderName+"/").Run() == nil {
		return "", nil
	}

	path := filepath.Join(folder.Root, ".gitignore")
	existing, err := os.ReadFile(path)
	if err != nil && !errors.Is(err, os.ErrNotExist) {
		return "", err
	}

	ending := "\n"
	if bytes.Contains(existing, []byte("\r\n")) {
		ending = "\r\n"
	}
	addition := ignoreRule + ending
	if len(existing) > 0 && !bytes.HasSuffix(existing, []byte("\n")) {
		addition = ending + addition
	}

	file, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return "", err
	}
	if _, err := file.WriteString(addition); err != nil {
		file.Close()
		return "", err
	}

	return addition, file.Close()
}

// ForgetIgnoreRule takes the rule setup added back out of .gitignore when the file still ends with it as written,
// and removes a .gitignore that held nothing else, answering whether it did; a changed file keeps the rule. A folder
// whose worktrees are kept keeps it too, by not asking.
func (folder Folder) ForgetIgnoreRule() (bool, error) {
	addition := folder.progress().IgnoreAddition
	if addition == "" {
		return false, nil
	}
	path := filepath.Join(folder.Root, ".gitignore")
	content, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return false, nil
	}
	if err != nil || !bytes.HasSuffix(content, []byte(addition)) {
		return false, err
	}
	rest := bytes.TrimSuffix(content, []byte(addition))
	if len(rest) == 0 {
		return true, os.Remove(path)
	}

	return true, os.WriteFile(path, rest, 0o644)
}

func (folder Folder) progress() setupProgress {
	var progress setupProgress
	content, err := os.ReadFile(folder.path(setupName))
	if err != nil {
		return setupProgress{}
	}
	if json.Unmarshal(content, &progress) != nil {
		return setupProgress{}
	}

	return progress
}

func (folder Folder) journalFolder() string { return filepath.Join(folder.Root, journalFolderName) }

func (folder Folder) path(name string) string { return filepath.Join(folder.journalFolder(), name) }

func writeJSON(path string, value any) error {
	content, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return host.WritePrivateFile(path, content)
}

// Disconnect removes what setup owns in the folder: connection.json, the hook entry points, the session state and
// the setup record. The .gitignore rule is ForgetIgnoreRule's, asked first; worktrees and their receipts are left to
// the worktree retirement that runs before it.
func (folder Folder) Disconnect() error {
	for _, owned := range []string{connectionName, setupName, hooksFolderName, "sessions"} {
		if err := os.RemoveAll(folder.path(owned)); err != nil {
			return err
		}
	}

	return nil
}

// Identity is what a folder's own journal files say it is, against this machine's private state for its root.
type Identity string

const (
	// IdentityNone: the folder holds no journal setup and no kept worktree.
	IdentityNone Identity = "none"
	// IdentityOwn: its connection.json is of the binding this machine keeps for this very root.
	IdentityOwn Identity = "own"
	// IdentityForeign: its connection.json or setup record belongs to no binding of this root on this machine: the
	// folder was moved or copied, so none of that setup is resumed.
	IdentityForeign Identity = "foreign"
	// IdentityRetained: only worktrees or receipts a disconnect kept are left, which a new connection keeps as they are.
	IdentityRetained Identity = "retained"
)

// IdentityAgainst compares the folder's marker and setup record with the binding this machine keeps for its root.
func (folder Folder) IdentityAgainst(state host.ConnectionState) Identity {
	if _, err := folder.Connected(state); err == nil {
		return IdentityOwn
	}
	_, markerErr := folder.Marker()
	if markerErr == nil || len(folder.progress().Done) > 0 {
		return IdentityForeign
	}
	if len(folder.RetainedWorktrees()) > 0 {
		return IdentityRetained
	}

	return IdentityNone
}

// RetainedWorktrees are the worktree folders and receipts left under .journal, recognized with or without a
// connection.json; they are a kept worktree's, never a sign of an older install.
func (folder Folder) RetainedWorktrees() []string {
	worktrees, _ := filepath.Glob(filepath.Join(folder.journalFolder(), "worktrees", "*"))
	receipts, _ := filepath.Glob(filepath.Join(folder.journalFolder(), "receipts", "*.json"))

	return append(worktrees, receipts...)
}

// ForgetReceipts removes the worktree receipts once no kept worktree needs them to prove whose it is.
func (folder Folder) ForgetReceipts() error {
	return os.RemoveAll(folder.path("receipts"))
}
