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
from core.modules.messages.commands.record_idle_message_line.record_idle_message_line import RecordIdleMessageLine
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_nudges import NEW_MESSAGE


class RecordIdleMessageLineHandler(Handler[RecordIdleMessageLine, Message | None]):
    """An idle main agent, paused or not, sends no hook that could carry a message, so the first of the queue
    is typed to it; the rest reach it by the hooks that follow, once it wakes."""

    command = RecordIdleMessageLine

    def __init__(self, queries: Queries, repository: Repository, hook_calls: HookCallQuery) -> None:
        self.queries, self.repository, self.hook_calls = queries, repository, hook_calls

    def handle(self, command: RecordIdleMessageLine, context: Context) -> Message | None:
        agents = self.queries.query(Agent).filter(environment_id=command.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows
        if not agents or not self.hook_calls.is_idle(agents[0].id, context.timestamp):
            return None
        waiting = self.queries.query(Message).filter(environment_id=command.environment_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).oldest().page(1, 1).rows
        if not waiting or waiting[0].delivered_at is not None:
            return None
        self.repository.save(AgentLine(agent_id=agents[0].id, creator_id=context.actor.id, text=NEW_MESSAGE.nudge(message=waiting[0].id).text, source=IDLE_MESSAGE_SOURCE), context)
        return self.repository.save(waiting[0].changed(delivered_at=context.timestamp), context)
