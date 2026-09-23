from engine.events import ClockTicked
from features.hosting.apps import idle
from features.hosting.files import hosting_of
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from features.tickets.controller import Tickets
from resources.base import SYSTEM


class StopIdleApps(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        hosting = hosting_of(context.record.root.parent)
        if not hosting:
            return
        tickets = Tickets(context.record, actor=SYSTEM)
        for ticket in (r for r in tickets._standing() if r.hosted):
            if idle(tickets, ticket, hosting.idle_minutes):
                tickets.update(ticket.n, hosted=False, idle_since=0.0)
