from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.commands.use_permission.use_permission import UsePermission
from core.modules.drivers.models.lifecycles.permission_lifecycle import PermissionLifecycle
from core.modules.drivers.models.permission_request import PermissionRequest


class UsePermissionHandler(Handler[UsePermission, PermissionRequest]):
    """Marks the allowed request as used."""

    command = UsePermission

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: UsePermission, context: Context) -> PermissionRequest:
        request = self.queries.query(PermissionRequest).find(command.request_id)
        return self.repository.save_change(request, request.moved(PermissionLifecycle.use), context)
