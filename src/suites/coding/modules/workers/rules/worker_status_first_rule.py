from suites.coding.modules.workers.types.worker import Worker
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from suites.coding.modules.workers.needs.worker_status_first_needs import STATUS_COMMAND, WORKER_STATUS_FIRST_KEY
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.nudges.worker_status_first_nudge import WorkerStatusFirstNudge


class WorkerStatusFirstRule(DriverRule):
    """The old walk's answer for WorkerStatusFirstNeeds, which owns it, until the walk is deleted."""

    name = WORKER_STATUS_FIRST_KEY
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [Worker.key]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.is_compaction_start:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(BlockUntil(hook.agent_id, WorkerStatusFirstNudge.declared().nudge(), RanCommand(STATUS_COMMAND)))
