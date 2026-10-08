from dataclasses import dataclass
from typing import ClassVar

from engine.events.engine import ClockTicked
from engine.events.resources import ResourceEvent
from features.parts import WHOLE_FEATURE, Context, Handler


@dataclass(frozen=True)
class QuestionClosed(ResourceEvent):
    on: ClassVar[str] = "question.completed"


class SendApprovedReply(Handler):
    """Your Send on a proposed answer sends the text exactly as it was shown; any other answer sends nothing."""

    def handle(self, context: Context, event: QuestionClosed) -> None:
        context.feature.send_approved(context.record, event.n)


class CheckGmail(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: ClockTicked) -> None:
        context.feature.check(context.record)
