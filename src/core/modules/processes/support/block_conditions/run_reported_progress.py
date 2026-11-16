from engine.driver.block_check import BlockCheck
from core.modules.processes.support.block_conditions.process_condition import ProcessCondition
from core.modules.processes.support.blocked_runs import BlockedRuns


class RunReportedProgress(ProcessCondition):
    """This run holds the agent no more: it printed or was read within the hang time, a user released its hold, or it
    ended."""

    name = "run-heard-from"

    def is_true(self, check: BlockCheck) -> bool:
        blocked_run = check.container.get(BlockedRuns).found(check.hook.agent_id, check.hook.timestamp)
        return blocked_run is None or blocked_run.process.id != int(self.text)
