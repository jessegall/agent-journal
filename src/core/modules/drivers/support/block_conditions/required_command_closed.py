from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.drivers.models.required_command import RequiredCommand


class RequiredCommandClosed(BlockCondition):
    """This required command ran or was skipped."""

    name = "required-command-closed"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(RequiredCommand).find(int(self.text)).closed_at is not None
