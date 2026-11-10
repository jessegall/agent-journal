from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.drivers.commands.record_overview_read.record_overview_read import RecordOverviewRead
from core.modules.drivers.models.overview_read import OverviewRead


class RecordOverviewReadHandler(Handler[RecordOverviewRead, None]):
    """Saves a read of an overview for the agent that made it."""

    command = RecordOverviewRead

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordOverviewRead, context: Context) -> None:
        agent_id = context.actor.id
        self.repository.save(OverviewRead(session_agent_id=agent_id, creator_id=agent_id, command_name=command.command_name, target=command.target), context)
