from collections.abc import Iterator, Sequence
from typing import Protocol

from engine.setting.setting_declaration import SettingDeclaration


class SettingNode(Protocol):
    """A node of a settings tree: a value, a group or a reference to a group; it says what it declares,
    which nodes it holds and what is wrong with it."""

    @property
    def key(self) -> str: ...

    def declaration(self) -> SettingDeclaration: ...

    def members(self) -> Sequence["SettingNode"]: ...

    def problems(self, key: str) -> Iterator[str]: ...
