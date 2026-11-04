from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.modules.triggers.models.enums.trigger_condition_type import MAIN_AGENT, TriggerConditionType
from core.modules.triggers.models.support.trigger_condition import TriggerCondition
from core.modules.triggers.models.trigger import Trigger



class TriggerConditions:
    """Tells whether a trigger passes all its conditions for a hook."""

    def all_pass(self, trigger: Trigger, hook: AgentHook) -> bool:
        return all(self.passes(condition, trigger, hook) for condition in trigger.parsed_conditions())

    def passes(self, condition: TriggerCondition, trigger: Trigger, hook: AgentHook) -> bool:
        if condition.type is TriggerConditionType.AGENT:
            return (hook.role == AgentRole.MAIN) if condition.value == MAIN_AGENT else hook.role != AgentRole.MAIN
        if condition.type is TriggerConditionType.ENVIRONMENT:
            return hook.event.environment == condition.value
        if condition.type is TriggerConditionType.FIRED:
            return trigger.fired_count < int(condition.value)
        first_hour, end_hour = condition.value.split("-")
        return int(first_hour) <= hook.timestamp.value.astimezone().hour < int(end_hour)
