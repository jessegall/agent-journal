import time

from engine.events.engine import ClockTicked
from features.hosting.apps import idle_past
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
        now = time.time()
        for ticket in (r for r in tickets.rows.standing() if r.hosted):
            if tickets.agent_session(ticket.n):
                tickets.update(ticket.n, idle_since=0.0)
            elif not ticket.idle_since:
                tickets.update(ticket.n, idle_since=now)
            elif idle_past(ticket, hosting.idle_minutes, now):
                tickets.update(ticket.n, hosted=False, idle_since=0.0)
