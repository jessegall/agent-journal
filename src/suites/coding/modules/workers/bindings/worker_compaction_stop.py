from core.modules.drivers.support.compaction_stop import CompactionStop
from engine.driver.agent_hook import AgentHook
from engine.driver.rule_answer import RuleAnswer
from engine.helper_type.helper_type_book import HelperTypeBook
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.nudges.context_compacted_nudge import ContextCompactedNudge
from suites.coding.support.context_limit_check import ContextLimitCheck


class WorkerCompactionStop(CompactionStop):
    """A main agent's or a worker's compaction is due once its context reaches the limit with no task to finish
    first, and always past the second limit, where its tools are refused. Its stop then goes through and types
    the compaction, unless its program compacts by its own window or a compaction is already asked for."""

    def __init__(self, limit_check: ContextLimitCheck, types: HelperTypeBook) -> None:
        self.limit_check, self.types = limit_check, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.types.behaviours(hook.role).takes_tasks or not self.limit_check.needs_compaction(hook.agent_id):
            return super().answer(hook)
        if self.limit_check.has_windowed_compaction(hook.agent_id) or self.limit_check.is_compaction_requested(hook.agent_id, hook.timestamp):
            return RuleAnswer.final_allowance()
        return RuleAnswer.final_allowance(ContextCompactedNudge.declared().nudge()).running(CompactAgentContext(hook.agent_id))
