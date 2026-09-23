from engine.events import ClockTicked
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from features.tickets.controller import Tickets
from resources.base import SYSTEM


class LookAfterTicketBranches(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        tickets.keep_branches()
        tickets.close_merged()
        tickets.start_queued()
