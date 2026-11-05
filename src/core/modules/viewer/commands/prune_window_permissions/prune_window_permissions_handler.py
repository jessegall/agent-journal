from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.base.scope.environment_scope import EnvironmentScope
from core.base.scope.scopes import Scopes
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.commands.prune_window_permissions.prune_window_permissions import PruneWindowPermissions
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType


class PruneWindowPermissionsHandler(Handler[PruneWindowPermissions, int]):
    """Deletes every permission whose window, dock or buttons no installed module declares, and every page trust of a
    module no longer installed, so installing it again asks again; answers how many it deleted."""

    command = PruneWindowPermissions
    disabled_scopes = [EnvironmentScope]

    def __init__(self, registry: Registry, queries: Queries, repository: Repository, kept: KeptRows, environments: EnvironmentRows, scopes: Scopes) -> None:
        self.registry, self.queries, self.repository, self.kept = registry, queries, repository, kept
        self.environments, self.scopes = environments, scopes

    def handle(self, command: PruneWindowPermissions, context: Context) -> int:
        modules = {window.module for window in self.registry.windows}
        permissions = [permission for environment in self.environments.all() for permission in self.permissions(environment.id)]
        orphan_permissions = [permission for permission in permissions
                if (permission.subject not in modules if permission.type is WindowPermissionType.COMPONENT else not self.has_subject(permission.subject))]
        for permission in orphan_permissions:
            self.repository.delete_stored(permission, context)
            self.drop_kept(permission)
        return len(orphan_permissions)

    def permissions(self, environment_id: int) -> tuple[WindowPermission, ...]:
        with self.scopes.read_scope((), None, environment_id):
            return self.kept.scoped_read("window_permissions", lambda: tuple(self.queries.query(WindowPermission).all_rows()), name="viewer.permission_catalogue")

    def drop_kept(self, permission: WindowPermission) -> None:
        with self.scopes.read_scope((), None, permission.environment_id):
            self.kept.scoped_update("window_permissions", lambda rows: tuple(row for row in rows if row.id != permission.id), name="viewer.permission_catalogue")

    def has_subject(self, subject: str) -> bool:
        return self.registry.has_window(subject) or self.registry.dock(subject) is not None or bool(self.registry.subject_button_lines(subject))
