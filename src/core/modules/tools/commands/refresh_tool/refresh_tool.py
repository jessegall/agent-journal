from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tools.support.graph_status import GraphStatus


@dataclass(frozen=True)
class RefreshTool(Command[GraphStatus]):
    """Starts a refresh of a tool's graph in the folder, the project when none is named; with is_tick only when
    a commit has landed since the last refresh."""

    name: str
    folder: str
    is_tick: bool
