from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_program_compaction.record_program_compaction import RecordProgramCompaction
from core.modules.drivers.support.context_compactions import ContextCompactions


class RecordProgramCompactionHandler(Handler[RecordProgramCompaction, None]):
    """Makes the started row of a compaction the journal ran by starting the agent's program on its line."""

    command = RecordProgramCompaction

    def __init__(self, compactions: ContextCompactions) -> None:
        self.compactions = compactions

    def handle(self, command: RecordProgramCompaction, context: Context) -> None:
        self.compactions.record_program_start(command.agent_id, command.request_tokens, command.line, context)
