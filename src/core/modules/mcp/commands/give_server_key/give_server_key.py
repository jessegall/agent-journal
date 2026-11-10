from dataclasses import dataclass, field

from engine.command.command import Command
from core.modules.mcp.models.mcp_server import McpServer


@dataclass(frozen=True)
class GiveServerKey(Command[McpServer]):
    """Keeps the key an installed server signs in with, in the keys file outside the project."""

    name: str
    key: str = field(repr=False)
