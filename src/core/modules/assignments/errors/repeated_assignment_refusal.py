from engine.errors.refusal import Refusal


class RepeatedAssignmentRefusal(Refusal):
    """A row that several actors can hold was to be given to an actor that already holds it."""

    def __init__(self, subject_model: str, subject_id: int, actor_id: int) -> None:
        super().__init__(f"{subject_model} {subject_id} is already assigned to actor {actor_id}")
