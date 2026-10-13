from resources.organization import FOLDER
from events import Fact
from events.agents import ClockTicked
from events.hosting import HostedAppAbandoned, HostedAppAttended, HostedAppUnattended
from features.hosting.apps import idle_past
from features.hosting.files import HOSTING, hosting_in
from receiving import Listener
from resources.tickets import Ticket
from serving import Clock, ReadFiles, ReadRows


class SpotIdleApps(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, files: ReadFiles, tickets: ReadRows[Ticket], clock: Clock) -> list[Fact]:
        path = f"{FOLDER}/{HOSTING}"
        if not files.exists(path):
            return []
        minutes = hosting_in(files.read(path)).idle_minutes
        return [fact for ticket in tickets.rows.standing() if ticket.hosted
                for fact in self.noticing(ticket, bool(tickets.agent_session(ticket.n)), minutes, clock.now())]

    def noticing(self, ticket: Ticket, attended: bool, minutes: int, now: float) -> list[Fact]:
        if attended:
            return [HostedAppAttended(ticket=ticket.n)] if ticket.idle_since else []
        if not ticket.idle_since:
            return [HostedAppUnattended(ticket=ticket.n)]
        return [HostedAppAbandoned(ticket=ticket.n)] if idle_past(ticket, minutes, now) else []
