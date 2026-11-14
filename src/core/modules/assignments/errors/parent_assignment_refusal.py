from engine.errors.refusal import Refusal


class ParentAssignmentRefusal(Refusal):
    """A row was to inherit its assignment from its parent, and no parent of it is assigned."""

    def __init__(self, model_name: str, row_id: int) -> None:
        super().__init__(f"{model_name} {row_id} has no assigned parent to inherit from", "assign its parent, or assign the row with --to")
