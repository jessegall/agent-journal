from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.mcp.models.mcp_server import McpServer


@dataclass(frozen=True)
class AddServer(Command[McpServer]):
    """Adds an MCP server the catalogue does not suggest, by its name and its address or the command that
    starts it."""

    name: str
    target: str
