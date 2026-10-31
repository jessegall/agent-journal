from typing import ClassVar

from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.models.window_permission import WindowPermission


class PersonRowGuard(Guard):
    """Refuses a viewer row of a person's own, a layout or a window permission, written by anyone but the person
    it is for; each subclass names its model and its refusal."""

    model: ClassVar[type[ViewerLayout] | type[WindowPermission]]
    refusal: ClassVar[Refusal]

    def check(self, change: Change[Model]) -> None:
        row = change.row
        if not isinstance(row, self.model) or change.event.endswith(".delete"):
            return
        actor = change.context.actor
        if actor.type is not ActorType.USER or actor.id != row.person_id:
            raise self.refusal
