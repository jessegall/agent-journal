from engine.driver.agent_hook import AgentHook
from engine.enums.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.greater import Greater
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_nudges import FAILED_FULL_RUN


class FailedFullRunRule(DriverRule):
    """Refuses a full test run while the agent's last one failed and no test run has passed since."""

    name = "processes.failed-full-run"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "Refuses a full test run while the agent's last one failed and no test run has passed since"

    def __init__(self, processes: ProcessQuery) -> None:
        self.processes = processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not shell.has_full_test_run:
            return RuleAnswer.allowed()
        last = self.processes.agent(hook.agent_id).filter(is_full_test_run=True).newest().first()
        if last is None or last.state is not ProcessState.FAILED:
            return RuleAnswer.allowed()
        passed = self.processes.agent(hook.agent_id).filter(state=ProcessState.FINISHED, category=CommandCategory.TEST_RUN).matching(Greater("id", last.id)).exists()
        return RuleAnswer.allowed() if passed else RuleAnswer.refused(FAILED_FULL_RUN.nudge())
