import threading
from dataclasses import asdict, replace
from urllib.parse import urlsplit

from controllers.features import Features
from features.base import Feature
from features.integrations.client import IntegrationClient
from features.integrations.login import OPEN_BROWSER, signed_in
from features.integrations.state import read_state, write_state
from features.journal import Journal
from features.routing import Reply, Request, handles
from features.secrets.controller import Secrets
from features.secrets.resource import Kind
from providers import PROVIDERS
from resources.base import Refused, USER


class IntegrationFeature(Feature):
    """What every integration feature shares: the page of its state, and a client that holds its key in the journal's own process."""

    origin = ""

    def client(self, record) -> IntegrationClient:
        """The one client of this project, built when first needed and again when its settings change."""
        home = str(record.home)
        if home not in self.clients:
            self.clients[home] = IntegrationClient(record.root, self.origin, str(self.values(record).key))
        return self.clients[home]

    def register(self, journal: Journal) -> None:
        self.clients: dict[str, IntegrationClient] = {}
        journal.routes.add(self.state_route(), self.login_route())

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
            agent.serve_mcp(project, self.mcp_name, url) if wanted else agent.drop_mcp(project, self.mcp_name)

    def describe(self) -> dict:
        return {**super().describe(), "mcp_server": self.details.mcp_server}

    def log_in(self, record, opener=OPEN_BROWSER, origin: str = "") -> str:
        """Signs in through the service's own page in your browser and keeps the token as a secret of its own, which becomes the key; only you press this."""
        asked = origin or "{0.scheme}://{0.netloc}".format(urlsplit(self.details.mcp_server))
        value = signed_in(asked, f"agent-journal {record.root.parent.name}", opener)
        secrets = Secrets(record, actor=USER)
        title = f"{self.details.title} login"
        row = next((one for one in secrets.rows.every() if one.title == title and not one.deleted), None) or secrets.create(title, kind=Kind.API_KEY.value)
        secrets.fill(row.n, "key", value)
        variable = next(field["variable"] for field in secrets.load(row.n).secret_fields)
        Features(record, actor=USER).configure(self.name, "key", variable)
        return variable

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

    def state_route(self):
        name = self.name

        @handles("GET", f"/api/{{env}}/integration/{name}")
        def get_state(req: Request) -> Reply:
            return Reply(200, asdict(read_state(req.root, name)))

        return get_state
