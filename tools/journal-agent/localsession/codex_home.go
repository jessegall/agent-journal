package localsession

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"

	"journal-agent/host"
	"journal-agent/profiles"
)

// ErrCodexWithheld withholds the local Codex target: codex-cli 0.165.0 gives a hook call no per-thread capability
// a trusted transport injects, and every thread of an account generation shares one hooks.json, so a callback's
// runtime could only be told from the names and cwd in its JSON, which never select a runtime.
var ErrCodexWithheld = errors.New("local Codex sessions are withheld: codex-cli 0.165.0 carries no per-thread " +
	"capability for its hook calls, so a callback cannot be bound to its own thread")

// ErrHookCommandChanged refuses a second hook command for an owner generation that already has one.
var ErrHookCommandChanged = errors.New("this Codex owner generation already runs another hook command")

// CodexHome is the private CODEX_HOME of one binding, account and sign-in generation, and the per-runtime prepared
// roots beside it, all in the host's private state folder, never in the project.
type CodexHome struct {
	StateFolder string
	BindingID   string
	Account     string
	Generation  int
}

// Folder is the generation's CODEX_HOME.
func (codex CodexHome) Folder() string {
	return filepath.Join(codex.StateFolder, codex.BindingID, "codex", codex.Account, strconv.Itoa(codex.Generation), "home")
}

// RootOf is the separate, empty working root prepared for one runtime's thread.
func (codex CodexHome) RootOf(runtimeID string) string {
	return filepath.Join(codex.StateFolder, codex.BindingID, "codex", "roots", runtimeID)
}

// Prepare writes the generation's hooks.json, running the hook adapter on every event, and its config.toml with
// every agent-spawning feature off and each hook trusted, under the generation's lock; a generation keeps the one
// hook command it was first prepared with. It makes the runtime's empty root and answers it.
func (codex CodexHome) Prepare(hookCommand string, runtimeID string) (string, error) {
	if err := os.MkdirAll(codex.Folder(), 0o700); err != nil {
		return "", err
	}
	unlock, err := lockFolder(codex.Folder())
	if err != nil {
		return "", err
	}
	defer unlock()

	hooks, tables, err := profiles.CodexAccountHooks(codex.Folder(), hookCommand)
	if err != nil {
		return "", err
	}
	if err := codex.keepHooks(hooks); err != nil {
		return "", err
	}
	config := "[features]\n" + strings.Join(profiles.CodexAgentFeaturesOff(), "\n") + "\n" + strings.Join(tables, "")
	if err := host.WritePrivateFile(filepath.Join(codex.Folder(), "config.toml"), []byte(config)); err != nil {
		return "", err
	}

	root := codex.RootOf(runtimeID)

	return root, os.MkdirAll(root, 0o700)
}

// keepHooks writes hooks.json the first time and refuses a different one after.
func (codex CodexHome) keepHooks(hooks []byte) error {
	path := filepath.Join(codex.Folder(), "hooks.json")
	existing, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return host.WritePrivateFile(path, hooks)
	}
	if err != nil {
		return err
	}
	if !bytes.Equal(existing, hooks) {
		return fmt.Errorf("%w: %s", ErrHookCommandChanged, codex.Folder())
	}

	return nil
}

// lockFolder holds the folder's lock file until the returned unlock runs, so writes to one generation never
// interleave.
func lockFolder(folder string) (func(), error) {
	file, err := os.OpenFile(filepath.Join(folder, ".lock"), os.O_CREATE|os.O_RDWR, 0o600)
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
