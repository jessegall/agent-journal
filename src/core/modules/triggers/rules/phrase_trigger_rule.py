from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery

INSTRUCTION_PREFIX = "instruction: "


class PhraseTriggerRule(DriverRule):
    """A phrase trigger whose words are in the user's prompt or in a tool call gives its text to the agent, as a
    nudge or an instruction, or refuses the call when it denies."""

    name = "triggers.phrase"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, triggers: TriggerQuery) -> None:
        self.triggers = triggers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = self.text(hook).lower()
        matching = [trigger for trigger in self.triggers.phrased() if any(phrase.lower() in text for phrase in trigger.phrases)] if text else []
        deny = next((trigger for trigger in matching if trigger.action is TriggerAction.DENY), None)
        if deny is not None:
            return RuleAnswer.refused(f"a trigger denies this: {deny.text}")
        return RuleAnswer.with_lines(*(self.line(trigger) for trigger in matching)) if matching else RuleAnswer.allowed()

    def text(self, hook: AgentHook) -> str:
        event = hook.event
        if event.event is HookEventName.PROMPT:
            return event.prompt or ""
        tool = event.tool
        if event.event is not HookEventName.PRE_TOOL_USE or tool is None:
            return ""
        return tool.shell.line if tool.shell is not None else " ".join((tool.name, *tool.files))

    def line(self, trigger: Trigger) -> str:
        return f"{INSTRUCTION_PREFIX}{trigger.text}" if trigger.action is TriggerAction.INSTRUCT else trigger.text
