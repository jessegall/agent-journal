from core.modules.triggers.support.trigger_nudges import TRIGGER_DENIES, TRIGGER_LINE
from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.triggers.commands.fire_trigger.fire_trigger import FireTrigger
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.support.trigger_conditions import TriggerConditions

MESSAGES_PLACE = "messages"
COMMANDS_PLACE = "commands"
FILES_PLACE = "files"


class PhraseTriggerRule(DriverRule):
    """A trigger whose words appear in a place it watches and that passes its conditions gives the agent its
    text or refuses the call; each one that acted counts as fired."""

    name = "triggers.phrase"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, triggers: TriggerQuery, conditions: TriggerConditions) -> None:
        self.triggers, self.conditions = triggers, conditions

    def answer(self, hook: AgentHook) -> RuleAnswer:
        texts = [(place, text) for place, text in self.texts(hook) if text]
        matching = [trigger for trigger in self.triggers.phrased() if self.watches_phrase(trigger, texts) and self.conditions.all_pass(trigger, hook)] if texts else []
        deny = next((trigger for trigger in matching if trigger.action is TriggerAction.DENY), None)
        if deny is not None:
            return RuleAnswer.refused(TRIGGER_DENIES.nudge(text=deny.text)).running(FireTrigger(deny.id))
        if not matching:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*(TRIGGER_LINE.nudge(text=trigger.agent_line) for trigger in matching)).running(*(FireTrigger(trigger.id) for trigger in matching))

    def watches_phrase(self, trigger: Trigger, texts: list[tuple[str, str]]) -> bool:
        return any(trigger.match_mode.finds(phrase, text) for phrase in trigger.phrases for place, text in texts if place in trigger.watch_places)

    def texts(self, hook: AgentHook) -> list[tuple[str, str]]:
        event = hook.event
        if event.event is HookEventName.PROMPT:
            return [(MESSAGES_PLACE, event.prompt or "")]
        tool = event.tool
        if event.event is not HookEventName.PRE_TOOL_USE or tool is None:
            return []
        return [(COMMANDS_PLACE, part.text) for part in tool.shell.parts] if tool.shell is not None else [(FILES_PLACE, " ".join((tool.name, *tool.files)))]
