from journal.models.mcp_server import McpServer
from journal.support.missing_row import MissingRow
from journal.repositories.repository import Repository


class McpServers(Repository[McpServer]):
    model = McpServer

    def reaching(self, title: str) -> list[McpServer]:
        return [server for server in self.all() if title.lower() in (server.name.lower(), server.title.lower())]

    def key_variables(self) -> set[str]:
        return {server.key_var for server in self.all() if server.needs_key}

    def lookup(self, name: str) -> McpServer:
        for server in self.all():
            if server.name == name:
                return server
        raise MissingRow("mcp server", name)
