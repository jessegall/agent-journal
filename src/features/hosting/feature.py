from engine.services import SOURCES
from events.agents import ClockTicked
from events.hosting import HostedAppAbandoned, HostedAppAttended, HostedAppUnattended
from expects import WHEN, Answered, Dispatches, Given, Refused, Updated, answering, nothing
from framework.base import Feature
from controllers.types import Tickets
from resources.tickets import Ticket
from features.hosting.card import app_on_card
from features.hosting.commands import HostApp, ShowApp, StopApp
from features.hosting.details import HostingDetails
from features.hosting.handlers import ClearIdleTime, StartIdleTime, StopAbandonedApp
from features.hosting.listeners import SpotIdleApps
from features.hosting.services import ticket_apps
from framework.journal import Journal
from controllers.tickets.cards import CARD_EXTRAS


HOSTED = Ticket(n=1, title="Card", data={"hosted": True})
HOSTING_FILE = answering({"agentic-organization/hosting.toml": 'run = "npm run dev"\nidle_minutes = 5\n'})


def idle_for(minutes: int) -> Ticket:
    return Ticket(n=1, title="Card", data={"hosted": True, "idle_since": WHEN - minutes * 60})


class HostingFeature(Feature):
    details = HostingDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", HostApp(), expects=[
            Given((Tickets, 1), rows=[Ticket(n=1, title="Card")]) >> Refused("the project names no app to host: add agentic-organization/hosting.toml with run, ready and idle_minutes"),
        ])
        journal.commands.add("ticket", StopApp(), expects=[
            Given((Tickets, 1), rows=[HOSTED]) >> Updated(Ticket(n=1), hosted=False),
            Given((Tickets, 1), rows=[Ticket(n=1, title="Card")]) >> Updated(Ticket(n=1), hosted=False),
        ])
        journal.commands.add("ticket", ShowApp(), expects=[
            Given((Tickets, 1), rows=[HOSTED]) >> Answered({"url": "", "state": "not started", "why": ""}),
        ])
        journal.events.listen(ClockTicked, SpotIdleApps(), expects=[
            Given(ClockTicked(agent=1), rows=[HOSTED]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[HOSTED], files=HOSTING_FILE) >> Dispatches(HostedAppUnattended(ticket=1)),
            Given(ClockTicked(agent=1), rows=[idle_for(6)], files=HOSTING_FILE) >> Dispatches(HostedAppAbandoned(ticket=1)),
            Given(ClockTicked(agent=1), rows=[idle_for(1)], files=HOSTING_FILE) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Ticket(n=1, title="Card")], files=HOSTING_FILE) >> Dispatches(nothing),
        ])
        journal.events.handle(HostedAppAttended, ClearIdleTime(), expects=[
            Given(HostedAppAttended(ticket=1), rows=[idle_for(6)]) >> Updated(Ticket(n=1), idle_since=0.0),
        ])
        journal.events.handle(HostedAppUnattended, StartIdleTime(), expects=[
            Given(HostedAppUnattended(ticket=1), rows=[HOSTED]) >> Updated(Ticket(n=1), idle_since=WHEN),
        ])
        journal.events.handle(HostedAppAbandoned, StopAbandonedApp(), expects=[
            Given(HostedAppAbandoned(ticket=1), rows=[idle_for(6)]) >> Updated(Ticket(n=1), hosted=False, idle_since=0.0),
        ])
        SOURCES.add(self, ticket_apps)
        CARD_EXTRAS.add(self, app_on_card)
