from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.modules.processes.queries.output_query import OutputQuery


class OutputRead(BlockCondition):
    """This run's output has been read."""

    name = "output-read"

    def is_true(self, check: BlockCheck) -> bool:
        outputs = check.container.get(OutputQuery).process(int(self.text)).limited(1)
        return not outputs or outputs[0].read_at is not None
