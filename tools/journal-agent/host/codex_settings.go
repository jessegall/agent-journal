package host

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"path/filepath"

	"journal-agent/profiles/contracts"
)

// CodexPreparation prepares a saved Codex account for one more thread through the protected installation's PHP and
// its prepare-codex entrypoint, which owns config.toml's lock and its atomic replacement.
type CodexPreparation struct {
	PHP    string
	Script string
}

// CodexRootRequest is one root to prepare: the account, the journal's working roots folder, the new root's name,
// and the account's hooks with the tables that trust them.
type CodexRootRequest struct {
	Account      string
	WorkingRoots string
	Root         string
	Hooks        []byte
	HookTables   []string
	Transport    contracts.TransportProfile
}

// CodexPreparationOf is the preparation the installation's PHP and entrypoint run.
func CodexPreparationOf(installation Installation) CodexPreparation {
	return CodexPreparation{
		PHP:    installation.Path("bin/php"),
		Script: installation.Path(filepath.Join("journal", "tools", "accounts", "prepare-codex.php")),
	}
}

// PrepareRoot writes the account's hooks.json, has the entrypoint make the empty root and trust exactly it beside
// every entry the account's config.toml already holds, and answers the root's path.
func (preparation CodexPreparation) PrepareRoot(ctx context.Context, request CodexRootRequest) (string, error) {
	if err := WritePrivateFile(filepath.Join(request.Account, "hooks.json"), request.Hooks); err != nil {
		return "", err
	}
	transport := request.Transport
	if transport == "" {
		transport = contracts.McpTransport
	}
	line, err := json.Marshal(map[string]any{
		"account": request.Account, "working_roots": request.WorkingRoots, "root": request.Root,
		"tables": request.HookTables, "transport_profile": transport,
	})
	if err != nil {
		return "", err
	}
	command := exec.CommandContext(ctx, preparation.PHP, preparation.Script)
	command.Stdin = bytes.NewReader(append(line, '\n'))
	command.Env = []string{"PATH=" + systemPath}
	var output, failure bytes.Buffer
	command.Stdout, command.Stderr = &output, &failure
	if err := command.Run(); err != nil {
		return "", fmt.Errorf("the Codex account was not prepared: %w: %s", err, failure.String())
	}
	var answer struct {
		Root string `json:"root"`
	}
	if err := json.Unmarshal(output.Bytes(), &answer); err != nil || answer.Root == "" {
		return "", fmt.Errorf("the Codex preparation answered no root: %s", output.String())
	}
	return answer.Root, nil
}
