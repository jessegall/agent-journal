from collections.abc import Iterable, Sequence
from dataclasses import dataclass, field, replace
from typing import TYPE_CHECKING

from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from engine.driver.stored_nudge import StoredNudge

if TYPE_CHECKING:
    from engine.driver.nudge_declaration import NudgeDeclaration


@dataclass(frozen=True)
class Nudge:
    """One line said to an agent: the key and the type of its declaration, its words with their fields filled
    in, the interval before it may be said again, whether a turn says it only once, and the command that
    clears it, if it names one to run. A line made from a declaration keeps its fields and the declaration,
    so lines of one key in a hook can be written as one."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    turn_limited: bool = True
    required_command: str = ""
    fields: tuple[tuple[str, object], ...] = field(default=(), compare=False)
    declaration: "NudgeDeclaration | None" = field(default=None, compare=False)
    record_keys: tuple[str, ...] = ()

    @property
    def labelled(self) -> str:
        return f"journal: {self.text}"

    @property
    def wakes_agent(self) -> bool:
        return self.declaration is not None and self.declaration.wakes_agent

    @property
    def is_mergeable(self) -> bool:
        return self.declaration is not None and self.declaration.is_mergeable

    @property
    def merge_context(self) -> tuple[tuple[str, str], ...]:
        if self.declaration is None or not self.declaration.is_mergeable:
            return tuple([("text", self.text)])
        id_field = self.declaration.id_field or next(iter(dict(self.fields)), None)
        return tuple(sorted((name, str(value)) for name, value in self.fields if name != id_field))

    @property
    def records(self) -> "tuple[Nudge, ...]":
        if not self.record_keys:
            return tuple([self])
        return tuple(replace(self, key=key, record_keys=()) for key in self.record_keys)

    @property
    def stored(self) -> StoredNudge:
        declaration = self.declaration
        return StoredNudge(self.key, self.type.value, declaration.text if declaration is not None else "{text}",
                           declaration.plural_text if declaration is not None else "", declaration.id_field if declaration is not None else None,
                           declaration.required_command if declaration is not None else None,
                           tuple(declaration.path_fields) if declaration is not None else (),
                           {name: str(value) for name, value in self.fields} if declaration is not None else {"text": self.text})

    @staticmethod
    def collapsed(nudges: "Iterable[Nudge]") -> "list[Nudge]":
        groups: dict[tuple[str, tuple[tuple[str, str], ...]], list[Nudge]] = {}
        for nudge in nudges:
            groups.setdefault((nudge.key, nudge.merge_context), []).append(nudge)
        return [Nudge.merged(group) for group in groups.values()]

    @staticmethod
    def merged(group: "Sequence[Nudge]") -> "Nudge":
        distinct = list({nudge.text: nudge for nudge in group}.values())
        declaration = distinct[0].declaration
        return distinct[0] if len(distinct) == 1 or declaration is None else declaration.merged(distinct)
