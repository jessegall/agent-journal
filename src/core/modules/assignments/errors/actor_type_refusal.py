from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal


class ActorTypeRefusal(Refusal):
    """A row was to be given to an actor whose type receives no work, such as a module or the core."""

    def __init__(self, actor_id: int, actor_type: ActorType) -> None:
        super().__init__(f"actor {actor_id} is a {actor_type.value}, which receives no work", "assign to a user or an agent")
