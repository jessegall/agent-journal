from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.support.worker_nudges import WORKER_STATUS_FIRST
from suites.coding.support.coding_helper_role import CodingHelperRole

STATUS_COMMAND = "journal worker status"


class WorkerStatusFirstRule(DriverRule):
    """After a compaction a worker is blocked until it has run journal worker status, which says where it stands
    and which skills it must load; a new start needs none, since the brief is its prompt."""

    name = "workers.status-first"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.is_compaction_start:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(BlockUntil(hook.agent_id, WORKER_STATUS_FIRST.nudge(), RanCommand(STATUS_COMMAND)))
