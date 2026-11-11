from engine.errors.refusal import Refusal


class AssignedActorRefusal(Refusal):
    """An actor that still holds assignments was to be deleted."""

    def __init__(self, actor_id: int, assignment_count: int) -> None:
        super().__init__(f"actor {actor_id} holds {assignment_count} assignments", "unassign its rows or give them to another actor before deleting it")
