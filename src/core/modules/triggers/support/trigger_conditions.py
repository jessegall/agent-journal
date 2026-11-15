from engine.agent.agent_role_reader import AgentRoleReader
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.time.clock import Clock
from core.modules.triggers.models.enums.trigger_condition_type import MAIN_AGENT, TriggerConditionType
from core.modules.triggers.models.support.trigger_condition import TriggerCondition
from core.modules.triggers.models.trigger import Trigger


class TriggerConditions:
    """Tells whether a trigger passes all its conditions for an agent's hook event."""

    def __init__(self, roles: AgentRoleReader, clock: Clock) -> None:
        self.roles, self.clock = roles, clock

    def all_pass(self, trigger: Trigger, event: HookEvent, agent_id: int) -> bool:
        return all(self.passes(condition, trigger, event, agent_id) for condition in trigger.parsed_conditions())

    def passes(self, condition: TriggerCondition, trigger: Trigger, event: HookEvent, agent_id: int) -> bool:
        if condition.type is TriggerConditionType.AGENT:
            is_main = self.roles.role(agent_id) == AgentRole.MAIN
            return is_main if condition.value == MAIN_AGENT else not is_main
        if condition.type is TriggerConditionType.ENVIRONMENT:
            return event.environment == condition.value
        if condition.type is TriggerConditionType.FIRED:
            return trigger.fired_count < int(condition.value)
        first_hour, end_hour = condition.value.split("-")
        return int(first_hour) <= self.clock.timestamp().value.astimezone().hour < int(end_hour)
