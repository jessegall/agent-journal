
from features.parts import Context, Handler
from events.tickets import TicketUpdated


class MoveIssue(Handler):
    """A ticket that moves to a mapped stage moves its issue to that state, once the switch is on; what the sync changed is never sent back."""

    def handle(self, context: Context, event: TicketUpdated) -> None:
        context.feature.move_issue(context.record, event.n)
