from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.driver_nudges import PAUSED_REFUSAL
from core.modules.drivers.support.block_conditions.agent_resumed import AgentResumed


class PausedAgentRule(DriverRule):
    """A paused agent's tool calls are refused until it is resumed, except read tools, read commands and
    journal message commands, so it can still look things up and answer in the chat; any other journal
    command waits for the resume too (message 117878), also one nested in the line of another program, such
    as bash -c."""

    name = "drivers.paused-agent"
    hook = HookEventName.PRE_TOOL_USE
    single_action_refusal = "A paused agent's journal command is refused outright, so it cannot work around the pause; its other tools wait in a block until the resume"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.is_journal_work(hook):
            return RuleAnswer.refused(PAUSED_REFUSAL.nudge())
        return RuleAnswer.blocked(hook, PAUSED_REFUSAL.nudge(), AgentResumed())

    @staticmethod
    def is_journal_work(hook: AgentHook) -> bool:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return False
        return any(line[:1] != ("message",) for line in shell.journal_argument_lines())
