from core.base.actor_type import ActorType
from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions


class MessagesAnswered(BlockCondition):
    """The agent replied to or reacted on each of these messages."""

    name = "messages-answered"

    def is_true(self, check: BlockCheck) -> bool:
        queries = check.container.get(Queries)
        replied = {reply.parent_id for reply in queries.query(Message).matching(Among("parent_id", tuple(self.numbers))).all_rows()}
        return all(message.id in replied or MessageReactions.has_actor(message, ActorType.AGENT.value) for message in queries.query(Message).matching(Among("id", tuple(self.numbers))).all_rows())
