from events.integrations import LinearReplyApproved, LinearStageMoved
from expects import Answered, Dispatches, Given, Ran, Refused, Wrote, nothing
from framework.integrations.base import IntegrationFeature
from framework.integrations.details import SEND
from framework.journal import Journal
from features.linear.commands import ProposeComment
from features.linear.details import LinearDetails
from features.linear.handlers import MoveIssue
from features.linear.listeners import SpotMovedIssue
from events.tickets import TicketUpdated
from features.linear.routes import LinearWebhook
from features.linear.webhook import Deliveries
from features.linear.working import LinearWork
from declaring.registries import SHARE_ROUTES
from controllers.types import Tickets
from resources.tickets import Ticket
from resources.base import USER
from resources.types import Question

MOVED = TicketUpdated(n=1, type="ticket", action="updated", actor=USER)


def issue(source: str = "linear", **data) -> Ticket:
    return Ticket(n=1, title="Crash report", data={"source": source, "source_id": "ENG-4", "stage": "Doing", **data})


class Linear(LinearWork, IntegrationFeature):
    key_refused = ("answered 401", "answered 403")
    details = LinearDetails
    approved = LinearReplyApproved
    origin = "https://api.linear.app"

    def register(self, journal: Journal) -> None:
        super().register(journal)
        self.deliveries = Deliveries()
        SHARE_ROUTES.add(self, LinearWebhook(self), key="linear")
        journal.events.listen(TicketUpdated, SpotMovedIssue(), expects=[
            Given(MOVED, rows=[issue()]) >> Dispatches(LinearStageMoved(ticket=1)),
            Given(MOVED, rows=[issue(linear_stage="Doing")]) >> Dispatches(nothing),
            Given(MOVED, rows=[issue(source="gmail")]) >> Dispatches(nothing),
        ])
        journal.events.handle(LinearStageMoved, MoveIssue(), expects=[
            Given(LinearStageMoved(ticket=1), rows=[issue()]) >> Ran(("own work", "move_issue", 1)),
        ])
        journal.commands.add("ticket", ProposeComment(), expects=[
            Given((Tickets, 1, "Fixed in the next build."), rows=[Ticket(n=1, title="Crash report", data={"source": "linear", "source_id": "ENG-4"})])
                >> Wrote(Question(title="Send this comment to Linear for ticket 1", brief="Fixed in the next build.")) & Answered(f"asked you whether to send it; nothing is sent until you press {SEND}"),
            Given((Tickets, 1, "Fixed in the next build."), rows=[Ticket(n=1, title="Crash report", data={"source": "gmail"})]) >> Refused("ticket:1 did not come from Linear"),
            Given((Tickets, 1, "Fixed in the next build."), rows=[Ticket(n=1, title="Crash report", data={"source": "linear"})]) >> Refused("ticket:1 did not come from Linear"),
        ])
        journal.routes.add(self.teams_route(), self.webhook_route())
