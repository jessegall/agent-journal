from engine.actor.actor import CORE_ACTOR_ID, Actor
from engine.enums.actor_type import ActorType


class ActorSamples:
    def core(self) -> Actor:
        # @righteous architecture_actors_literal_actor_id
        return Actor(CORE_ACTOR_ID, ActorType.CORE)

    def written_core(self) -> Actor:
        # @sin architecture_actors_literal_actor_id
        return Actor(1, ActorType.CORE)

    def allocated(self, actor_id: int) -> Actor:
        # @righteous architecture_actors_literal_actor_id
        return Actor(actor_id, ActorType.AGENT)
