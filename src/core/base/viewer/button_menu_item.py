from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from core.base.viewer.button_field import ButtonField, restored_fields


@dataclass(frozen=True)
class ButtonMenuItem:
    """Another button action offered in its menu."""

    label: str
    runs: str
    fields: Sequence[ButtonField] = ()
    description: str = ""

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ButtonMenuItem":
        return cls(stored["label"], stored["runs"], restored_fields(stored.get("fields", ())), stored.get("description", ""))
