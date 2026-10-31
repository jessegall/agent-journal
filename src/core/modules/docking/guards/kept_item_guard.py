from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.models.dock_item import DockItem


class KeptItemGuard(Guard):
    """An item a person kept stays in the dock until a person undocks it: an agent neither undocks it nor unkeeps it."""

    name = "docking.kept-by-person"
    event = "dock_item.*"

    def check(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if change.actor.type is not ActorType.AGENT or not isinstance(old, DockItem) or not old.kept or not isinstance(new, DockItem):
            return
        if new.state is not old.state or not new.kept:
            raise Refusal(f"dock item {old.id} was kept by a person", "only a person undocks it")
