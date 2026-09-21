from features.base import Feature
from features.commits.details import CommitsDetails
from features.commits.handlers import CloseRowsFromCommits
from features.journal import Journal


class Commits(Feature):
    details = CommitsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(CloseRowsFromCommits())
