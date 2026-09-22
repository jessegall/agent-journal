from features.base import Feature
from features.close_from_commits.details import CommitsDetails
from features.close_from_commits.handlers import CloseRowsFromCommits
from features.journal import Journal


class Commits(Feature):
    details = CommitsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(CloseRowsFromCommits())
