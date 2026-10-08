from dataclasses import asdict, dataclass, replace
from typing import ClassVar

from controllers.types import Notices, Questions
from engine import bus
from engine.events.resources import ResourceEvent
from features.tickets.controller import Tickets
from engine.events.engine import ClockTicked
from features.integrations.base import IntegrationFeature
from features.integrations.state import IntegrationState, read_state, write_state
from features.linear.details import REFUSED, UNREACHABLE, LinearDetails
from features.linear.sync import Choices, StageState, send_comment, send_status, synced, teams_of
from features.parts import WHOLE_FEATURE, Command, Context, Handler
from features.journal import Journal
from features.routing import Reply, Request, handles
from resources.base import AGENT, Refused, SYSTEM, USER, titled

KEY_REFUSED = ("answered 401", "answered 403")


@dataclass(frozen=True)
class TicketUpdated(ResourceEvent):
    on: ClassVar[str] = "ticket.updated"


@dataclass(frozen=True)
class QuestionClosed(ResourceEvent):
    on: ClassVar[str] = "question.completed"


SEND, KEEP = "Send", "Don't send"


class MoveIssue(Handler):
    """A ticket that moves to a mapped stage moves its issue to that state, once the switch is on; what the sync changed is never sent back."""

    def handle(self, context: Context, event: TicketUpdated) -> None:
        context.feature.move_issue(context.record, event.n)


class SendApprovedComment(Handler):
    """Your Send on a proposed comment posts the text exactly as it was shown; any other answer sends nothing."""

    def handle(self, context: Context, event: QuestionClosed) -> None:
        context.feature.send_approved(context.record, event.n)


class ProposeComment(Command):
    name = "linear_comment"

    def run(self, context: Context, tickets, n: int, text: str) -> str:
        ticket = tickets.load(n)
        if ticket.source != "linear" or not ticket.source_id:
            raise Refused(f"{ticket.ref} did not come from Linear")
        Questions(context.record, actor=AGENT).create(titled(f"Send this comment to Linear on {ticket.ref.replace(':', ' ')}"), brief=text.strip(),
                                                      options=[{"title": SEND}, {"title": KEEP}], about=ticket.ref, linear_comment=True)
        return f"asked you whether to send it; nothing is sent until you press {SEND}"


class CheckLinear(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: ClockTicked) -> None:
        context.feature.check(context.record)


class SyncLinear(Command):
    name = "sync"
    network = True

    def run(self, context: Context, features, name: str) -> str:
        if name != "linear":
            raise Refused("only linear has something to sync")
        state = context.feature.check(context.record)
        return state.last_error or f"checked Linear, up to {state.cursor or 'the start'}"


class Linear(IntegrationFeature):
    details = LinearDetails
    origin = "https://api.linear.app"

    def register(self, journal: Journal) -> None:
        super().register(journal)
        journal.events.handler(CheckLinear())
        journal.events.handler(MoveIssue())
        journal.events.handler(SendApprovedComment())
        journal.commands.add("feature", SyncLinear())
        journal.commands.add("ticket", ProposeComment())
        journal.routes.add(self.teams_route(), self.check_route())

    def choices(self, record) -> Choices:
        values = self.values(record)
        stages = tuple(StageState(stage, state) for stage, state in dict(values.stage_states).items() if state)
        return Choices(int(values.board), tuple(part for part in str(values.teams).split(",") if part), stages)

    def move_issue(self, record, n: int) -> None:
        tickets = Tickets(record, actor=SYSTEM)
        ticket = tickets.load(n)
        if ticket.source != "linear" or ticket.data.get("linear_stage") == ticket.stage:
            return
        state = self.choices(record).state_of(ticket.stage)
        sending = bool(self.values(record).send_status) and bool(state)
        tickets.update(ticket.n, linear_stage=ticket.stage)
        if sending:
            bus.defer(lambda: self.push(record, lambda client: send_status(client, ticket.source_id, state)))

    def send_approved(self, record, n: int) -> None:
        question = Questions(record, actor=SYSTEM).load(n)
        if not question.data.get("linear_comment") or question.outcome != SEND or question.data.get("answered_by") != USER:
            return
        ticket = Tickets(record, actor=SYSTEM).load(question.refs[0].split(":")[1])
        bus.defer(lambda: self.push(record, lambda client: send_comment(client, ticket.source_id, question.brief)))

    def push(self, record, sending) -> None:
        """Sends one write to Linear from the journal's own process; a failure is kept in the integration's state, never raised into the move or the answer."""
        try:
            sending(self.client(record))
        except Refused as error:
            before = read_state(record.root, self.name)
            write_state(record.root, self.name, replace(before, last_error=str(error)))

    def check(self, record) -> IntegrationState:
        """One sync now: nothing when no key or no board is picked; failures are noticed once until a sync works again."""
        before = read_state(record.root, self.name)
        choices = self.choices(record)
        if not str(self.values(record).key) or not choices.board:
            return before
        after = synced(record, self.client(record), choices, before)
        write_state(record.root, self.name, after)
        self.notice_failure(record, before, read_state(record.root, self.name))
        return read_state(record.root, self.name)

    def notice_failure(self, record, before: IntegrationState, after: IntegrationState) -> None:
        here = self.journal.at(record)
        if after.failures == 1 and before.failures == 0:
            here.notice(REFUSED if any(mark in after.last_error for mark in KEY_REFUSED) else UNREACHABLE, integration=self.name)
        if after.failures == 0 and before.failures:
            for notice in (n for n in Notices(record, actor=SYSTEM).rows.standing() if n.data.get("integration") == self.name):
                here.clear(notice, "Linear answered again")

    def teams_route(self):
        @handles("GET", "/api/{env}/integration/linear/teams")
        def get_teams(req: Request) -> Reply:
            return Reply(200, [asdict(team) for team in teams_of(self.client(req.record()))])

        return get_teams

    def check_route(self):
        @handles("POST", "/api/{env}/integration/linear/check")
        def post_check(req: Request) -> Reply:
            return Reply(200, asdict(self.check(req.record())))

        return post_check
