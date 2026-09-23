from engine.events import ClockTicked
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from features.tickets.controller import Tickets
from resources.base import SYSTEM


class CloseMergedTickets(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        Tickets(context.record, actor=SYSTEM).close_merged()
