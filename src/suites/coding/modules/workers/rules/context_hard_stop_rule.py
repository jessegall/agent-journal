from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_HARD_STOP
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from suites.coding.support.context_limit_check import ContextLimitCheck


class ContextHardStopRule(DriverRule):
    """An agent whose context has passed the second limit may run no more tools, so it stops, whatever task it
    holds, and its context is compacted at once: the compaction is typed the first time and again after the
    retry time. A journal memory command still runs, because a stop waits for the memories to be weighed."""

    name = "workers.context-limit-hard-stop"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]
    refuses_one_action = "An agent past the second context limit may run no more tools, so it must stop"

    def __init__(self, limit_check: ContextLimitCheck) -> None:
        self.limit_check = limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool =hook.event.tool
        is_memory_command = tool is not None and tool.shell is not None and bool(tool.shell.parts_running_journal_command("memory"))
        if is_memory_command or not self.limit_check.exceeds_hard_limit(hook.agent_id):
            return RuleAnswer.allowed()
        refusal = RuleAnswer.refused(CONTEXT_HARD_STOP.nudge())
        return refusal if self.limit_check.is_compaction_requested(hook.agent_id, hook.timestamp) else refusal.running(CompactAgentContext(hook.agent_id))
