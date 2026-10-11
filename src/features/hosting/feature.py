from engine.services import SOURCES
from engine.events.engine import ClockTicked
from expects import Answered, Given, Refused, Unchanged, Updated
from features.base import Feature
from features.tickets.controller import Tickets
from features.tickets.resource import Ticket
from features.hosting.card import app_on_card
from features.hosting.commands import HostApp, ShowApp, StopApp
from features.hosting.details import HostingDetails
from features.hosting.handlers import StopIdleApps
from features.hosting.services import ticket_apps
from features.journal import Journal
from features.tickets.cards import CARD_EXTRAS


HOSTED = Ticket(n=1, title="Card", data={"hosted": True})


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
        journal.events.handler(StopIdleApps(), expects=[
            Given(ClockTicked(agent=1), rows=[HOSTED]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[Ticket(n=1, title="Card")]) >> Unchanged(),
        ])
        SOURCES.add(self, ticket_apps)
        CARD_EXTRAS.add(self, app_on_card)
