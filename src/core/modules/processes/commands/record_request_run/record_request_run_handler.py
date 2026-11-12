from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun
from core.modules.processes.models.process import Process


class RecordRequestRunHandler(Handler[RecordRequestRun, Process]):
    """Writes the row of a request in one insert: running, in no queue place, with its kind."""

    command = RecordRequestRun

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordRequestRun, context: Context) -> Process:
        return self.repository.save(Process(session_agent_id=command.agent_id, creator_id=context.actor.id, line=command.line, folder="", shell="",
                                            category=command.kind.category, limit_seconds=0, kind=command.kind.value, started_at=context.timestamp), context)
