from engine.events import ClockTicked, ResourceCreated
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.tickets.controller import HELD, Tickets
from resources.base import SYSTEM


class LookAfterTicketBranches(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tickets = Tickets(context.record, actor=SYSTEM)
        tickets.keep_branches()
        tickets.close_merged()
        tickets.start_queued()


class HoldTicketKnowledge(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type in HELD:
            Tickets(context.record, actor=SYSTEM).hold(event.type, event.n)
