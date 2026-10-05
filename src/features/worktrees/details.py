from features.base import FeatureDetails
from features.groups import Group


class WorktreesDetails(FeatureDetails):
    name = "worktrees"
    group = Group.SESSIONS
    label = "Link worktrees to the project's journal"
    has_skill = False

    title = "Worktrees use the project's journal"


    abstract = """
        A git worktree of the project uses the project's journal. A worktree without a journal of
        its own gets a link to it.
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

