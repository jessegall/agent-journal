from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery


class ReaderRequestSettled(BlockCondition):
    """The requested reader has been saved or the request waived."""

    name = "reader-request-settled"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(ReaderRequestQuery).find(int(self.text)).settled_at is not None
