from journal.features.mcp.catalogue import Catalogue
from journal.features.mcp.health import Health
from journal.features.mcp.installing import Installing
from journal.features.mcp.keys import Keys
from journal.features.mcp.pending_restarts import PendingRestarts
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.mcp_servers import McpServers
from journal.repositories.not_found import NotFound


class McpController:
    """The integrations page: the project's MCP servers and how they stand, the suggestions, and the acts on them."""

    def __init__(self, servers: McpServers, catalogue: Catalogue, keys: Keys, installing: Installing, health: Health, pending: PendingRestarts) -> None:
        self.servers, self.catalogue, self.keys, self.installing, self.health, self.pending = servers, catalogue, keys, installing, health, pending

    def index(self, request: Request) -> Response:
        """The journal's own servers and, after them, the ones the program has from elsewhere: shown with their state, not managed from here."""
        own = [self.row(s) for s in self.servers.all()]
        elsewhere = [self.known_row(k) for name, k in self.health.of_all().items() if name != "*" and name not in {s["name"] for s in own}]
        present = [*own, *elsewhere]
        return Response.json({
            "servers": present,
            "restart_pending": self.pending.sessions(),
            "suggested": [{"name": s.name, "title": s.title, "about": s.about, "auth": s.auth, "key_var": s.key_var, "installed": self.present(s, present)} for s in self.catalogue.all()],
        })

    @staticmethod
    def present(suggestion, servers: list[dict]) -> bool:
        """A suggestion is already there by its name, or by the url or package the program runs it from."""
        marks = {suggestion.url} | {a for a in suggestion.args if a.startswith("@")}
        return any(s["name"] == suggestion.name or any(m and m in f"{s['command']} {s['url']}" for m in marks) for s in servers)

    def row(self, server) -> dict:
        return {"name": server.name, "title": server.title, "transport": server.transport, "command": " ".join([server.command, *server.args]).strip(), "url": server.url,
                "auth": server.auth, "key_var": server.key_var, "has_key": bool(server.key_var) and self.keys.has(server.key_var), "state": server.state, "last_error": server.last_error, "managed": True}

    @staticmethod
    def known_row(known) -> dict:
        http = known.how.startswith("http")
        return {"name": known.name, "title": known.name, "transport": "http" if http else "stdio", "command": "" if http else known.how, "url": known.how if http else "",
                "auth": "none", "key_var": "", "has_key": False, "state": known.state, "last_error": known.words if known.state == "failed" else "", "managed": False}

    def install(self, request: Request) -> Response:
        try:
            suggestion = self.catalogue.named(request.body.get("name", ""))
        except StopIteration:
            return Response.refused(f"{request.body.get('name', '')} is not a suggested server")
        return Response.json(self.row(self.installing.add(suggestion.server(), request.actor)))

    def key(self, request: Request) -> Response:
        try:
            server = self.servers.named(request.params["name"])
        except NotFound as missing:
            return Response.not_found(str(missing))
        if not server.key_var:
            return Response.refused(f"{server.title} takes no key")
        return Response.json(self.row(self.installing.keyed(server, request.body.get("value", ""), request.actor)))

    def remove(self, request: Request) -> Response:
        name = request.params["name"]
        try:
            server = self.servers.named(name)
        except NotFound:
            if not self.installing.remove_known(name):
                return Response.not_found(f"no server named {name}")
            return Response.json({"removed": name})
        self.installing.remove(server, request.actor)
        return Response.json({"removed": server.name})

    def sign_in(self, request: Request) -> Response:
        try:
            server = self.servers.named(request.params["name"])
        except NotFound as missing:
            return Response.not_found(str(missing))
        if not self.installing.sign_in(server):
            return Response.refused("no agent is running to sign in: start one first")
        return Response.json({"asked": server.name})

    def check(self, request: Request) -> Response:
        return Response.json({"servers": [self.row(s) for s in self.installing.checked(request.actor)]})
