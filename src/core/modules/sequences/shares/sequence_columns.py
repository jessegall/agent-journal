import json
from dataclasses import dataclass

from core.base.library.library_share import Fields


@dataclass(frozen=True)
class SequenceColumns:
    """The columns of a sequence that are sent to the library and back: its title, its steps and what each step holds
    back."""

    title: str
    steps: tuple[str, ...]
    step_guards: str

    @classmethod
    def parsed(cls, fields: Fields) -> "SequenceColumns":
        return cls(str(fields["title"]), tuple(json.loads(str(fields["steps"]))), str(fields["step_guards"]))
