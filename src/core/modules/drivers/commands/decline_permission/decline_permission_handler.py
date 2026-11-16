from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.decline_permission.decline_permission import DeclinePermission
from engine.enums.grant_state import GrantState
from core.modules.drivers.models.driver_grant import DriverGrant
from core.modules.drivers.support.permission_answerers import PermissionAnswerers


class DeclinePermissionHandler(Handler[DeclinePermission, DriverGrant]):
    """Moves the request to decline, for the main agent or a user to answer it."""

    command = DeclinePermission

    def __init__(self, queries: Queries, repository: Repository, answerers: PermissionAnswerers) -> None:
        self.queries, self.repository, self.answerers = queries, repository, answerers

    def handle(self, command: DeclinePermission, context: Context) -> DriverGrant:
        request = self.queries.query(DriverGrant).find(command.request_id)
        self.answerers.check(request, context)
        return self.repository.update(request, context, grant_state=GrantState.DECLINED, responder_id=context.actor.id)
