from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from engine.viewer.choice import Choice


@dataclass(frozen=True)
class ChoiceField:
    """A button field whose value is picked from a fixed list."""

    name: str
    label: str
    choices: Sequence[Choice]
    default: str = ""

    def accepts(self, value: str) -> bool:
        return any(choice.key == value for choice in self.choices)

    def problems(self, owner: str, targets: frozenset[str]) -> list[str]:
        keys = [choice.key for choice in self.choices]
        problems = [] if keys else [f"{owner} has no choices"]
        problems += [f"{owner} has duplicate choice {key}" for key in sorted(set(keys)) if keys.count(key) > 1]
        if self.default and self.default not in keys:
            problems.append(f"{owner} has default {self.default}, which is no choice key")
        return problems

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ChoiceField":
        return cls(stored["name"], stored["label"], tuple(Choice(**choice) for choice in stored["choices"]),
                   stored.get("default", ""))
