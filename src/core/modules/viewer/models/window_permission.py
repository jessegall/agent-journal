from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType


@dataclass(frozen=True, kw_only=True)
class WindowPermission(Model):
    """What one person allowed in one environment: a window's read or command lines, as a JSON list, or a module's
    code in the page at the code fingerprint it was trusted at."""

    model_name = "window_permission"
    cli_name = "window-permission"

    environment_id: int
    person_id: int
    creator_id: int
    subject: str
    type: WindowPermissionType
    lines: str = "[]"
    fingerprint: str = ""
