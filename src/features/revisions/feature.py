from features.base import Feature
from features.journal import Journal
from features.revisions.commands import Cut, Keep, Revision, Revisions
from features.revisions.details import RevisionsDetails
from features.revisions.handlers import KeepRevisions


class RevisionsFeature(Feature):
    details = RevisionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(KeepRevisions())
        for command in (Keep(), Revisions(), Revision(), Cut()):
            journal.commands.add("doc", command)
