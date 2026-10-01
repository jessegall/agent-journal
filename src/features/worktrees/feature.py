from features.base import Feature
from features.journal import Journal
from features.worktrees.details import WorktreesDetails
from features.worktrees.handlers import LinkWorktreeJournal


class Worktrees(Feature):
    details = WorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LinkWorktreeJournal())
