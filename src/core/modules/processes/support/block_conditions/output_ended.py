from engine.driver.block_check import BlockCheck
from core.modules.processes.support.block_conditions.process_condition import ProcessCondition
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.queries.process_query import ProcessQuery


class OutputEnded(ProcessCondition):
    """This run has ended."""

    name = "output-ended"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(ProcessQuery).find(int(self.text)).state not in (ProcessState.RUNNING, ProcessState.BACKGROUND)
