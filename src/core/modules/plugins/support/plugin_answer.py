import json
from dataclasses import dataclass

from core.base.type_guards import is_mapping


@dataclass(frozen=True)
class PluginAnswer:
    """What a plugin printed for an event, version 4's line out: allow, refuse with a reason, or tell a line; an
    empty output allows."""

    answer: str
    reason: str
    line: str

    @classmethod
    def parsed(cls, output: str) -> "PluginAnswer":
        lines = [line for line in output.splitlines() if line.strip()]
        fields: object = json.loads(lines[-1]) if lines else None
        if not is_mapping(fields):
            fields = {}
        return cls(str(fields["answer"]) if "answer" in fields else "allow", str(fields["reason"]) if "reason" in fields else "",
                   str(fields["tell"]) if "tell" in fields else "")

    def is_refusal(self) -> bool:
        return self.answer == "refuse"
