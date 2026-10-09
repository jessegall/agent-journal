import threading
import time
from dataclasses import asdict, replace
from urllib.parse import urlsplit

from controllers.features import Features
from controllers.types import Notices, Questions
from engine import bus
from features.base import Feature
from features.integrations.commands import SyncIntegration
from features.integrations.details import REFUSED, SEND, UNREACHABLE
from features.integrations.handlers import CheckOnClock, SendApproved
from features.integrations.client import IntegrationClient
from features.integrations.login import OPEN_BROWSER, revoked, signed_in
from features.integrations.state import IntegrationState, read_state, write_state
from features.journal import Journal
from features.routing import Reply, Request, handles
from features.secrets.controller import Secrets
from features.secrets.resource import Kind
from features.secrets.values import ValuesFile
from features.tickets.controller import Tickets
from providers import PROVIDERS
from resources.base import Refused, SYSTEM, USER


class IntegrationFeature(Feature):
    """What every integration feature shares: the page of its state, and a client that holds its key in the journal's own process."""

    origin = ""
    key_refused: tuple[str, ...] = ()

    def client(self, record) -> IntegrationClient:
        """The one client of this project, built when first needed and again when its settings change."""
        home = str(record.home)
        if home not in self.clients:
            self.clients[home] = IntegrationClient(record.root, self.origin, str(self.values(record).key))
        return self.clients[home]

    def register(self, journal: Journal) -> None:
        self.clients: dict[str, IntegrationClient] = {}
        journal.events.handler(CheckOnClock())
        journal.events.handler(SendApproved())
        journal.commands.add("feature", SyncIntegration(self.name))
        journal.routes.add(self.state_route(), self.login_route(), self.logout_route(), self.check_route())

    def settings_changed(self, record, actor: str) -> None:
        self.clients.pop(str(record.home), None)
        self.wire_mcp(record)

    @property
    def mcp_name(self) -> str:
        return f"journal-{self.name}"

    def wire_mcp(self, record) -> None:
        """Adds the service's own MCP server to each agent's project config while it is on, and takes the journal's entry out when it is off; the entry holds the address only, never a key."""
        url = self.details.mcp_server
        if not url:
            return
        project = record.root.parent
        wanted = self.enabled(record) and bool(self.values(record).use_mcp)
        for provider in PROVIDERS.values():
            agent = provider()
            if not agent.present(project):
                continue
            if wanted:
                agent.serve_mcp(project, self.mcp_name, url)
                continue
            agent.drop_mcp(project, self.mcp_name)

    def service(self, record):
        """What this integration talks to the service through; sending and checking use it."""
        return self.client(record)

    def ticked(self, record) -> None:
        self.check(record)

    def send_approved(self, record, n: int) -> None:
        question = Questions(record, actor=SYSTEM).load(n)
        if question.data.get("proposal") != self.name or question.outcome != SEND or question.data.get("answered_by") != USER:
            return
        ticket = Tickets(record, actor=SYSTEM).load(question.refs[0].split(":")[1])
        bus.defer(lambda: self.push(record, lambda service: self.deliver(service, ticket, question.brief)))

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
        value = signed_in(self.mcp_origin(origin), f"agent-journal {record.root.parent.name}", opener)
        secrets = Secrets(record, actor=USER)
        row = self.login_secret(secrets) or secrets.create(f"{self.details.title} login", kind=Kind.API_KEY.value)
        secrets.fill(row.n, "key", value)
        variable = next(field["variable"] for field in secrets.load(row.n).secret_fields)
        write_state(record.root, self.name, replace(read_state(record.root, self.name), logged_in_at=time.time(), last_error=""))
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
            ValuesFile(record.root).drop([variable])
            secrets.delete(row.n, "logged out")
            if str(self.values(record).key) == variable:
                features.configure(self.name, "key", "")
        write_state(record.root, self.name, IntegrationState())
        features.configure(self.name, "use_mcp", "false")

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
