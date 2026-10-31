import json

from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.window_permission_type import WindowPermissionType


class WindowAllowances:
    """What one person allowed in one environment: the lines of a window's reads or runs, and whether a module's
    code is trusted in the page, which holds only at the code fingerprint it was trusted at."""

    def __init__(self, queries: Queries, registry: Registry) -> None:
        self.queries, self.registry = queries, registry

    def permission(self, person_id: int, environment_id: int, subject: str, permission_type: WindowPermissionType) -> WindowPermission | None:
        rows = self.queries.query(WindowPermission).filter(person_id=person_id, environment_id=environment_id, subject=subject, type=permission_type).page(1, 1).rows
        return rows[0] if rows else None

    def allowed_lines(self, person_id: int, environment_id: int, window: str, permission_type: WindowPermissionType) -> list[str]:
        permission = self.permission(person_id, environment_id, window, permission_type)
        return json.loads(permission.lines) if permission is not None else []

    def page_trusted(self, person_id: int, environment_id: int, module_name: str) -> bool:
        trust = self.permission(person_id, environment_id, module_name, WindowPermissionType.PAGE)
        return trust is not None and trust.fingerprint == self.registry.module_fingerprints.get(module_name)
