from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from core.modules.processes.queries.output_query import OutputQuery


class OutputRead(BlockCondition):
    """This run's output has been read."""

    name = "output-read"

    def is_true(self, check: BlockCheck) -> bool:
        output = check.container.get(OutputQuery).process(int(self.text)).first()
        return output is None or output.read_at is not None
