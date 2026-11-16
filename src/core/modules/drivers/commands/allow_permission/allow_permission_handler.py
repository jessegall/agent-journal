from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.allow_permission.allow_permission import AllowPermission
from engine.enums.grant_state import GrantState
from core.modules.drivers.models.driver_grant import DriverGrant
from core.modules.drivers.support.permission_answerers import PermissionAnswerers


class AllowPermissionHandler(Handler[AllowPermission, DriverGrant]):
    """Moves the request to allow, for the main agent or a user to answer it."""

    command = AllowPermission

    def __init__(self, queries: Queries, repository: Repository, answerers: PermissionAnswerers) -> None:
        self.queries, self.repository, self.answerers = queries, repository, answerers

    def handle(self, command: AllowPermission, context: Context) -> DriverGrant:
        request = self.queries.query(DriverGrant).find(command.request_id)
        self.answerers.check(request, context)
        return self.repository.update(request, context, grant_state=GrantState.APPROVED, responder_id=context.actor.id)
