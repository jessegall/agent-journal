from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.modules.mcp.models.mcp_server import McpServer


class McpServerQuery(Query[McpServer]):
    """Reads the installed MCP servers, and one by its name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, McpServer)

    def named(self, name: str) -> McpServer:
        found = self.filter(name=name).page(1, 1).rows
        if not found:
            raise Refusal(f"no installed server is named {name}", "journal mcp list shows them")
        return found[0]
