from core.modules.memories.support.memory_nudges import WEIGH_FIRST
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer



class WeighFirstRule(DriverRule):
    """While a memory mark is open, a write or a stop is refused with the way to weigh or skip; reads and
    journal commands go through, so the commands that close the mark always run."""

    name = "memories.weigh-first"
    hook = HookWildcard.ALL_HOOKS

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        writes = hook.hook_name == HookEventName.PRE_TOOL_USE and tool is not None and tool.is_writing_files()
        if hook.hook_name != HookEventName.STOP and not writes:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WEIGH_FIRST.nudge())
