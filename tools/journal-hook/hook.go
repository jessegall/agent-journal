package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// hookContext reads what the hook knows besides its body, as hook.sh does; skip says the hook is not the journal's:
// the journal is not on for this shell, or the actor is one whose hooks never reach it.
func hookContext(getenv func(string) string, root, folder string, processID int, started time.Time) (programs.Context, bool) {
	if getenv("AGENT_JOURNAL_ACTIVE") != "1" {
		return programs.Context{}, true
	}
	actor := getenv("JOURNAL_ACTOR")
	if actor == "" {
		actor = "agent"
	}
	if !isJournalActor(actor) {
		return programs.Context{}, true
	}
	environment := getenv("JOURNAL_ENV")
	if environment == "" {
		environment = localEnvironment(folder)
	}
	firedAtMs := started.UnixMilli()
	return programs.Context{
		Environment: environment,
		Actor:       actor,
		Firing:      fmt.Sprintf("%d-%d", processID, firedAtMs),
		FiredAtMs:   firedAtMs,
		RunScript:   filepath.Join(root, ".journal", "src", "journal", "hooks", "run.sh"),
		Classifier:  classify.NewClassifier(classify.LoadTable(filepath.Join(root, ".journal", "command_table.json"))),
		Launch:      os.Getenv("JOURNAL_LAUNCH"),
	}, false
}

// The actors whose hooks reach the journal: the agent, and a worker, verifier or reviewer it sent.
func isJournalActor(actor string) bool {
	if actor == "agent" {
		return true
	}
	for _, prefix := range []string{"worker:", "verifier:", "reviewer:"} {
		if !strings.HasPrefix(actor, prefix) {
			continue
		}
		return true
	}
	return false
}

// localEnvironment is environment.sh's journal_local_environment read from the files git keeps, with no git process:
// inside a linked worktree, the worktree folder's name; inside the main checkout or outside any repository, main.
func localEnvironment(folder string) string {
	for current := folder; ; current = filepath.Dir(current) {
		marker := filepath.Join(current, ".git")
		if details, err := os.Stat(marker); err == nil {
			if details.IsDir() || !isLinkedWorktree(marker) {
				return "main"
			}
			return filepath.Base(current)
		}
		if filepath.Dir(current) == current {
			return "main"
		}
	}
}

// A .git file points at the folder git keeps a checkout's state in; that folder holds a commondir file only for a
// linked worktree, never for a submodule.
func isLinkedWorktree(gitFile string) bool {
	text, err := os.ReadFile(gitFile)
	if err != nil {
		return false
	}
	gitDir := strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(string(text)), "gitdir:"))
	if !filepath.IsAbs(gitDir) {
		gitDir = filepath.Join(filepath.Dir(gitFile), gitDir)
	}
	_, err = os.Stat(filepath.Join(gitDir, "commondir"))
	return err == nil
}
