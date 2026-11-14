from dataclasses import dataclass

from engine.command.command import Command
from core.modules.mcp.models.mcp_server import McpServer


@dataclass(frozen=True)
class InstallServer(Command[McpServer]):
    """Installs a suggested MCP server by its name and writes it into the agent programs' configs."""

    name: str
