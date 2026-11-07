from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.mcp.models.mcp_server import McpServer


@dataclass(frozen=True)
class RemoveServer(Command[McpServer]):
    """Takes an installed server out of the project, its configs and its key."""

    name: str
