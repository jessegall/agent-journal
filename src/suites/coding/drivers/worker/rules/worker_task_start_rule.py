from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.block_conditions.started_task_exists import StartedTaskExists
from suites.coding.needs.worker_task_start_needs import WORKER_TASK_START_KEY, WorkerTaskStartNeeds
from suites.coding.nudges.worker_task_unstarted_nudge import WorkerTaskUnstartedNudge


class WorkerTaskStartRule(DriverRule):
    """The old walk's answer for WorkerTaskStartNeeds, which owns it, until the walk is deleted."""

    name = WORKER_TASK_START_KEY
    hook = HookEventName.PRE_TOOL_USE

    def __init__(self, needs: WorkerTaskStartNeeds) -> None:
        self.needs = needs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.blocked(hook, WorkerTaskUnstartedNudge.declared().nudge(), StartedTaskExists()) if self.needs.is_waiting(hook.agent_id) else RuleAnswer.allowed()
