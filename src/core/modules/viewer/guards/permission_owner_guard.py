from core.base.refusal import Refusal
from core.modules.viewer.guards.person_row_guard import PersonRowGuard
from core.modules.viewer.models.window_permission import WindowPermission
from core.base.change.changed import Changed
from core.base.command.context import Context


class PermissionOwnerGuard(PersonRowGuard[Changed[WindowPermission]]):
    """Refuses a window permission written by anyone but the person it names, so no agent, window or other
    person gives rights for someone."""

    name = "viewer.permission-owner"
    refusal = Refusal("only the person a window permission is for may give it", "ask the user to allow it in the viewer")
