from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class ChoiceOption:
    """A list of choices in a window's pane menu, each a value and its label, kept on the pane."""

    key: str
    label: str
    choices: Sequence[tuple[str, str]]
    default: str = ""

    def listed(self) -> Mapping[str, object]:
        return {"control": "choice", "key": self.key, "label": self.label, "choices": [list(choice) for choice in self.choices], "default": self.default}
