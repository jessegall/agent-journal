from collections.abc import Iterator, Sequence
from dataclasses import dataclass
from typing import Protocol

SettingDefault = str | int | float | bool | tuple[str, ...] | tuple[int, ...] | None
GROUP_TYPE = "group"
REFERENCE_TYPE = "reference"
ANY_KEY = "*"


@dataclass(frozen=True)
class SettingDeclaration:
    """What a node of a settings tree declares about itself, before it has a key: its title and
    description, its type (group or reference for a node that is no value), default, scope and choices,
    whether it is a secret or a value an agent may set, for a group whether it can be switched off, and
    for a reference the group it places."""

    title: str
    description: str
    type: str
    default: SettingDefault
    secret: bool
    scope: str
    agent_writable: bool
    choices: Sequence[str]
    toggleable: bool
    enabled: bool
    target: str = ""


class SettingNode(Protocol):
    """A node of a settings tree: a value, a group or a reference to a group; it says what it declares,
    which nodes it holds and what is wrong with it."""

    @property
    def key(self) -> str: ...

    def declaration(self) -> SettingDeclaration: ...

    def members(self) -> Sequence["SettingNode"]: ...

    def problems(self, key: str) -> Iterator[str]: ...
