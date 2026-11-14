from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process_part import ProcessPart


class StartProcessPartHandler(Handler[StartProcessPart, ProcessPart]):
    """Marks the part as running and keeps the time it started."""

    command = StartProcessPart

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: StartProcessPart, context: Context) -> ProcessPart:
        part = self.queries.query(ProcessPart).filter(process_id=command.process_id, position=command.position).first()
        if part is None:
            raise Refusal(f"process {command.process_id} has no part {command.position}", f"journal process-part list --process {command.process_id}")
        if part.state is not PartState.WAITING:
            raise Refusal(f"part {command.position} of process {command.process_id} has started already", "a part starts once")
        return self.repository.save(replace(part, state=PartState.RUNNING, started_at=context.timestamp), context)
