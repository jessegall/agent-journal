from core.base.refusal import Refusal
from core.modules.viewer.person_row_guard import PersonRowGuard
from core.modules.viewer.window_permission import WindowPermission


class PersonGivesPermissions(PersonRowGuard):
    """Refuses a window permission written by anyone but the person it names, so no agent, window or other person
    gives rights for someone."""

    name = "viewer.person-gives-permissions"
    event = "window_permission.*"
    model = WindowPermission
    refusal = Refusal("only the person a window permission is for may give it", "ask the user to allow it in the viewer")
