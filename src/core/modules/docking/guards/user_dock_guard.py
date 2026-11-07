from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.dock_limits import DockLimits


class UserDockGuard(Guard[Changed[DockItem]]):
    """An agent cannot change or hide a card that requires a person."""

    name = "docking.person-card"
    is_safety = True

    def __init__(self, limits: DockLimits) -> None:
        self.limits = limits

    def check(self, event: Changed[DockItem], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or isinstance(event, Created):
            return
        previous = event.row if isinstance(event, Deleted) else event.old_row
        if self.limits.requires_user(previous.type):
            raise Refusal("an agent cannot change a card waiting for a person")
