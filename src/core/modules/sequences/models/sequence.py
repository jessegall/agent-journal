from dataclasses import dataclass

from core.base.model.model import Model
from core.base.refusal import Refusal

STEP_LIMIT_CHARACTERS = 600


@dataclass(frozen=True, kw_only=True)
class Sequence(Model):
    """Steps an agent works through in order, each a line of what to do."""

    model_name = "sequence"
    cli_name = "sequence"

    creator_id: int
    title: str
    steps: tuple[str, ...]

    def __post_init__(self) -> None:
        if not self.steps:
            raise Refusal("a sequence has at least one step", "give them with --steps 'first | second'")
        for step in self.steps:
            if not 1 <= len(step) <= STEP_LIMIT_CHARACTERS:
                raise Refusal(f"a step is 1 to {STEP_LIMIT_CHARACTERS} characters, not {len(step)}", "say it shorter")
