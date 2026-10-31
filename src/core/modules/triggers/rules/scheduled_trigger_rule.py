from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.triggers.commands.fire_trigger import FireTrigger
from core.modules.triggers.queries.trigger_query import TriggerQuery


class ScheduledTriggerRule(DriverRule):
    """On any hook, the server's tick included, the main agent is given the text of each scheduled trigger whose
    time has come, and the trigger moves on to its next time or ends."""

    name = "triggers.scheduled"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, triggers: TriggerQuery) -> None:
        self.triggers = triggers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        due = self.triggers.due(hook.timestamp)
        if not due:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*(trigger.text for trigger in due)).running(*(FireTrigger(trigger.id) for trigger in due))
