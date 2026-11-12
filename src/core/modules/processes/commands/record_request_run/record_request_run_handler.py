from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun
from core.modules.processes.models.process import Process


class RecordRequestRunHandler(Handler[RecordRequestRun, Process]):
    """Writes the row of a request in one insert, running or already ended, in no queue place, with its kind."""

    command = RecordRequestRun

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordRequestRun, context: Context) -> Process:
        process = Process(session_agent_id=command.agent_id, creator_id=context.actor.id, line=command.line, folder="", shell="",
                          category=command.kind.category, limit_seconds=0, kind=command.kind.value, started_at=context.timestamp)
        saved = self.repository.save(process, context)
        if command.ended_with is None:
            return saved
        ended = saved.finish(context.timestamp, context.actor, 0) if command.ended_with == 0 else saved.fail(context.timestamp, context.actor, command.ended_with)
        return self.repository.save_change(saved, ended, context)
