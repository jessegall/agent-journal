from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.prune_window_permissions import PruneWindowPermissions
from core.modules.viewer.window_permission_type import WindowPermissionType


class PruneWindowPermissionsHandler(Handler[PruneWindowPermissions, int]):
    """Deletes every permission whose window no installed module declares, and every page trust of a module no
    longer installed, so installing it again asks again; answers how many it deleted."""

    command = PruneWindowPermissions

    def __init__(self, registry: Registry, queries: Queries, repository: Repository) -> None:
        self.registry, self.queries, self.repository = registry, queries, repository

    def handle(self, command: PruneWindowPermissions, context: Context) -> int:
        modules = {window.module for window in self.registry.windows}
        orphan_permissions = [permission for permission in self.queries.query(WindowPermission).all_rows()
                if (permission.subject not in modules if permission.type is WindowPermissionType.COMPONENT else not self.registry.has_window(permission.subject))]
        for permission in orphan_permissions:
            self.repository.delete(permission, context)
        return len(orphan_permissions)
