from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.end_program_compaction.end_program_compaction import EndProgramCompaction
from core.modules.drivers.support.context_compactions import ContextCompactions


class EndProgramCompactionHandler(Handler[EndProgramCompaction, None]):
    """Ends the row of a compaction the journal ran through the agent's program and records that the agent was
    started again after it."""

    command = EndProgramCompaction

    def __init__(self, compactions: ContextCompactions) -> None:
        self.compactions = compactions

    def handle(self, command: EndProgramCompaction, context: Context) -> None:
        self.compactions.record_program_end(command.agent_id, context)
