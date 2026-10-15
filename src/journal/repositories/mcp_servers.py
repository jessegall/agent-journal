from journal.models.mcp_server import McpServer
from journal.repositories.not_found import NotFound
from journal.repositories.repository import Repository


class McpServers(Repository[McpServer]):
    model = McpServer

    def named(self, name: str) -> McpServer:
        for server in self.all():
            if server.name == name:
                return server
        raise NotFound(f"no MCP server named {name}")
