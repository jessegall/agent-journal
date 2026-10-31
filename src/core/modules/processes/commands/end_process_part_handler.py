from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.end_process_part import EndProcessPart
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process_part import ProcessPart


class EndProcessPartHandler(Handler[EndProcessPart, ProcessPart]):
    """Ends the part: finished on exit code 0, failed on another."""

    command = EndProcessPart

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndProcessPart, context: Context) -> ProcessPart:
        parts = self.queries.query(ProcessPart).filter(process_id=command.process_id, position=command.position).page(1, 1).rows
        if not parts:
            raise Refusal(f"process {command.process_id} has no part {command.position}", f"journal process-part list --process {command.process_id}")
        if parts[0].ended_at is not None:
            raise Refusal(f"part {command.position} of process {command.process_id} has ended already", "a part ends once")
        state = PartState.FINISHED if command.exit_code == 0 else PartState.FAILED
        return self.repository.save(replace(parts[0], state=state, exit_code=command.exit_code, started_at=parts[0].started_at or context.timestamp, ended_at=context.timestamp), context)
