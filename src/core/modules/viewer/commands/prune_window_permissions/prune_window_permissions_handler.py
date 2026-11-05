from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.commands.prune_window_permissions.prune_window_permissions import PruneWindowPermissions
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType
from core.modules.environments.support.environment_rows import EnvironmentRows


class PruneWindowPermissionsHandler(Handler[PruneWindowPermissions, int]):
    """Deletes every permission whose window, dock or buttons no installed module declares, and every page trust of a
    module no longer installed, so installing it again asks again; answers how many it deleted."""

    command = PruneWindowPermissions

    def __init__(self, registry: Registry, queries: Queries, repository: Repository, kept: KeptRows, environments: EnvironmentRows) -> None:
        self.registry, self.queries, self.repository, self.kept = registry, queries, repository, kept
        self.environments = environments

    def handle(self, command: PruneWindowPermissions, context: Context) -> int:
        modules = {window.module for window in self.registry.windows}
        permissions = [permission for environment in self.environments.all() for permission in self.permissions(environment.id)]
        orphan_permissions = [permission for permission in permissions
                if (permission.subject not in modules if permission.type is WindowPermissionType.COMPONENT else not self.has_subject(permission.subject))]
        for permission in orphan_permissions:
            self.repository.delete_stored(permission, context)
            self.kept.update("window_permissions", lambda rows: tuple(row for row in rows if row.id != permission.id),
                             "environment_id = ?", [permission.environment_id], name="viewer.permission_catalogue")
        return len(orphan_permissions)

    def permissions(self, environment_id: int) -> tuple[WindowPermission, ...]:
        return self.kept.read("window_permissions", lambda: tuple(self.queries.query(WindowPermission).filter(environment_id=environment_id).all_rows()),
                              "environment_id = ?", [environment_id], name="viewer.permission_catalogue")

    def has_subject(self, subject: str) -> bool:
        return self.registry.has_window(subject) or self.registry.dock(subject) is not None or bool(self.registry.subject_button_lines(subject))
