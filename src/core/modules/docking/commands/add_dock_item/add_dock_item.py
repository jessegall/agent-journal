from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.docking.models.dock_item import DockItem


@dataclass(frozen=True)
class AddDockItem(Command[DockItem]):
    """Docks an item of a declared type above the chat of the environment in scope, within the limits of the
    type and the dock. A text given replaces the line the item reads from its row."""

    type: str
    row_model: str
    row_id: int
    text: str | None = None
