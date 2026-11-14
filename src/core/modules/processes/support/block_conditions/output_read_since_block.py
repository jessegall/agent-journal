from engine.driver.block_check import BlockCheck
from core.modules.processes.support.block_conditions.process_condition import ProcessCondition
from core.modules.processes.queries.output_query import OutputQuery


class OutputReadSinceBlock(ProcessCondition):
    """This run's output was read since the block opened, or it has no output to read."""

    name = "output-read-since-block"

    def is_true(self, check: BlockCheck) -> bool:
        output = check.container.get(OutputQuery).process(int(self.text)).first()
        return output is None or (output.last_read_at is not None and output.last_read_at.value >= check.opened_at.value)
