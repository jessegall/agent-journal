from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.record_idle_message_line.record_idle_message_line import RecordIdleMessageLine


class IdleMessageTickRule(DriverRule):
    """Each tick, a message waiting for a main agent that sent no hook lately is typed to it: an interrupted
    turn sends no stop, so nothing else would wake it."""

    name = "messages.idle-agent-tick"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(RecordIdleMessageLine(hook.environment_id))
