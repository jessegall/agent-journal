from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Assignment(Model):
    """One row of an assignable model given to one actor. The row is named by its model and its id. An
    assignment that followed from the assignment of a parent row names that assignment in via_id; one given
    by hand names none."""

    model_name = "assignment"
    cli_name = "assignment"

    creator_id: int
    subject_model: str
    subject_id: int
    actor_id: int
    via_id: int | None = None
