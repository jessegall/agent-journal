from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.drivers.commands.record_bypass_line.record_bypass_line import RecordBypassLine
from core.modules.drivers.models.agent_line import AgentLine

LINE_SOURCE = "drivers.bypass"


class RecordBypassLineHandler(Handler[RecordBypassLine, AgentLine]):
    """Saves the line, which waits for the agent's next hook."""

    command = RecordBypassLine

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordBypassLine, context: Context) -> AgentLine:
        return self.repository.save(AgentLine(agent_id=command.agent_id, creator_id=context.actor.id, source=LINE_SOURCE,
                                              text=f"while the journal did not answer, {command.count} of your hooks went through unchecked: check what you ran then"), context)
