import json
from engine.database.kept_rows import KeptRows

from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType


class WindowAllowances:
    """What one person allowed in one environment: the lines of a window's reads or runs, and whether a
    module's code is trusted in the page, which holds only at the code fingerprint it was trusted at."""

    def __init__(self, queries: Queries, registry: Registry, kept: KeptRows) -> None:
        self.queries, self.registry, self.kept = queries, registry, kept

    def permission(self, person_id: int, subject: str, permission_type: WindowPermissionType) -> WindowPermission | None:
        query = self.queries.query(WindowPermission).filter(person_id=person_id, subject=subject, type=permission_type)
        return self.kept.scoped_read("window_permissions", query.first, "person_id = ? AND subject = ? AND type = ?",
                                       [person_id, subject, permission_type], name="viewer.permission")

    def allowed_lines(self, person_id: int, window: str, permission_type: WindowPermissionType) -> list[str]:
        permission = self.permission(person_id, window, permission_type)
        return json.loads(permission.lines) if permission is not None else []

    def component_trusted(self, person_id: int, module_name: str) -> bool:
        trust = self.permission(person_id, module_name, WindowPermissionType.COMPONENT)
        return trust is not None and trust.fingerprint == self.registry.module_fingerprints.get(module_name)
