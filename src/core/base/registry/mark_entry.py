from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class MarkEntry:
    """A registered chat mark type: its type and the module that declares it, its family with that
    family's title, icon, group and colouring, its variants, label and mark icon, what a click and a fold
    do, the buttons, body file and flags it declares, whether the journal ships its module, and why it is
    unavailable (empty when it is available)."""

    type: str
    module: str
    family: str
    family_title: str
    family_icon: str
    group: str
    colouring: str
    variants: Sequence[str]
    label: str
    mark_icon: str
    click: str
    grouping: str
    group_label: str
    group_buttons: Sequence[Mapping[str, str]]
    buttons: Sequence[Mapping[str, str]]
    body: str
    shown: bool
    main: bool
    process: bool
    shipped: bool
    unavailable_reason: str

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "MarkEntry":
        return cls(**{**stored, "variants": tuple(stored["variants"]), "group_buttons": tuple(stored["group_buttons"]), "buttons": tuple(stored["buttons"])})
