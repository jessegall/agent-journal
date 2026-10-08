from dataclasses import asdict

from features.base import Feature
from features.integrations.client import IntegrationClient
from features.integrations.state import read_state
from features.journal import Journal
from features.routing import Reply, Request, handles


class IntegrationFeature(Feature):
    """What every integration feature shares: the page of its state, and a client that holds its key in the journal's own process."""

    host = ""

    def client(self, record) -> IntegrationClient:
        return IntegrationClient(record.root, self.host, str(self.values(record).key))

    def register(self, journal: Journal) -> None:
        journal.routes.add(self.state_route())

    def state_route(self):
        name = self.name

        @handles("GET", f"/api/{{env}}/integration/{name}")
        def get_state(req: Request) -> Reply:
            return Reply(200, asdict(read_state(req.root, name)))

        return get_state
