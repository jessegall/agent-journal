import json
from dataclasses import dataclass

from engine.model.model import Model
from engine.errors.refusal import Refusal
from core.modules.sequences.models.support.sequence_guards import SequenceGuards
from core.modules.sequences.models.support.sequence_triggers import SequenceTriggers

STEP_LIMIT_CHARACTERS = 600


@dataclass(frozen=True, kw_only=True)
class Sequence(Model):
    """Steps an agent works through in order, each a line of what to do, what starts it on its own, and what
    each step holds back."""

    model_name = "sequence"
    cli_name = "sequence"
    search_fields = ["title"]

    creator_id: int
    title: str
    steps: tuple[str, ...]
    triggers: str = "[]"
    step_guards: str = "[]"

    @property
    def steps_text(self) -> str:
        return json.dumps(list(self.steps))

    @property
    def guards_text(self) -> str:
        return json.dumps(json.loads(self.step_guards))

    def has_end_event(self, event_name: str) -> bool:
        return any(event_name in trigger.end_event_names for trigger in SequenceTriggers.parsed(self.triggers))

    def __post_init__(self) -> None:
        SequenceTriggers.parsed(self.triggers)
        SequenceGuards.parsed(self.step_guards)
        if not self.steps:
            raise Refusal("a sequence has at least one step", "give them with --steps 'first | second'")
        for step in self.steps:
            if not 1 <= len(step) <= STEP_LIMIT_CHARACTERS:
                raise Refusal(f"a step is 1 to {STEP_LIMIT_CHARACTERS} characters, not {len(step)}", "say it shorter")
