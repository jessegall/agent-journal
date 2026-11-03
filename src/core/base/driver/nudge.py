from collections.abc import Iterable, Sequence
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from core.base.driver.interval import Interval
from core.base.driver.nudge_type import NudgeType

if TYPE_CHECKING:
    from core.base.driver.nudge_declaration import NudgeDeclaration


@dataclass(frozen=True)
class Nudge:
    """One line said to an agent: the key and the type of its declaration, its words with their fields filled
    in, the interval before it may be said again, whether a turn says it only once, and the command that
    settles it, if it names one to run. A line made from a declaration keeps its fields and the declaration,
    so lines of one key in a hook can be written as one."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    turn_limited: bool = True
    required_command: str = ""
    fields: tuple[tuple[str, object], ...] = field(default=(), compare=False)
    declaration: "NudgeDeclaration | None" = field(default=None, compare=False)

    @property
    def labelled(self) -> str:
        return f"journal: {self.text}"

    @property
    def is_mergeable(self) -> bool:
        return self.declaration is not None and self.declaration.is_mergeable

    @staticmethod
    def collapsed(nudges: "Iterable[Nudge]") -> "list[Nudge]":
        kinds: dict[tuple[str, str], list[Nudge]] = {}
        for nudge in nudges:
            kinds.setdefault((nudge.key, "" if nudge.is_mergeable else nudge.text), []).append(nudge)
        return [Nudge.merged(kind) for kind in kinds.values()]

    @staticmethod
    def merged(kind: "Sequence[Nudge]") -> "Nudge":
        distinct = list({nudge.text: nudge for nudge in kind}.values())
        declaration = distinct[0].declaration
        return distinct[0] if len(distinct) == 1 or declaration is None else declaration.merged(distinct)
