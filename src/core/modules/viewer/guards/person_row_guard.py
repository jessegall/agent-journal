from typing import ClassVar

from core.base.actor_type import ActorType
from core.base.change.deleted import Deleted
from core.base.change.event_subscriber import E
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.viewer.models.person_preset import PersonPreset
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.models.window_permission import WindowPermission


class PersonRowGuard(Guard[E]):
    """Refuses a viewer row of a person's own, a layout, a person's preset or a window permission, written by
    anyone but the person it is for; each subclass names its model and its refusal."""

    refusal: ClassVar[Refusal]

    def check(self, event: E, context: Context) -> None:
        if isinstance(event, Deleted):
            return
        actor = context.actor
        if actor.type is not ActorType.USER or actor.id != event.row.person_id:
            raise self.refusal
