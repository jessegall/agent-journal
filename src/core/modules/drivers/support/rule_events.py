from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.enums.hook_wildcard import HookWildcard


class RuleEvents:
    """The hook events an old rule answers: its one event, or every agent event for a rule of every hook."""

    @staticmethod
    def of(rule: type[DriverRule]) -> list[HookEventName]:
        if rule.hook == HookWildcard.ALL_HOOKS:
            return [event for event in HookEventName if event is not HookEventName.TICK]
        return [HookEventName(rule.hook)]

    # the agent types a rule names; a rule that names none is asked for every type, as the walk asks it
    @staticmethod
    def agent_types(rule: type[DriverRule]) -> list[str]:
        return [str(role) for role in rule.roles]
