from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.commands.decline_permission.decline_permission import DeclinePermission
from core.modules.drivers.models.lifecycles.permission_lifecycle import PermissionLifecycle
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.support.permission_answerers import PermissionAnswerers


class DeclinePermissionHandler(Handler[DeclinePermission, PermissionRequest]):
    """Moves the request to decline, for the main agent or a person to answer it."""

    command = DeclinePermission

    def __init__(self, queries: Queries, repository: Repository, answerers: PermissionAnswerers) -> None:
        self.queries, self.repository, self.answerers = queries, repository, answerers

    def handle(self, command: DeclinePermission, context: Context) -> PermissionRequest:
        request = self.queries.query(PermissionRequest).find(command.request_id)
        self.answerers.check(request, context)
        return self.repository.save_change(request, request.moved(PermissionLifecycle.decline, responder_id=context.actor.id), context)
