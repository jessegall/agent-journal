from events import Fact
from events.revisions import DocRevisable
from receiving import Handler
from resources.types import Doc
from serving import Rows, Settings


class KeepRevisions(Handler[DocRevisable]):
    def handle(self, event: DocRevisable, docs: Rows[Doc], settings: Settings) -> list[Fact]:
        docs.keep_revision(event.n, float(settings.keep_after_minutes) * 60)
        return []
