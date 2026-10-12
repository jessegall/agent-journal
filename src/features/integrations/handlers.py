
from events.agents import ClockTicked
from framework.parts import WHOLE_FEATURE, Context, Handler
from events.questions import QuestionCompleted


class SendApproved(Handler):
    """Your Send on a proposed text sends it exactly as it was shown; any other answer sends nothing."""

    def handle(self, context: Context, event: QuestionCompleted) -> None:
        context.feature.send_approved(context.record, event.n)


class CheckOnClock(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: ClockTicked) -> None:
        context.feature.ticked(context.record)
