from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.viewer.viewer_layout import ViewerLayout


class PersonKeepsLayouts(Guard):
    """Refuses a layout written by anyone but the person it is for, so no agent or other person arranges someone's
    pages."""

    name = "viewer.person-keeps-layouts"
    event = "viewer_layout.*"

    def check(self, change: Change[Model]) -> None:
        layout = change.row
        if not isinstance(layout, ViewerLayout) or change.event.endswith(".delete"):
            return
        actor = change.context.actor
        if actor.type is not ActorType.USER or actor.id != layout.person_id:
            raise Refusal("only a person keeps a layout", "the viewer saves a layout when the person arranges a page")
