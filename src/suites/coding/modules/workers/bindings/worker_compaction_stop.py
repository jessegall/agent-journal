from core.modules.drivers.support.compaction_stop import CompactionStop
from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_COMPACTED
from suites.coding.support.context_limit_check import ContextLimitCheck

COMPACTED_ROLES = (AgentRole.MAIN, CodingHelperRole.WORKER)


class WorkerCompactionStop(CompactionStop):
    """A main agent's or a worker's compaction is due once its context reaches the limit with no task to finish
    first, and always past the second limit, where its tools are refused. Its stop then goes through and types the
    compaction, unless its program compacts by its own window or a compaction is already asked for."""

    def __init__(self, limit_check: ContextLimitCheck) -> None:
        self.limit_check = limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.role not in COMPACTED_ROLES or not self.limit_check.needs_compaction(hook.agent_id):
            return super().answer(hook)
        if self.limit_check.compacts_by_window(hook.agent_id) or self.limit_check.is_compaction_requested(hook.agent_id, hook.timestamp):
            return RuleAnswer.final_allowance()
        return RuleAnswer.final_allowance(CONTEXT_COMPACTED.nudge()).running(CompactAgentContext(hook.agent_id))
