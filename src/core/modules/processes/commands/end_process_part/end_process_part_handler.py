from dataclasses import replace

from engine.command.context import Context
from engine.command.completed_command_error import CompletedCommandError
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process_part import ProcessPart


class EndProcessPartHandler(Handler[EndProcessPart, ProcessPart]):
    """Ends the part: finished on exit code 0, failed on another."""

    command = EndProcessPart

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndProcessPart, context: Context) -> ProcessPart:
        part = self.queries.query(ProcessPart).filter(process_id=command.process_id, position=command.position).first()
        if part is None:
            raise Refusal(f"process {command.process_id} has no part {command.position}", f"journal process-part list --process {command.process_id}")
        if part.ended_at is not None:
            raise CompletedCommandError(f"part {command.position} of process {command.process_id} has ended already", "a part ends once")
        state = PartState.FINISHED if command.exit_code == 0 else PartState.FAILED
        return self.repository.save(replace(part, state=state, exit_code=command.exit_code, started_at=part.started_at or context.timestamp, ended_at=context.timestamp), context)
