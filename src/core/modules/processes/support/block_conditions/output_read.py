from core.modules.processes.support.run_output_rows import RunOutputRows
from engine.driver.block_check import BlockCheck
from core.modules.processes.support.block_conditions.process_condition import ProcessCondition


class OutputRead(ProcessCondition):
    """This run's output has been read."""

    name = "output-read"

    def is_true(self, check: BlockCheck) -> bool:
        output = check.container.get(RunOutputRows).run_output(int(self.text))
        return output is None or output.read_at is not None
