from engine.driver.agent_hook import AgentHook
from core.modules.processes.support.output_watch_call import OutputWatchCall
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_HARD_STOP
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from suites.coding.support.context_limit_check import ContextLimitCheck


STOP_REQUIREMENT_COMMANDS = ("memory", "message", "wait", "refusal", "agent-block", "overview", "question", "sequence", "skill required",
                             "doc close", "report close", "task log", "task test", "task close", "task block", "task start", "task overview")


class ContextHardStopRule(DriverRule):
    """An agent whose context has passed the second limit may run no more tools, so it stops, whatever task it
    holds, and its context is compacted at once: the compaction is typed once. A shell line made only of the journal commands a stop can be refused for still runs, such as
    reading a message or weighing the memories, and so does the watch of an output: without them the agent could
    neither run a tool nor stop. While a typed compaction has not started, this rule types no second one: a tool
    use shows the agent is in a turn, so the typed line still waits in the program."""

    name = "workers.context-limit-hard-stop"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]
    single_action_refusal = "An agent past the second context limit may run no more tools, so it must stop"

    def __init__(self, limit_check: ContextLimitCheck, watch_call: OutputWatchCall) -> None:
        self.limit_check, self.watch_call = limit_check, watch_call

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        is_stop_requirement = tool is not None and tool.shell is not None and tool.shell.has_only_journal_commands(*STOP_REQUIREMENT_COMMANDS)
        if is_stop_requirement or self.watch_call.is_watch(hook) or not self.limit_check.exceeds_hard_limit(hook.agent_id):
            return RuleAnswer.allowed()
        refusal = RuleAnswer.refused(CONTEXT_HARD_STOP.nudge())
        return refusal if self.limit_check.is_compaction_unfinished(hook.agent_id, hook.timestamp) else refusal.running(CompactAgentContext(hook.agent_id, CompactionReason.HARD_STOP))
