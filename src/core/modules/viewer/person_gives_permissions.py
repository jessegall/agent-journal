from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.viewer.window_permission import WindowPermission


class PersonGivesPermissions(Guard):
    """Refuses a window permission written by anyone but the person it names, so no agent, window or other person
    gives rights for someone."""

    name = "viewer.person-gives-permissions"
    event = "window_permission.*"

    def check(self, change: Change[Model]) -> None:
        permission = change.row
        if not isinstance(permission, WindowPermission) or change.event.endswith(".delete"):
            return
        actor = change.context.actor
        if actor.type is not ActorType.USER or actor.id != permission.person_id:
            raise Refusal("only the person a window permission is for may give it", "ask the user to allow it in the viewer")
