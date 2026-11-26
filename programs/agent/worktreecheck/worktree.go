// Package worktreecheck is the protected stop check a helper's work must pass before it may finish: the assigned
// workspace holds nothing uncommitted and no git state that hides work. It changes nothing in the workspace. A clean
// worktree does not prove the committed code is safe or correct, only that nothing was left uncommitted.
package worktreecheck

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"unicode"
)

// mostPaths is the most paths a problem names before it counts the rest.
const mostPaths = 5

// operationMarkers are the files of a git folder that show an operation in progress, by what they show.
var operationMarkers = []struct{ marker, operation string }{
	{"MERGE_HEAD", "a merge"}, {"CHERRY_PICK_HEAD", "a cherry-pick"}, {"REVERT_HEAD", "a revert"},
	{"rebase-merge", "a rebase"}, {"rebase-apply", "a rebase"},
}

// Problems are what keeps the workspace from being clean, empty for a clean one; expectedBranch is the branch the
// work must sit on, empty for any.
func Problems(workspace, expectedBranch string) []string {
	if inside, code := git(workspace, "rev-parse", "--is-inside-work-tree"); code != 0 || strings.TrimSpace(inside) != "true" {
		return []string{workspace + " is not a git worktree, or git could not read it."}
	}

	gitFolder, _ := git(workspace, "rev-parse", "--absolute-git-dir")
	problems := operationsInProgress(strings.TrimSpace(gitFolder))

	branch, code := git(workspace, "symbolic-ref", "-q", "--short", "HEAD")
	switch {
	case code != 0:
		problems = append(problems, "HEAD is detached: work must sit on the assigned branch.")
	case expectedBranch != "" && strings.TrimSpace(branch) != expectedBranch:
		problems = append(problems, fmt.Sprintf("The worktree is on branch %s, not the assigned %s.", strings.TrimSpace(branch), expectedBranch))
	}

	status, code := git(workspace, "status", "--porcelain=v1", "-z", "--untracked-files=all", "--ignore-submodules=none")
	if code != 0 {
		return append(problems, "git status failed in the worktree.")
	}

	problems = append(problems, statusProblems(status)...)

	return append(problems, hiddenPaths(workspace)...)
}

func operationsInProgress(gitFolder string) []string {
	problems := []string{}
	seen := map[string]bool{}
	for _, marker := range operationMarkers {
		if _, err := os.Stat(filepath.Join(gitFolder, marker.marker)); err == nil && !seen[marker.operation] {
			problems = append(problems, marker.operation+" is in progress: finish or abort it.")
			seen[marker.operation] = true
		}
	}

	return problems
}

// statusLabels name each kind of change git status reports, in the order they are told.
var statusLabels = []struct{ group, label string }{
	{"conflict", "Conflicted"}, {"staged", "Staged but not committed"}, {"deleted", "Deleted tracked file"},
	{"modified", "Changed and not committed"}, {"untracked", "Untracked"},
}

// statusProblems are what git status reports, grouped by kind, each naming at most a few paths.
func statusProblems(status string) []string {
	groups := map[string][]string{}
	entries := nonEmpty(strings.Split(status, "\x00"))
	for index := 0; index < len(entries); index++ {
		entry := entries[index]
		if len(entry) < 4 {
			continue
		}
		code, path := entry[:2], entry[3:]
		if code[0] == 'R' || code[0] == 'C' {
			index++
		}
		groups[groupOf(code)] = append(groups[groupOf(code)], path)
	}

	problems := []string{}
	for _, kind := range statusLabels {
		if paths := groups[kind.group]; len(paths) > 0 {
			problems = append(problems, kind.label+": "+namedPaths(paths))
		}
	}

	return problems
}

func groupOf(code string) string {
	switch {
	case code == "??":
		return "untracked"
	case strings.Contains(code, "U") || code == "AA" || code == "DD":
		return "conflict"
	case code[1] == 'D':
		return "deleted"
	case code[0] != ' ':
		return "staged"
	}

	return "modified"
}

// hiddenPaths are the tracked files git is told to skip or assume unchanged, which status never shows.
func hiddenPaths(workspace string) []string {
	listing, code := git(workspace, "ls-files", "-v", "-z")
	if code != 0 {
		return []string{"git could not list the tracked files."}
	}

	hidden := []string{}
	for _, entry := range nonEmpty(strings.Split(listing, "\x00")) {
		if tag := rune(entry[0]); len(entry) > 2 && (tag == 'S' || unicode.IsLower(tag)) {
			hidden = append(hidden, entry[2:])
		}
	}
	if len(hidden) == 0 {
		return nil
	}

	return []string{"Marked skip-worktree or assume-unchanged: " + namedPaths(hidden)}
}

func namedPaths(paths []string) string {
	if len(paths) <= mostPaths {
		return strings.Join(paths, ", ")
	}

	return fmt.Sprintf("%s and %d more", strings.Join(paths[:mostPaths], ", "), len(paths)-mostPaths)
}

func nonEmpty(entries []string) []string {
	kept := []string{}
	for _, entry := range entries {
		if entry != "" {
			kept = append(kept, entry)
		}
	}

	return kept
}

// git runs git in the workspace with a sanitized environment and configuration: no system or global config, no
// hooks, no optional locks, no external diff and no credential helper. It answers the output and the exit code.
func git(workspace string, arguments ...string) (string, int) {
	emptyHooks := filepath.Join(os.TempDir(), "journal-check-no-hooks")
	_ = os.MkdirAll(emptyHooks, 0o700)
	argv := append([]string{"-C", workspace, "-c", "core.hooksPath=" + emptyHooks, "-c", "credential.helper=",
		"-c", "diff.external=", "-c", "core.fsmonitor=false"}, arguments...)
	command := exec.Command("git", argv...)
	command.Env = []string{"PATH=/usr/local/bin:/usr/bin:/bin", "HOME=" + os.TempDir(), "GIT_CONFIG_NOSYSTEM=1",
		"GIT_CONFIG_GLOBAL=/dev/null", "GIT_OPTIONAL_LOCKS=0", "GIT_TERMINAL_PROMPT=0", "LC_ALL=C"}
	var output bytes.Buffer
	command.Stdout = &output
	if err := command.Run(); err != nil {
		if exited, isExit := err.(*exec.ExitError); isExit {
			return output.String(), exited.ExitCode()
		}

		return "", 127
	}

	return output.String(), 0
}
