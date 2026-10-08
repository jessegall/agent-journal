from features.base import Feature
from features.close_from_commits.commands import SweepLanded
from features.close_from_commits.details import CloseFromCommitsDetails
from features.close_from_commits.handlers import CloseRowsFromCommits
from features.journal import Journal


class CloseFromCommits(Feature):
    details = CloseFromCommitsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(CloseRowsFromCommits())
        journal.commands.add("todo", SweepLanded())
