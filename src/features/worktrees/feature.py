from features.base import Feature
from features.journal import Journal
from features.worktrees.details import WorktreesDetails
from features.worktrees.interceptors import LinkWorktreeJournal


class Worktrees(Feature):
    details = WorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(LinkWorktreeJournal())
