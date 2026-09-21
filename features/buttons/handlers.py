from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.buttons.shaping import shaped
from features.parts import Context, Handler

WRITTEN = ("created", "updated")


@dataclass(frozen=True)
class MessageChanged(ResourceEvent):
    on: ClassVar[str] = "message"


class DropUnknownButtons(Handler):
    def handle(self, context: Context, event: MessageChanged) -> None:
        if event.action not in WRITTEN:
            return
        messages = context.journal.messages
        given = (messages.load(event.n).data or {}).get("buttons")
        if given is None:
            return
        kept = shaped(context.record, given)
        if kept != given:
            messages.update(event.n, buttons=kept)
