package main

import (
	"fmt"
	"io"

	"github.com/jessegall/agent-journal/tools/journal/launch"
)

// WorktreeCommand is `journal worktree list` and `journal worktree remove <name>` for the project's launch worktrees.
func WorktreeCommand(argv []string, stdout, stderr io.Writer) int {
	folder := WorkingFolder()
	root, err := launch.ProjectRoot(folder)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	environments, err := launchJournal().Environments()
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	worktrees := launch.Worktrees{Root: root}
	switch {
	case len(argv) == 1 && argv[0] == "list":
		for _, line := range worktrees.ListLines(environments) {
			fmt.Fprintln(stdout, line)
		}
		return SuccessCode
	case len(argv) == 2 && argv[0] == "remove":
		if err := worktrees.DiscardNamed(argv[1], environments); err != nil {
			fmt.Fprintln(stderr, err)
			return ErrorCode
		}
		fmt.Fprintf(stdout, "the worktree %s is removed; its branch %s%s and its last commit stay\n", argv[1], launch.BranchPrefix, argv[1])
		return SuccessCode
	}
	fmt.Fprintln(stderr, "usage: journal worktree list, or journal worktree remove <name>")
	return UsageCode
}
