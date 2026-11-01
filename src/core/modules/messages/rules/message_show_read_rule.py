from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.modules.messages.commands.read_message.read_message import ReadMessage

JOURNAL = "journal"
MESSAGE_READ_WORDS = ["message", "show"]


class MessageShowReadRule(DriverRule):
    """A message the main agent shows with journal message show is marked read."""

    name = "messages.shown-is-read"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        shown = [part.arguments[2] for part in shell.parts if self.is_message_show(part)] if shell is not None else []
        return RuleAnswer.allowed().running(*(ReadMessage(int(number)) for number in shown)) if shown else RuleAnswer.allowed()

    def is_message_show(self, part: Part) -> bool:
        return part.program == JOURNAL and list(part.arguments[:2]) == MESSAGE_READ_WORDS and len(part.arguments) > 2 and part.arguments[2].isdigit()
