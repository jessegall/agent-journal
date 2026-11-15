from core.modules.processes.support.run_output_rows import RunOutputRows
from engine.driver.block_check import BlockCheck
from core.modules.processes.support.block_conditions.process_condition import ProcessCondition


class OutputReadSinceBlock(ProcessCondition):
    """This run's output was read since the block opened, or it has no output to read."""

    name = "output-read-since-block"

    def is_true(self, check: BlockCheck) -> bool:
        output = check.container.get(RunOutputRows).of_run(int(self.text))
        return output is None or (output.last_read_at is not None and output.last_read_at.value >= check.opened_at.value)
