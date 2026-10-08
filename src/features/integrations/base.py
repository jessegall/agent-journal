from dataclasses import asdict

from features.base import Feature
from features.integrations.client import IntegrationClient
from features.integrations.state import read_state
from features.journal import Journal
from providers import PROVIDERS
from features.routing import Reply, Request, handles


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
        journal.routes.add(self.state_route())

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

    def state_route(self):
        name = self.name

        @handles("GET", f"/api/{{env}}/integration/{name}")
        def get_state(req: Request) -> Reply:
            return Reply(200, asdict(read_state(req.root, name)))

        return get_state
