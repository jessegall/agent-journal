from itertools import islice

from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message

UNREAD_LIMIT = 25
UNREAD_LIMIT_REASON = "an agent holds no more than its newest unread messages"


class UnreadLimitListener(SaveListener[Created[Message]]):
    """An agent holds at most its newest 25 unread messages: a new person message marks read the unread ones of
    the same agent beyond those 25, so no backlog ever reaches an agent."""

    name = "messages.unread-limit"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Created[Message], context: Context) -> None:
        message = event.row
        if message.type not in PERSON_MESSAGE_TYPES or message.read_at is not None:
            return
        unread = self.queries.query(Message).filter(environment_id=message.environment_id).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at"))
        same_agent = unread.matching(IsNull("target_agent_id")) if message.target_agent_id is None else unread.filter(target_agent_id=message.target_agent_id)
        for older in islice(same_agent.newest().every_row(UNREAD_LIMIT_REASON), UNREAD_LIMIT, None):
            self.repository.update(older, context, read_at=context.timestamp)
