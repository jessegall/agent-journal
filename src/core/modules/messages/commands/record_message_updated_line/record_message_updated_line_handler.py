from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.listeners.typed_line_listener import IDLE_MESSAGE_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.support.message_nudges import MESSAGE_UPDATED

UPDATED_SOURCE = "messages.updated"


class RecordMessageUpdatedLineHandler(Handler[RecordMessageUpdatedLine, None]):
    """Leaves the line for the main agent: typed when it sits idle, else carried by its next hook."""

    command = RecordMessageUpdatedLine

    def __init__(self, queries: Queries, repository: Repository, hook_calls: HookCallQuery) -> None:
        self.queries, self.repository, self.hook_calls = queries, repository, hook_calls

    def handle(self, command: RecordMessageUpdatedLine, context: Context) -> None:
        agents = self.queries.query(Agent).filter(environment_id=command.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows
        if not agents:
            return
        source = IDLE_MESSAGE_SOURCE if self.hook_calls.is_idle(agents[0].id, context.timestamp) else UPDATED_SOURCE
        self.repository.save(AgentLine(agent_id=agents[0].id, creator_id=context.actor.id, text=MESSAGE_UPDATED.nudge(message=command.message_id).text, source=source), context)
