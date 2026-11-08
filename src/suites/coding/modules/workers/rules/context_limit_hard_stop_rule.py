from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_HARD_STOP
from suites.coding.support.coding_agent_role import CodingAgentRole
from suites.coding.support.context_over_limit import ContextOverLimit

RETRY_SECONDS = Seconds(600)


class ContextLimitHardStopRule(DriverRule):
    """An agent whose context has passed the second limit may run no more tools, so it stops, whatever task it holds,
    and its context is compacted at once: the compaction is typed the first time and again after the retry time. A
    journal memory command still runs, because a stop waits for the memories to be weighed."""

    name = "workers.context-limit-hard-stop"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingAgentRole.MAIN, CodingAgentRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, history: HookHistory, over_limit: ContextOverLimit) -> None:
        self.history, self.over_limit = history, over_limit

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        is_memory_command = tool is not None and tool.shell is not None and bool(tool.shell.parts_running_journal_command("memory"))
        if is_memory_command or not self.over_limit.is_past_second_limit(hook.agent_id):
            return RuleAnswer.allowed()
        refusal = RuleAnswer.refused(CONTEXT_HARD_STOP.nudge())
        return refusal if self.history.has_recent_answer(self.name, hook, RETRY_SECONDS) else refusal.running(ChooseAgentControl(hook.agent_id, "context", self.over_limit.action()))
