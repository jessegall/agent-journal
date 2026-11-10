from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.messages.models.message import Message


class MessagesRead(BlockCondition):
    """These messages have been read."""

    name = "messages-read"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(Queries).query(Message).matching(Among("id", tuple(self.numbers))).matching(IsNull("read_at")).exists()
