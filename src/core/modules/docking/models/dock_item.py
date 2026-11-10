from dataclasses import dataclass

from engine.actor.actor import Actor
from core.base.model.model import Model
from core.base.model.session_bound import SessionBound
from engine.time.timestamp import Timestamp
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.models.lifecycles.dock_item_lifecycle import DockItemLifecycle


@dataclass(frozen=True, kw_only=True)
class DockItem(SessionBound, Model):
    """One item docked above the chat: an item of a type a module declared, about one row it points at and
    never copies, kept by a person or leaving by itself once its row ends."""

    model_name = "dock_item"
    cli_name = "dock-item"
    lifecycle = DockItemLifecycle

    dock_id: int
    session_agent_id: int | None = None
    creator_id: int
    type: str
    target_model: str
    target_id: int
    title: str = ""
    text: str = ""
    kept: bool = False
    state: DockItemState = DockItemState.DOCKED
    leaves_at: Timestamp | None = None
    undocked_at: Timestamp | None = None

    def undock(self, timestamp: Timestamp, actor: Actor) -> "DockItem":
        return self.moved(DockItemLifecycle.undock, undocked_at=timestamp)

    def dock(self, timestamp: Timestamp, actor: Actor) -> "DockItem":
        return self.moved(DockItemLifecycle.dock, undocked_at=None)

