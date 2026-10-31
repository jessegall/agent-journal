import json

from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.query.queries import Queries
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.window_permission_type import WindowPermissionType


class WindowAllowances:
    """What one person allowed in one environment: the lines of a window's reads or runs, and whether a module's
    code is trusted in the page, which holds only at the code fingerprint it was trusted at."""

    def __init__(self, queries: Queries, finder: ModuleFinder, fingerprint: CodeFingerprint) -> None:
        self.queries, self.finder, self.fingerprint = queries, finder, fingerprint

    def permission(self, person_id: int, environment_id: int, subject: str, permission_type: WindowPermissionType) -> WindowPermission | None:
        rows = self.queries.query(WindowPermission).filter(person_id=person_id, environment_id=environment_id, subject=subject, type=permission_type).page(1, 1).rows
        return rows[0] if rows else None

    def allowed_lines(self, person_id: int, environment_id: int, window: str, permission_type: WindowPermissionType) -> list[str]:
        permission = self.permission(person_id, environment_id, window, permission_type)
        return json.loads(permission.lines) if permission is not None else []

    def module_fingerprint(self, module_name: str) -> str:
        return self.fingerprint.text([module for module in self.finder.modules() if module.name == module_name])

    def page_trusted(self, person_id: int, environment_id: int, module_name: str) -> bool:
        trust = self.permission(person_id, environment_id, module_name, WindowPermissionType.PAGE)
        return trust is not None and trust.fingerprint == self.module_fingerprint(module_name)
