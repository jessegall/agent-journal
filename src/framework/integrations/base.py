import shlex
import sys
import threading
import time
from dataclasses import asdict, replace
from urllib.parse import urlsplit

from controllers.features import Features
from events.agents import ClockTicked
from events.integrations import CheckDue, ReplyApproved
from expects import Answered, Dispatches, Given, Ran, nothing
from controllers.agents import Agents
from controllers.notices import Notices
from engine import bus
from framework.base import Feature
from framework.due import DueOnClock
from framework.integrations.commands import SyncIntegration
from framework.integrations.details import KEEP, REFUSED, SEND, UNREACHABLE
from framework.integrations.handlers import checking_when_due, sending_approved
from framework.integrations.listeners import SpotApprovedReply
from events.questions import QuestionCompleted
from framework.integrations.client import IntegrationClient
from controllers.integrations.login import OPEN_BROWSER, RENEWAL_SUFFIX, revoked, signed_in
from framework.integrations.state import IntegrationState, read_state, write_state
from framework.journal import Journal
from framework.routing import Reply, Request, handles
from controllers.secrets.controller import Secrets
from resources.secrets import Kind
from controllers.secrets.values import ValuesFile
from controllers.tickets.controller import Tickets
from serving import SERVED, Providers
from resources.base import AGENT, Refused, SYSTEM, USER
from resources.types import AgentRow, Question


NEEDS_LOGIN = "Your agents cannot use {title}'s tools yet: press Log in on this card and approve in your browser."


