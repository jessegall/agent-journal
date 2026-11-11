from engine.errors.refusal import Refusal


class UnknownActorRefusal(Refusal):
    """A row was to be given to an actor that does not exist."""

    def __init__(self, actor_id: int) -> None:
        super().__init__(f"actor {actor_id} does not exist", "name a person or an agent of this journal")
