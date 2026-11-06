from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin
from core.modules.messages.models.message import Message
from core.modules.messages.models.message_work_source import MessageWorkSource
from core.modules.messages.queries.message_query import MessageQuery


class WorkSources:
    """Selects addressed person requests without changing delivery state."""

    def __init__(self, queries: Queries, messages: MessageQuery, repository: Repository, kept: KeptRows) -> None:
        self.queries, self.messages, self.repository = queries, messages, repository
        self.kept = kept

    def current(self, context: Context) -> MessageWorkSource | None:
        return self.kept.read("message_work_sources",
                              lambda: self.queries.query(MessageWorkSource).filter(agent_id=context.actor.id, environment_id=context.environment_id).first(),
                              "agent_id = ? AND environment_id = ?", [context.actor.id, context.environment_id], name="messages.work-source")

    def select(self, message: Message, origin: WorkSourceOrigin, context: Context) -> MessageWorkSource:
        if context.actor.type is not ActorType.AGENT or context.environment_id is None:
            raise Refusal("an agent selects a request in one environment")
        if message.type not in PERSON_MESSAGE_TYPES or message.environment_id != context.environment_id:
            raise Refusal("select a person request from this environment")
        if not self.messages.addressed(context.actor.id).filter(id=message.id).exists():
            raise Refusal("this message is addressed to another agent", "read your messages with journal message unread")
        return self.store(message, origin, context)

    def store(self, message: Message, origin: WorkSourceOrigin, context: Context) -> MessageWorkSource:
        selected = self.current(context)
        provisional = origin is WorkSourceOrigin.READ
        if selected is not None:
            return self.repository.update(selected, context, message_id=message.id, origin=origin, provisional=provisional, used=False)
        return self.repository.save(MessageWorkSource(creator_id=context.actor.id, agent_id=context.actor.id,
                                                     environment_id=context.environment_id, message_id=message.id,
                                                     origin=origin, provisional=provisional), context)

    def select_first(self, message: Message, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or message.type not in PERSON_MESSAGE_TYPES or context.environment_id is None:
            return
        selected = self.current(context)
        if selected is not None and selected.message_id is not None:
            return
        self.store(message, WorkSourceOrigin.READ, context)

    def clear(self, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or context.environment_id is None:
            raise Refusal("an agent clears its request in one environment")
        selected = self.current(context)
        if selected is not None:
            self.repository.update(selected, context, message_id=None, origin=WorkSourceOrigin.CLEAR, provisional=False, used=False)

    def clear_provisional(self, message: Message, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        selected = self.current(context)
        if selected is None or selected.message_id != message.id or not selected.provisional or selected.used:
            return
        self.clear(context)

    def use(self, selected: MessageWorkSource, context: Context) -> None:
        if selected.used:
            return
        self.repository.update(selected, context, used=True, provisional=False)
