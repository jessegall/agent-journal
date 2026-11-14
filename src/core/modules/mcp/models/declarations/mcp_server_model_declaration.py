from engine.module.model_declaration import ModelDeclaration
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery


class McpServerModelDeclaration(ModelDeclaration):
    """How the module declares McpServer."""

    model = McpServer
    query = McpServerQuery
    excluded_subcommands = ["make", "edit", "show", "list", "delete"]
