from controllers.types import Notices
from engine.events.engine import ClockTicked
from features.integrations.base import IntegrationFeature
from features.integrations.state import IntegrationState, read_state, write_state
from features.linear.details import REFUSED, UNREACHABLE, LinearDetails
from features.linear.sync import Choices, synced, teams_of
from features.parts import WHOLE_FEATURE, Command, Context, Handler
from features.journal import Journal
from features.routing import Reply, Request, handles
from dataclasses import asdict
from resources.base import Refused, SYSTEM

KEY_REFUSED = ("answered 401", "answered 403")


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
        journal.commands.add("feature", SyncLinear())
        journal.routes.add(self.teams_route(), self.check_route())

    def choices(self, record) -> Choices:
        values = self.values(record)
        return Choices(int(values.board), tuple(part for part in str(values.teams).split(",") if part))

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
