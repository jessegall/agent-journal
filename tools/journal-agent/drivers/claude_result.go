package drivers

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"journal-agent/host"
	"os/exec"
	"path/filepath"
	"slices"
)

// ErrNotSignedIn refuses a Claude account start whose account is not signed in to claude.ai in its own folder: it
// never falls back to another sign-in or an API key.
var ErrNotSignedIn = errors.New("the Claude account is not signed in to claude.ai in its own folder")

// ErrProviderTurnFailed is the end of a turn whose program exited but whose result was an error, such as a refused
// sign-in or an API failure: the exit alone never makes a turn succeed.
var ErrProviderTurnFailed = errors.New("the program ended the turn with an error")

// claudeAuthStatus is what `claude auth status --json` of 2.1.323 answers (docs/accounts/claude-integration.md).
type claudeAuthStatus struct {
	LoggedIn        bool   `json:"loggedIn"`
	AuthMethod      string `json:"authMethod"`
	ConfigDirectory string `json:"configDirectory"`
}

// CheckClaudeSignIn asks the protected executable, in the start's own environment and with the files it reads,
// whether the account is signed in by one of the journal's methods in exactly its folder. Nothing it prints is kept
// beyond those three fields.
func CheckClaudeSignIn(
	ctx context.Context,
	executable string,
	environment []string,
	readFiles []string,
	accountFolder string,
) error {
	command := exec.CommandContext(ctx, executable, "auth", "status", "--json")
	command.Env = environment
	files, err := host.OpenReadFiles(readFiles)
	if err != nil {
		return errors.Join(ErrNotSignedIn, err)
	}
	defer host.CloseFiles(files)
	command.ExtraFiles = files
	output, err := command.Output()
	if err != nil && len(output) == 0 {
		return errors.Join(ErrNotSignedIn, err)
	}
	var status claudeAuthStatus
	if err := json.Unmarshal(output, &status); err != nil {
		return errors.Join(ErrNotSignedIn, err)
	}
	if !status.isSignedInAt(accountFolder) {
		return ErrNotSignedIn
	}
	return nil
}

// accountAuthMethods are the authMethod values of the journal's Claude sign-in methods: OAuth, a provider token read
// from a descriptor, and an API key from the folder's apiKeyHelper.
var accountAuthMethods = []string{"claude.ai", "oauth_token", "api_key_helper"}

// isSignedInAt is whether the status is a sign-in by one of the journal's methods kept in the account's own folder.
func (status claudeAuthStatus) isSignedInAt(accountFolder string) bool {
	return status.LoggedIn && slices.Contains(accountAuthMethods, status.AuthMethod) &&
		filepath.Clean(status.ConfigDirectory) == filepath.Clean(accountFolder)
}

// claudeResult is the last result line of a stream-json turn.
type claudeResult struct {
	Type      string `json:"type"`
	Subtype   string `json:"subtype"`
	IsError   bool   `json:"is_error"`
	SessionID string `json:"session_id"`
}

// readClaudeResult reads a turn's stream-json output to its end and answers ErrProviderTurnFailed when its result
// was an error or never came; the output itself is not kept.
func readClaudeResult(output io.Reader) error {
	scanner := bufio.NewScanner(output)
	scanner.Buffer(make([]byte, 64*1024), 16*1024*1024)
	var last *claudeResult
	for scanner.Scan() {
		var line claudeResult
		if json.Unmarshal(scanner.Bytes(), &line) == nil && line.Type == "result" {
			last = &line
		}
	}
	if err := scanner.Err(); err != nil {
		return errors.Join(ErrProviderTurnFailed, err)
	}
	if last == nil {
		return fmt.Errorf("%w: no result", ErrProviderTurnFailed)
	}
	if last.IsError || last.Subtype != "success" {
		return fmt.Errorf("%w: %s", ErrProviderTurnFailed, last.Subtype)
	}
	return nil
}
