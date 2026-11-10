from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine


class WaitingMessageTickRule(DriverRule):
    """Each tick, a message waiting for a main agent that sent no hook lately is typed to it: an interrupted
    turn sends no stop, so nothing else would wake it."""

    name = "messages.idle-agent-tick"
    hook = HookEventName.TICK
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(RecordWaitingMessageLine(hook.agent_id))
