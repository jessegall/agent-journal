from journal.models.mcp_server import McpServer
from journal.support.missing_row import MissingRow
from journal.repositories.repository import Repository


class McpServers(Repository[McpServer]):
    model = McpServer

    def lookup(self, name: str) -> McpServer:
        for server in self.all():
            if server.name == name:
                return server
        raise MissingRow("mcp server", name)
