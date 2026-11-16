from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.grant_state import GrantState
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.use_grant.use_grant import UseGrant
from core.modules.drivers.models.driver_grant import DriverGrant


class UseGrantHandler(Handler[UseGrant, DriverGrant]):
    """Spends a grant, so it passes one action only."""

    command = UseGrant

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: UseGrant, context: Context) -> DriverGrant:
        return self.repository.update(self.queries.query(DriverGrant).find(command.grant_id), context, grant_state=GrantState.SPENT, spending_event_id=command.event_id)
