from core.modules.triggers.support.trigger_nudges import TRIGGER_LINE
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from core.modules.triggers.commands.fire_trigger.fire_trigger import FireTrigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.support.trigger_conditions import TriggerConditions


class ScheduledTriggerRule(DriverRule):
    """On any hook, the server's tick included, the main agent is given the text of each scheduled trigger
    whose time has come and that passes its conditions, and the trigger moves on to its next time or ends."""

    name = "triggers.scheduled"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, triggers: TriggerQuery, conditions: TriggerConditions) -> None:
        self.triggers, self.conditions = triggers, conditions

    def answer(self, hook: AgentHook) -> RuleAnswer:
        due = [trigger for trigger in self.triggers.due(hook.timestamp) if self.conditions.all_pass(trigger, hook)]
        if not due:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*(TRIGGER_LINE.nudge(trigger=trigger.id) for trigger in due)).running(*(FireTrigger(trigger.id) for trigger in due))
