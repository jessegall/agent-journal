from core.base.viewer.model_searcher import ModelSearcher
from core.modules.mcp.models.mcp_server import McpServer


class ServerSearcher(ModelSearcher):
    """Finds the servers whose name or title holds the words."""

    model = McpServer
