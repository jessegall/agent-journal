from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.processes.commands.record_request_run.record_request_run import RecordRequestRun
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process


class RecordRequestRunHandler(Handler[RecordRequestRun, Process]):
    """Writes the row of a request in one insert, running or already ended, in no queue place, with its kind; a row
    written ended makes no move, so no listener of a run's end has work."""

    command = RecordRequestRun

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordRequestRun, context: Context) -> Process:
        process = Process(session_agent_id=command.agent_id, creator_id=context.actor.id, line=command.line, folder="", shell="",
                          category=command.kind.category, limit_seconds=0, kind=command.kind.value, started_at=context.timestamp)
        if command.ended_with is not None:
            ended_state = ProcessState.FINISHED if command.ended_with == 0 else ProcessState.FAILED
            process = replace(process, state=ended_state, exit_code=command.ended_with, ended_at=context.timestamp, progress=100)
        return self.repository.save(process, context)
