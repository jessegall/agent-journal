from expects import Answered, Given, Refused, Unchanged, Updated, Wrote
from features.integrations.base import IntegrationFeature
from features.integrations.details import SEND
from framework.journal import Journal
from features.linear.commands import ProposeComment
from features.linear.details import LinearDetails
from features.linear.handlers import MoveIssue
from events.tickets import TicketUpdated
from features.linear.routes import LinearWebhook
from features.linear.webhook import Deliveries
from features.linear.working import LinearWork
from features.sharing.routes import ROUTES
from features.tickets.controller import Tickets
from features.tickets.resource import Ticket
from resources.base import USER
from resources.types import Question

MOVED = TicketUpdated(n=1, type="ticket", action="updated", actor=USER)


def issue(source: str = "linear", **data) -> Ticket:
    return Ticket(n=1, title="Crash report", data={"source": source, "source_id": "ENG-4", "stage": "Doing", **data})


class Linear(LinearWork, IntegrationFeature):
    key_refused = ("answered 401", "answered 403")
    details = LinearDetails
    origin = "https://api.linear.app"

    def register(self, journal: Journal) -> None:
        super().register(journal)
        self.deliveries = Deliveries()
        ROUTES.add(self, LinearWebhook(self), key="linear")
        journal.events.handler(MoveIssue(), expects=[
            Given(MOVED, rows=[issue()]) >> Updated(Ticket(n=1), linear_stage="Doing"),
            Given(MOVED, rows=[issue(linear_stage="Doing")]) >> Unchanged(),
            Given(MOVED, rows=[issue(source="gmail")]) >> Unchanged(),
        ])
        journal.commands.add("ticket", ProposeComment(), expects=[
            Given((Tickets, 1, "Fixed in the next build."), rows=[Ticket(n=1, title="Crash report", data={"source": "linear", "source_id": "ENG-4"})])
                >> Wrote(Question(title="Send this comment to Linear for ticket 1", brief="Fixed in the next build.")) & Answered(f"asked you whether to send it; nothing is sent until you press {SEND}"),
            Given((Tickets, 1, "Fixed in the next build."), rows=[Ticket(n=1, title="Crash report", data={"source": "gmail"})]) >> Refused("ticket:1 did not come from Linear"),
            Given((Tickets, 1, "Fixed in the next build."), rows=[Ticket(n=1, title="Crash report", data={"source": "linear"})]) >> Refused("ticket:1 did not come from Linear"),
        ])
        journal.routes.add(self.teams_route(), self.webhook_route())
