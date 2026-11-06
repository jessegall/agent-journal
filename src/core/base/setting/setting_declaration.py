from collections.abc import Sequence
from dataclasses import dataclass

SettingDefault = str | int | float | bool | tuple[str, ...] | tuple[int, ...] | None
GROUP_TYPE = "group"
REFERENCE_TYPE = "reference"
ANY_KEY = "*"


@dataclass(frozen=True)
class SettingDeclaration:
    """What a node of a settings tree declares about itself, before it has a key: its title and
    description, its type (group or reference for a node that is no value), default, scope and choices,
    whether it is a secret or a value an agent may set, for a group whether it can be switched off, for a
    reference the group it places, and whether only a person may change it."""

    title: str
    description: str
    type: str
    default: SettingDefault
    secret: bool
    scope: str
    choices: Sequence[str]
    toggleable: bool
    enabled: bool
    target: str = ""
    person_set: bool = False
