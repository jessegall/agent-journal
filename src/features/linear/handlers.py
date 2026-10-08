from dataclasses import dataclass
from typing import ClassVar

from engine.events.resources import ResourceEvent
from features.parts import Context, Handler


@dataclass(frozen=True)
class TicketUpdated(ResourceEvent):
    on: ClassVar[str] = "ticket.updated"


class MoveIssue(Handler):
    """A ticket that moves to a mapped stage moves its issue to that state, once the switch is on; what the sync changed is never sent back."""

    def handle(self, context: Context, event: TicketUpdated) -> None:
        context.feature.move_issue(context.record, event.n)
