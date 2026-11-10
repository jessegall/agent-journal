from engine.enums.actor_type import ActorType
from core.modules.agents.models.enums.agent_role import AgentRole


def handle(actor, agent):
    # @sin architecture_drivers_actor_checked_by_hand
    if actor.type is not ActorType.USER:
        return False
    # @sin architecture_drivers_actor_checked_by_hand
    if actor.type is ActorType.AGENT:
        return False
    # @sin architecture_drivers_actor_checked_by_hand
    if agent.role != AgentRole.MAIN:
        return False
    # @righteous architecture_drivers_actor_checked_by_hand
    if actor.is_agent:
        return False
    # @righteous architecture_drivers_actor_checked_by_hand
    return agent.id == 1
