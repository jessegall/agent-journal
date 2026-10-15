from journal.features.mcp.catalogue import Catalogue
from journal.features.mcp.installing import Installing
from journal.features.mcp.keys import Keys
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.mcp_servers import McpServers
from journal.repositories.not_found import NotFound


class McpController:
    """The integrations page: the project's MCP servers and how they stand, the suggestions, and the acts on them."""

    def __init__(self, servers: McpServers, catalogue: Catalogue, keys: Keys, installing: Installing) -> None:
        self.servers, self.catalogue, self.keys, self.installing = servers, catalogue, keys, installing

    def index(self, request: Request) -> Response:
        installed = {s.name for s in self.servers.all()}
        return Response.json({
            "servers": [self.row(s) for s in self.servers.all()],
            "suggested": [{"name": s.name, "title": s.title, "about": s.about, "auth": s.auth, "key_var": s.key_var, "installed": s.name in installed} for s in self.catalogue.all()],
        })

    def row(self, server) -> dict:
        return {"name": server.name, "title": server.title, "transport": server.transport, "command": " ".join([server.command, *server.args]).strip(), "url": server.url,
                "auth": server.auth, "key_var": server.key_var, "has_key": bool(server.key_var) and self.keys.has(server.key_var), "state": server.state, "last_error": server.last_error}

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
        try:
            server = self.servers.named(request.params["name"])
        except NotFound as missing:
            return Response.not_found(str(missing))
        self.installing.remove(server, request.actor)
        return Response.json({"removed": server.name})

    def check(self, request: Request) -> Response:
        return Response.json({"servers": [self.row(s) for s in self.installing.checked(request.actor)]})
