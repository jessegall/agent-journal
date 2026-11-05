from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.models.message import Message


class MessagesRead(BlockCondition):
    """These messages have been read."""

    name = "messages-read"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(Queries).query(Message).matching(Among("id", tuple(self.numbers))).matching(IsNull("read_at")).exists()
