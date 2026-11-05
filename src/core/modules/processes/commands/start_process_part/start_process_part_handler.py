from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process_part import ProcessPart


class StartProcessPartHandler(Handler[StartProcessPart, ProcessPart]):
    """Marks the part as running and keeps the time it started."""

    command = StartProcessPart

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: StartProcessPart, context: Context) -> ProcessPart:
        parts = self.queries.query(ProcessPart).filter(process_id=command.process_id, position=command.position).limited(1)
        if not parts:
            raise Refusal(f"process {command.process_id} has no part {command.position}", f"journal process-part list --process {command.process_id}")
        if parts[0].state is not PartState.WAITING:
            raise Refusal(f"part {command.position} of process {command.process_id} has started already", "a part starts once")
        return self.repository.save(replace(parts[0], state=PartState.RUNNING, started_at=context.timestamp), context)
