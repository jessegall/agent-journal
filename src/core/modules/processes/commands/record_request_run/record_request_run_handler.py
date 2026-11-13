from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun
from core.modules.processes.models.request_run import RequestRun


class RecordRequestRunHandler(Handler[RecordRequestRun, RequestRun]):
    """Writes the row of an ended request in one insert."""

    command = RecordRequestRun

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordRequestRun, context: Context) -> RequestRun:
        return self.repository.save(RequestRun(session_agent_id=command.agent_id, creator_id=context.actor.id, process_type=command.process_type, line=command.line,
                                               exit_code=command.exit_code, ended_at=context.timestamp), context)
