from dataclasses import dataclass
from typing import ClassVar

from engine.events.engine import ClockTicked
from engine.events.resources import ResourceEvent
from features.parts import WHOLE_FEATURE, Context, Handler


@dataclass(frozen=True)
class TicketUpdated(ResourceEvent):
    on: ClassVar[str] = "ticket.updated"


@dataclass(frozen=True)
class QuestionClosed(ResourceEvent):
    on: ClassVar[str] = "question.completed"


class MoveIssue(Handler):
    """A ticket that moves to a mapped stage moves its issue to that state, once the switch is on; what the sync changed is never sent back."""

    def handle(self, context: Context, event: TicketUpdated) -> None:
        context.feature.move_issue(context.record, event.n)


class SendApprovedComment(Handler):
    """Your Send on a proposed comment posts the text exactly as it was shown; any other answer sends nothing."""

    def handle(self, context: Context, event: QuestionClosed) -> None:
        context.feature.send_approved(context.record, event.n)


class CheckLinear(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: ClockTicked) -> None:
        context.feature.check(context.record, catching_up=True)
