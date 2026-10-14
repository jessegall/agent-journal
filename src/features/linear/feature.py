from events.integrations import LinearCheckDue, LinearReplyApproved, LinearStageMoved
from expects import Answered, Dispatches, Given, Ran, Refused, Unchanged, Wrote, answering, nothing
from framework.integrations.base import IntegrationFeature
from framework.integrations.details import SEND
from framework.journal import Journal
from features.linear.commands import ProposeComment
from features.linear.details import LinearDetails
from features.linear.fake import FakeLinear
from features.linear.handlers import MoveIssue
from features.linear.listeners import SpotMovedIssue
from events.tickets import TicketUpdated
from features.linear.routes import LinearWebhook
from features.linear.webhook import Deliveries
from features.linear.working import LinearWork
from declaring.registries import SHARE_ROUTES
from controllers.types import Tickets
from resources.boards import Board
from resources.tickets import Ticket
from resources.base import USER
from resources.types import AgentRow, Notice, Question

MOVED = TicketUpdated(n=1, type="ticket", action="updated", actor=USER)


CHOSEN = {"linear.key": "LINEAR_KEY", "linear.fetching": True, "linear.board": 1, "linear.teams": "t1"}
SEEDED = [AgentRow(n=1, title="claude-1"), Board(n=1, title="Linear issues")]
TEAMS = [{"id": "t1", "key": "ENG", "name": "Engineering"}]
STATES = [{"id": "s1", "name": "Todo", "team": {"id": "t1"}}]


def listed(n: int, updated: str) -> dict:
    return {"id": f"id-{n}", "identifier": f"ENG-{n}", "title": "Fix the login", "description": "The login fails.", "url": f"https://linear.app/x/issue/ENG-{n}", "updatedAt": updated,
            "archivedAt": None, "state": {"id": "s1"}, "team": {"id": "t1"}, "creator": {"name": "Ana"}, "assignee": {"isMe": True}, "mine": True, "comments": {"nodes": []}}


def issue(source: str = "linear", **data) -> Ticket:
    return Ticket(n=1, title="Crash report", data={"source": source, "source_id": "ENG-4", "stage": "Doing", **data})


class Linear(LinearWork, IntegrationFeature):
    key_refused = ("answered 401", "answered 403")
    details = LinearDetails
    approved = LinearReplyApproved
    due = LinearCheckDue
    origin = "https://api.linear.app"

    def syncs(self) -> list:
        due, secrets = LinearCheckDue(agent=1), answering({"LINEAR_KEY": "lin_secret"})
        far = lambda **given: answering({("far side",): FakeLinear(teams=TEAMS, states=STATES, **given)})
        return [
            Given(due, rows=SEEDED, settings=CHOSEN, secrets=secrets, outside=far(issues=[listed(1, "2026-10-01T10:00:00Z")]))
                >> Wrote(Ticket(title='<untrusted source="linear" author="Ana">ENG-1 Fix the login</untrusted>', data={"source": "linear", "source_id": "id-1", "board": 1, "linear_state": "s1"})),
            Given(due, rows=[*SEEDED, Ticket(n=1, title="ENG-1", data={"source": "linear", "source_id": "id-1", "board": 1, "linear_state": "s1", "linear_stage": "Doing"})], settings=CHOSEN, secrets=secrets,
                  outside=far(issues=[listed(1, "2026-10-01T10:00:00Z")])) >> Unchanged(),
            Given(due, rows=SEEDED, settings={**CHOSEN, "linear.fetching": False}, secrets=secrets, outside=far(issues=[listed(1, "2026-10-01T10:00:00Z")])) >> Unchanged(),
            Given(due, rows=SEEDED, settings=CHOSEN, secrets=secrets, outside=far(status=401)) >> Wrote(Notice(title="Linear refused the key")),
            Given(due, rows=SEEDED, settings=CHOSEN, secrets=secrets, outside=far(status=500)) >> Wrote(Notice(title="Linear could not be reached")),
        ]

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