class IntegrationFeature(Feature):
    """What every integration feature shares: the page of its state, and a client that holds its key in the journal's own process."""

    origin = ""
    approved = ReplyApproved
    due = CheckDue
    key_refused: tuple[str, ...] = ()
    unkeyed: str
    """What a sync says when the service's key is not set, in the words of that service's settings."""

    def client(self, record) -> IntegrationClient:
        """The one client of this project, built when first needed and again when its settings change."""
        home = str(record.home)
        if home not in self.clients:
            self.clients[home] = IntegrationClient(record.root, self.origin, str(self.values(record).key))
        return self.clients[home]

    def register(self, journal: Journal) -> None:
        self.clients: dict[str, IntegrationClient] = {}
        journal.events.listen(ClockTicked, DueOnClock(self.due), expects=[
            Given(ClockTicked(agent=1)) >> Dispatches(self.due(agent=1).due()),
        ])
        journal.events.handle(self.due, checking_when_due(self.due), expects=[
            Given(self.due(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Ran(("own work", "ticked")),
        ])
        journal.events.listen(QuestionCompleted, SpotApprovedReply(self.name, self.approved), expects=[
            Given(self.closed(), rows=[self.proposal(SEND)]) >> Dispatches(self.approved(question=1, ticket=1, text="Thanks.")),
            Given(self.closed(), rows=[self.proposal(KEEP)]) >> Dispatches(nothing),
            Given(self.closed(), rows=[self.proposal(SEND, by=AGENT)]) >> Dispatches(nothing),
            Given(self.closed(), rows=[self.proposal(SEND, service="another")]) >> Dispatches(nothing),
        ])
        journal.events.handle(self.approved, sending_approved(self.approved), expects=[
            Given(self.approved(question=1, ticket=1, text="Thanks."), rows=[AgentRow(n=1, title="claude-1")]) >> Ran(("own work", "send_reply", 1, "Thanks.")),
        ])
        journal.commands.add("feature", SyncIntegration(self.name), expects=[
            Given((Features,)) >> Answered(f"{self.details.title} was not checked: {self.unkeyed}"),
        ])
        journal.routes.add(self.state_route(), self.login_route(), self.logout_route(), self.check_route())

    @staticmethod
    def closed() -> QuestionCompleted:
        return QuestionCompleted(n=1, type="question", action="completed", actor=USER)

    def proposal(self, outcome: str, by: str = USER, service: str = "") -> Question:
        return Question(n=1, title="Send this answer", brief="Thanks.", outcome=outcome, refs=["ticket:1"], data={"proposal": service or self.name, "answered_by": by})

    def settings_changed(self, record, actor: str) -> None:
        self.clients.pop(str(record.home), None)
        self.wire_mcp(record)

    def switched(self, record, actor: str, on: bool) -> None:
        if actor == USER:
            self.mark_user_action(record, "Connected" if on else "Disconnected")

    def mark_user_action(self, record, label: str) -> None:
        """Shows in the chat, on your side, that you connected, disconnected or logged in or out of the service; it opens the Integrations page."""
        agents = Agents(record, actor=SYSTEM)
        row = agents.primary()
        if row:
            agents.card(row.n, label=label, name=self.details.title, icon="plug", side=USER, state="done", go="integrations")

    @property
    def mcp_name(self) -> str:
        return f"journal-{self.name}"

    def login_variable(self, record) -> str:
        """The name of the variable the sign-in token is kept under, or nothing before the first sign-in."""
        secrets = Secrets(record, actor=SYSTEM)
        row = self.login_secret(secrets)
        return next((field["variable"] for field in secrets.load(row.n).secret_fields), "") if row else ""

    def headers_helper(self, record) -> str:
        """The command an agent runs on each connect to get the sign-in header, once there is a sign-in; the config holds the command, never the token."""
        variable = self.login_variable(record)
        return shlex.join([sys.executable, str(record.root / "journal.py"), "-m", "mcp_headers", str(record.root), variable]) if variable else ""

    def wire_mcp(self, record) -> None:
        """Adds the service's own MCP server to each agent's project config while it is on, and takes the journal's entry out when it is off; the entry holds the address and the command that fetches the sign-in, never a key. Without a sign-in yet, the page says plainly that your browser still has to approve one."""
        url = self.details.mcp_server
        if not url:
            return
        project = record.root.parent
        wanted = self.enabled(record) and bool(self.values(record).use_mcp)
        helper = self.headers_helper(record) if wanted else ""
        for agent in SERVED.given(Providers).every():
            if not agent.present(project):
                continue
            if wanted:
                agent.serve_mcp(project, self.mcp_name, url, helper)
                continue
            agent.drop_mcp(project, self.mcp_name)
        if wanted and not helper:
            state = read_state(record.root, self.name)
            write_state(record.root, self.name, replace(state, last_error=NEEDS_LOGIN.format(title=self.details.title)))

    def service(self, record):
        """What this integration talks to the service through; sending and checking use it."""
        return self.client(record)

    def ticked(self, record) -> None:
        self.check(record)

    def send_reply(self, record, n: int, text: str) -> None:
        ticket = Tickets(record, actor=SYSTEM).load(n)
        self.push_later(record, lambda service: self.deliver(service, ticket, text))

    def push_later(self, record, sending) -> None:
        """Sends one write once the answer that asked for it has gone out."""
        bus.defer(lambda: self.push(record, sending))

    def push(self, record, sending) -> None:
        """Sends one write from the journal's own process; a failure is kept in the integration's state, never raised into the move or the answer."""
        try:
            sending(self.service(record))
        except Refused as error:
            write_state(record.root, self.name, replace(read_state(record.root, self.name), last_error=str(error)))

    def notice_failure(self, record, before, after) -> None:
        """A failed sync is noticed once, and the notice clears when a sync works again."""
        here = self.journal.at(record)
        if after.failures == 1 and before.failures == 0:
            here.notice(REFUSED if any(mark in after.last_error for mark in self.key_refused) else UNREACHABLE, integration=self.name)
        if after.failures == 0 and before.failures:
            for notice in (n for n in Notices(record, actor=SYSTEM).rows.standing() if n.data.get("integration") == self.name):
                here.clear(notice, f"{self.details.title} answered again")

    def describe(self) -> dict:
        return {**super().describe(), "mcp_server": self.details.mcp_server, "key_refused": list(self.key_refused)}

    def login_secret(self, secrets):
        """The secret the sign-in is kept in, or nothing before the first sign-in."""
        title = f"{self.details.title} login"
        return next((one for one in secrets.rows.every() if one.title == title and not one.deleted), None)

    def mcp_origin(self, origin: str = "") -> str:
        return origin or "{0.scheme}://{0.netloc}".format(urlsplit(self.details.mcp_server))

    def log_in(self, record, opener=OPEN_BROWSER, origin: str = "") -> str:
        """Signs in through the service's own page in your browser and keeps the token as a secret of its own for the service's MCP server; only you press this. The token is made for that server, so the journal never reads with it as its key."""
        signin = signed_in(self.mcp_origin(origin), f"agent-journal {record.root.parent.name}", opener)
        secrets = Secrets(record, actor=USER)
        row = self.login_secret(secrets) or secrets.create(f"{self.details.title} login", kind=Kind.API_KEY.value)
        secrets.fill(row.n, "key", signin.bearer)
        variable = next(field["variable"] for field in secrets.load(row.n).secret_fields)
        ValuesFile(record.root).put(variable + RENEWAL_SUFFIX, signin.renewal.text())
        write_state(record.root, self.name, replace(read_state(record.root, self.name), logged_in_at=time.time(), last_error=""))
        self.wire_mcp(record)
        self.mark_user_action(record, "Logged in to")
        return variable

    def log_out(self, record, origin: str = "") -> None:
        """Voids the token at the service where it can, deletes the login secret, forgets the key if it was that secret, clears the state and switches the MCP server off; only you press this."""
        secrets = Secrets(record, actor=USER)
        row = self.login_secret(secrets)
        features = Features(record, actor=USER)
        if row:
            variable = next(field["variable"] for field in secrets.load(row.n).secret_fields)
            token = ValuesFile(record.root).values().get(variable, "")
            try:
                if token:
                    revoked(self.mcp_origin(origin), token)
            except Refused:
                pass
            ValuesFile(record.root).drop([variable, variable + RENEWAL_SUFFIX])
            secrets.delete(row.n, "logged out")
            if str(self.values(record).key) == variable:
                features.configure(self.name, "key", "")
        write_state(record.root, self.name, IntegrationState())
        features.configure(self.name, "use_mcp", "false")
        self.mark_user_action(record, "Logged out of")

    def login_route(self):
        name = self.name

        @handles("POST", f"/api/{{env}}/integration/{name}/login")
        def post_login(req: Request) -> Reply:
            record = req.record()

            def signing_in() -> None:
                try:
                    self.log_in(record)
                except Refused as error:
                    write_state(record.root, name, replace(read_state(record.root, name), last_error=str(error)))

            threading.Thread(target=signing_in, daemon=True).start()
            return Reply(200, {"started": True})

        return post_login

    def logout_route(self):
        name = self.name

        @handles("POST", f"/api/{{env}}/integration/{name}/logout")
        def post_logout(req: Request) -> Reply:
            self.log_out(req.record())
            return Reply(200, {"loggedOut": True})

        return post_logout

    def check_route(self):
        name = self.name

        @handles("POST", f"/api/{{env}}/integration/{name}/check")
        def post_check(req: Request) -> Reply:
            return Reply(200, asdict(self.check(req.record())))

        return post_check

    def state_route(self):
        name = self.name

        @handles("GET", f"/api/{{env}}/integration/{name}")
        def get_state(req: Request) -> Reply:
            return Reply(200, asdict(read_state(req.root, name)))

        return get_state
