from events import Fact
from events.hosting import HostedAppAbandoned, HostedAppAttended, HostedAppUnattended
from receiving import Handler
from resources.tickets import Ticket
from serving import Clock, Rows


class ClearIdleTime(Handler[HostedAppAttended]):
    def handle(self, event: HostedAppAttended, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.update(event.ticket, idle_since=0.0)
        return []


class StartIdleTime(Handler[HostedAppUnattended]):
    def handle(self, event: HostedAppUnattended, tickets: Rows[Ticket], clock: Clock) -> list[Fact]:
        tickets.update(event.ticket, idle_since=clock.now())
        return []


class StopAbandonedApp(Handler[HostedAppAbandoned]):
    def handle(self, event: HostedAppAbandoned, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.update(event.ticket, hosted=False, idle_since=0.0)
        return []
