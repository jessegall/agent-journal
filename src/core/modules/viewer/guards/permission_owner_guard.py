from engine.errors.refusal import Refusal
from core.modules.viewer.guards.person_row_guard import PersonRowGuard
from core.modules.viewer.models.window_permission import WindowPermission
from engine.change.changed import Changed


class PermissionOwnerGuard(PersonRowGuard[Changed[WindowPermission]]):
    """Refuses a window permission written by anyone but the person it names, so no agent, window or other
    person gives rights for someone."""

    name = "viewer.permission-owner"
    refusal = Refusal("these permissions belong to another person")
    question = "Change these window permissions?"

    def person_id(self, event: Changed[WindowPermission]) -> int:
        return event.row.person_id
