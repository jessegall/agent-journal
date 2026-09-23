from features.base import FeatureDetails


class WorktreesDetails(FeatureDetails):
    name = "worktrees"

    title = "Worktrees"


    abstract = """
        A git worktree of the project works from the project's journal: one with no journal of
        its own gets a link to it
    """

    help = """
        When an agent or a subagent works in a linked git worktree that has no .journal, the
        journal links the worktree's .journal to the project's own, so every agent in every
        worktree writes one record. The link is kept out of git through the repository's
        exclude file.

        A worktree that carries a .journal of its own is left alone.

        journal claude -w NAME makes the worktree itself, on the branch worktree-NAME, and starts
        the agent inside it, so the agent never removes it. Each launch keeps the branch's last
        commit under refs/journal/worktrees/NAME: a worktree removed later, even with its branch,
        comes back with that work at the next journal claude -w NAME.
    """

    runs_for_subagents = True
