package localsession

import (
	"errors"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"journal-agent/host"
)

// credentialName is the one file of a Claude Code sign-in a session needs, as it keeps it under CLAUDE_CONFIG_DIR
// when the no-keychain shim refuses the Keychain.
const credentialName = ".credentials.json"

// ClaudeAccount is a binding's isolated Claude Code sign-in, kept in the host's private state per sign-in
// generation; the personal ~/.claude folder and the Keychain login are never read.
type ClaudeAccount struct {
	StateFolder string
	BindingID   string
}

// Generation is the current sign-in generation; a logout starts the next one.
func (account ClaudeAccount) Generation() int {
	content, err := os.ReadFile(account.generationFile())
	if err != nil {
		return 1
	}
	generation, err := strconv.Atoi(strings.TrimSpace(string(content)))
	if err != nil {
		return 1
	}

	return generation
}

// IsSignedIn is whether the current generation holds a kept sign-in.
func (account ClaudeAccount) IsSignedIn() bool {
	_, err := os.Stat(account.credentialPath())

	return err == nil
}

// Provide gives a new session's Claude Code configuration folder only the credential it needs, when one is kept;
// a signed-out session signs in inside its own isolated folder.
func (account ClaudeAccount) Provide(configFolder string) error {
	content, err := os.ReadFile(account.credentialPath())
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}

	return host.WritePrivateFile(filepath.Join(configFolder, credentialName), content)
}

// Keep takes the credential a session signed in with, or renewed, from its configuration folder into the current
// generation, apart from every session home.
func (account ClaudeAccount) Keep(configFolder string) error {
	content, err := os.ReadFile(filepath.Join(configFolder, credentialName))
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}

	return host.WritePrivateFile(account.credentialPath(), content)
}

// Logout ends the current generation: its credential is removed and the next session starts signed out.
func (account ClaudeAccount) Logout() error {
	if err := os.RemoveAll(account.generationFolder()); err != nil {
		return err
	}

	return host.WritePrivateFile(account.generationFile(), []byte(strconv.Itoa(account.Generation()+1)+"\n"))
}

func (account ClaudeAccount) folder() string {
	return filepath.Join(account.StateFolder, account.BindingID, "accounts", "claude-code")
}

func (account ClaudeAccount) generationFile() string {
	return filepath.Join(account.folder(), "generation")
}

func (account ClaudeAccount) generationFolder() string {
	return filepath.Join(account.folder(), strconv.Itoa(account.Generation()))
}

func (account ClaudeAccount) credentialPath() string {
	return filepath.Join(account.generationFolder(), credentialName)
}
