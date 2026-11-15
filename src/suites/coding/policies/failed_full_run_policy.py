from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.command_category import CommandCategory
from engine.query.conditions.greater import Greater
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.nudges.failed_full_run_nudge import FailedFullRunNudge


class FailedFullRunPolicy(EventPolicy):
    """Refuses a full test run while the agent's last one failed and no test run has passed since."""

    key = "processes.failed-full-run"
    rank = "shell.all"

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or not shell.has_full_test_run:
            return None
        last = self.processes.agent(agent_id).filter(is_full_test_run=True).newest().first()
        if last is None or last.state is not ProcessState.FAILED:
            return None
        passed = self.processes.agent(agent_id).filter(state=ProcessState.FINISHED, category=CommandCategory.TEST_RUN).matching(Greater("id", last.id)).exists()
        return None if passed else FailedFullRunNudge.declared().nudge()
