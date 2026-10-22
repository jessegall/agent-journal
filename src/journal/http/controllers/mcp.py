from journal.features.mcp.support.mcp_catalogue import McpCatalogue
from journal.features.mcp.support.health import Health
from journal.features.mcp.support.mcp_installing import McpInstalling
from journal.support.keys import Keys
from journal.support.pending_restarts import PendingRestarts
from journal.http.controllers.support.server_entry import ServerEntry
from journal.http.support.request import Request
from journal.support.response import Response
from journal.repositories.mcp_servers import McpServers
from journal.support.missing_row import MissingRow


class McpController:
    """The MCP page: the project's MCP servers and how they stand, the suggestions, and the acts on them."""

    def __init__(self, servers: McpServers, catalogue: McpCatalogue, keys: Keys, installing: McpInstalling, health: Health, pending: PendingRestarts) -> None:
        self.servers, self.catalogue, self.keys, self.installing, self.health, self.pending = servers, catalogue, keys, installing, health, pending

    def index(self, request: Request) -> Response:
        report = self.health.report()
        owned = [self.row(self.installing.checked_one(s, report)) for s in self.servers.all()]
        remote = [self.known_row(k) for name, k in report.servers.items() if name not in {s.name for s in owned}]
        present = [*owned, *remote]
        return Response.json({
            "servers": present,
            "restart_pending": self.pending.sessions(),
            "checked_at": self.health.check_time,
            "checking": self.health.is_checking(),
            "suggested": [{"name": s.name, "title": s.title, "about": s.subject, "auth": s.auth, "key_var": s.key_var, "installed": self.present(s, present)} for s in self.catalogue.all()],
        })

    @staticmethod
    def present(suggestion, servers: list[ServerEntry]) -> bool:
        thresholds = {suggestion.url} | {item for item in suggestion.args if item.startswith("@")}
        return any(s.name == suggestion.name or any(s.origin(m) for m in thresholds) for s in servers)

    def row(self, server) -> ServerEntry:
        return ServerEntry(server.name, server.title, server.transport, server.state, True, command=" ".join([server.command, *server.args]).strip(), url=server.url,
                            auth=server.auth, key_var=server.key_var, has_key=server.needs_key and self.keys.has(server.key_var), last_error=server.last_error)

    @staticmethod
    def known_row(existing) -> ServerEntry:
        if existing.instructions.startswith("http"):
            return ServerEntry(existing.name, existing.name, "http", existing.state, False, url=existing.instructions, last_error=existing.error)
        return ServerEntry(existing.name, existing.name, "stdio", existing.state, False, command=existing.instructions, last_error=existing.error)

    def install(self, request: Request) -> Response:
        try:
            suggestion = self.catalogue.lookup(request.body.get("name", ""))
        except StopIteration:
            return Response.refused(f"{request.body.get('name', '')} is not a suggested server")
        return Response.json(self.row(self.installing.add(suggestion.server(), request.actor)))

    def key(self, request: Request) -> Response:
        try:
            server = self.servers.lookup(request.params["name"])
        except MissingRow as missing:
            return Response.missing(missing)
        if not server.key_var:
            return Response.refused(f"{server.title} takes no key")
        return Response.json(self.row(self.installing.keyed(server, request.body.get("value", ""), request.actor)))

    def remove(self, request: Request) -> Response:
        name = request.params["name"]
        try:
            server = self.servers.lookup(name)
        except MissingRow:
            if not self.installing.remove_known(name):
                return Response.absent(f"no server named {name}")
            return Response.json({"removed": name})
        self.installing.remove(server, request.actor)
        return Response.json({"removed": server.name})

    def login(self, request: Request) -> Response:
        try:
            server = self.servers.lookup(request.params["name"])
        except MissingRow as missing:
            return Response.missing(missing)
        if not self.installing.login(server):
            return Response.refused("no agent is running to sign in: start one first")
        return Response.json({"asked": server.name})

    def check(self, request: Request) -> Response:
        return Response.json({"servers": [self.row(s) for s in self.installing.checked(request.actor)]})
