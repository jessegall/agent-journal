from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.send_message import SendMessage


class AgentTextRule(DriverRule):
    """Each finished text block the agent writes in a turn becomes a chat message of the agent."""

    name = "messages.agent-text"
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raw = hook.event.raw
        text = raw.get("delta")
        if raw.get("final") is not True or not isinstance(text, str) or not text.strip():
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(SendMessage(text.strip()))
