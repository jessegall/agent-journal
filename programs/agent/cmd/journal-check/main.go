// Command journal-check runs the protected stop checks a helper's work must pass before it may finish, installed at
// /opt/journal/bin/journal-check. "journal-check worktree-clean" exits 0 only when the assigned workspace, /workspace
// or the one JOURNAL_CHECK_WORKSPACE names, has nothing uncommitted; otherwise 1 with a short summary.
package main

import (
	"fmt"
	"os"
	"strings"

	"journal-agent/worktreecheck"
)

// workspace is where the assigned workspace is in a helper's container.
const workspace = "/workspace"

// mostProblems is the most problems the check prints.
const mostProblems = 8

func main() {
	if len(os.Args) != 2 || os.Args[1] != "worktree-clean" {
		fmt.Fprintln(os.Stderr, "Usage: journal-check worktree-clean")
		fmt.Fprintln(os.Stderr, "Checks that the assigned workspace has nothing uncommitted. A clean worktree does not prove the committed code is safe.")
		os.Exit(2)
	}

	problems := worktreecheck.Problems(assignedWorkspace(), os.Getenv("JOURNAL_CHECK_BRANCH"))
	if len(problems) == 0 {
		fmt.Println("The worktree is clean.")
		return
	}

	if len(problems) > mostProblems {
		problems = problems[:mostProblems]
	}
	fmt.Println(strings.Join(problems, "\n"))
	os.Exit(1)
}

func assignedWorkspace() string {
	if named := os.Getenv("JOURNAL_CHECK_WORKSPACE"); named != "" {
		return named
	}

	return workspace
}
