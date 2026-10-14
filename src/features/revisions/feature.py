from controllers.types import Docs
from expects import Acted, Answered, Dispatches, Given, Refused, Updated, nothing
from framework.base import Feature
from framework.journal import Journal
from features.revisions.commands import Keep, Revision, Revisions
from features.revisions.details import RevisionsDetails
from features.revisions.handlers import KeepRevisions
from features.revisions.listeners import SpotRevisableDoc
from events.docs import DocWritten
from events.revisions import DocRevisable
from resources.base import AGENT, USER
from resources.types import Doc


UNWRITTEN = Doc(n=1, title="How the viewer is built")
OPEN = Doc(n=1, title="How the viewer is built", data={"revisions": 2, "open_until": 4_102_444_800.0})
KEPT = Doc(n=1, title="How the viewer is built", data={"revisions": 2, "open_until": 500.0})
FIRST_IDEA = Doc(n=1, title="How handlers are written", abstract="the first idea")
EDITED = (Acted(Docs, "section", 1, "Goals", "one", by=AGENT), Acted(Docs, "section", 1, "Goals", "two", by=USER))


class RevisionsFeature(Feature):
    details = RevisionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(DocWritten, SpotRevisableDoc(), expects=[
            Given(DocWritten(n=1, type="doc", action="updated", actor=AGENT), rows=[UNWRITTEN]) >> Dispatches(DocRevisable(n=1)),
            Given(DocWritten(n=1, type="doc", action="updated", actor=AGENT), rows=[Doc(n=1, title="A section of another doc", data={"part_of": "doc:2"})]) >> Dispatches(nothing),
        ])
        journal.events.handle(DocRevisable, KeepRevisions(), expects=[
            Given(DocRevisable(n=1), rows=[Doc(n=1, title="How the viewer is built", abstract="the first idea")]) >> Updated(Doc(n=1), revisions=1),
            Given(DocRevisable(n=1), rows=[FIRST_IDEA], earlier=(*EDITED,)) >> Updated(Doc(n=1), revisions=1),
            Given(DocRevisable(n=1), rows=[FIRST_IDEA], earlier=(*EDITED, Acted(Docs, "keep", 1, by=USER), Acted(Docs, "cut", 1, "Goals", by=AGENT))) >> Updated(Doc(n=1), revisions=2),
        ])
        journal.commands.add("doc", Keep(), expects=[
            Given((Docs, 1), rows=[UNWRITTEN]) >> Refused("doc 1 has no revision to keep yet: its first edit opens one"),
            Given((Docs, 1), rows=[OPEN]) >> Updated(Doc(n=1), open_until=0),
            Given((Docs, 1), rows=[KEPT]) >> Refused("revision 2 of doc 1 is already kept"),
        ])
        journal.commands.add("doc", Revisions(), expects=[
            Given((Docs, 1), rows=[UNWRITTEN]) >> Answered([]),
        ])
        journal.commands.add("doc", Revision(), expects=[
            Given((Docs, 1, 1), rows=[UNWRITTEN]) >> Refused("doc 1 has no revisions yet"),
            Given((Docs, 1, 3), rows=[KEPT]) >> Refused("doc 1 has revisions 1 to 2"),
            Given((Docs, 1, 0), rows=[KEPT]) >> Refused("doc 1 has revisions 1 to 2"),
        ])
