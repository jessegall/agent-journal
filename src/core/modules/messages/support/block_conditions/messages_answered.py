from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_replies import MessageReplies


class MessagesAnswered(BlockCondition):
    """The agent answered each of these messages."""

    name = "messages-answered"

    def is_true(self, check: BlockCheck) -> bool:
        messages = tuple(check.container.get(Queries).query(Message).matching(Among("id", tuple(self.numbers))).all_rows())
        return len(check.container.get(MessageReplies).answered_ids(check.hook.agent_id, messages)) == len(messages)
