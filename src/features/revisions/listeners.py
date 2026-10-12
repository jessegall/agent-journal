from events import Fact
from events.docs import DocWritten
from events.revisions import DocRevisable
from receiving import Listener
from resources.base import PART_OF
from resources.types import Doc
from serving import ReadRows


class SpotRevisableDoc(Listener[DocWritten]):
    def listen(self, event: DocWritten, docs: ReadRows[Doc]) -> list[Fact]:
        return [] if docs.peek(event.n).data.get(PART_OF) else [DocRevisable(n=event.n)]
