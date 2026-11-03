from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery


class SequenceStepStarted(BlockCondition):
    """The waiting step has been taken up, advanced past or ended."""

    name = "sequence-step-started"
    subject_scoped = True

    def is_true(self, check: BlockCheck) -> bool:
        run_id, step_number = self.numbers
        run = check.container.get(SequenceRunQuery).current(check.hook.agent_id)
        if run is None:
            return True
        if (run.id, run.step_number) != (run_id, step_number):
            return True
        return run.step_started
