package launch

// ListLines are the lines of journal worktree list: each launch worktree, and those whose environment is gone marked so.
func (worktrees Worktrees) ListLines(environments []Environment) []string {
	names := []string{}
	for _, environment := range environments {
		names = append(names, environment.Name)
	}
	orphans := worktrees.Orphans(names)
	lines := []string{}
	for _, name := range worktrees.folderNames() {
		if indexOf(orphans, name) >= 0 {
			lines = append(lines, name+"  its environment is gone: journal worktree remove "+name+" removes the folder, the branch stays")
			continue
		}
		lines = append(lines, name)
	}
	return lines
}

// DiscardNamed removes the launch worktree of that name at the user's word, refused while a live session holds its environment.
func (worktrees Worktrees) DiscardNamed(name string, environments []Environment) error {
	for _, environment := range environments {
		if environment.Name == name && environment.Working {
			return worktrees.Discard(name, true)
		}
	}
	return worktrees.Discard(name, false)
}
