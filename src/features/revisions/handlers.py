from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.parts import Context, Handler
from features.revisions.history import revise
from resources.base import PART_OF

WRITTEN = ("created", "updated")


@dataclass(frozen=True)
class DocWritten(ResourceEvent):
    on: ClassVar[str] = "doc"

    def wanted(self) -> bool:
        return self.action in WRITTEN


class KeepRevisions(Handler):
    def handle(self, context: Context, event: DocWritten) -> None:
        docs = context.journal.docs
        head = docs.load(event.n)
        if not head.data.get(PART_OF):
            revise(docs, head, float(context.settings.keep_after_minutes) * 60)
