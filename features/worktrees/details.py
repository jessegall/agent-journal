from features.base import FeatureDetails


class WorktreesDetails(FeatureDetails):
    name = "worktrees"

    title = "Worktrees"

    speaks_while_waiting = True

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
    """

    runs_for_subagents = True
