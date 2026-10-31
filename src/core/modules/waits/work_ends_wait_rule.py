from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.waits.wait_end import WaitEnd


class WorkEndsWaitRule(DriverRule):
    """A wait or a stuck report ends when the agent uses a tool outside the journal: it went on working, and
    the rules beneath check that tool use."""

    name = "waits.work-ends-wait"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        journal_line = tool is not None and tool.shell is not None and tool.shell.is_journal_line
        if hook.layer is None or journal_line:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().ending_layer(WaitEnd(hook.layer.row_id, outcome="the agent went on working"))
