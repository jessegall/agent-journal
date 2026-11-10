from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.record_given_percent.record_given_percent import RecordGivenPercent
from core.modules.processes.models.watch import Watch


class RecordGivenPercentHandler(Handler[RecordGivenPercent, Watch]):
    """Saves the percent a watch last told the agent of."""

    command = RecordGivenPercent

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordGivenPercent, context: Context) -> Watch:
        return self.repository.update(self.queries.query(Watch).find(command.watch_id), context, given_percent=command.given_percent)
