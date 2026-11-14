from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.query import Query
from engine.errors.refusal import Refusal
from core.modules.mcp.models.mcp_server import McpServer


class McpServerQuery(Query[McpServer]):
    """Reads the installed MCP servers, and one by its name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, McpServer)

    def find_name(self, name: str) -> McpServer:
        server = self.filter(name=name).first()
        if server is None:
            raise Refusal(f"no installed server is named {name}", "journal mcp list shows them")
        return server
