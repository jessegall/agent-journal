from controllers.types import Docs
from expects import Answered, Given, Refused, Unchanged
from framework.base import Feature
from framework.journal import Journal
from features.revisions.commands import Keep, Revision, Revisions
from features.revisions.details import RevisionsDetails
from features.revisions.handlers import KeepRevisions
from events.docs import DocWritten
from resources.base import AGENT
from resources.types import Doc


UNWRITTEN = Doc(n=1, title="How the viewer is built")


class RevisionsFeature(Feature):
    details = RevisionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(KeepRevisions(), expects=[
            Given(DocWritten(n=1, type="doc", action="updated", actor=AGENT), rows=[Doc(n=1, title="A section of another doc", data={"part_of": "doc:2"})]) >> Unchanged(),
        ])
        journal.commands.add("doc", Keep(), expects=[
            Given((Docs, 1), rows=[UNWRITTEN]) >> Refused("revision 0 of doc 1 is already kept"),
        ])
        journal.commands.add("doc", Revisions(), expects=[
            Given((Docs, 1), rows=[UNWRITTEN]) >> Answered([]),
        ])
        journal.commands.add("doc", Revision(), expects=[
            Given((Docs, 1, 1), rows=[UNWRITTEN]) >> Refused("doc 1 has no revisions yet"),
        ])
