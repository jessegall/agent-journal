from dataclasses import dataclass, field
from typing import ClassVar

from journal.models.dump_item import DumpItem
from journal.models.scoped import Scoped

TEXT = "text"
"""The name of a dump's pasted text as an item, unless it was split into parts."""


@dataclass(frozen=True)
class Dump(Scoped):
    """A pile the user drops in one place, which the agent sorts by subject and files as rows of their own."""

    handed_to_agent: ClassVar[bool] = True

    title: str = ""
    brief: str = ""
    files: tuple[str, ...] = ()
    parts: tuple[str, ...] = ()
    items: dict = field(default_factory=dict)
    log: tuple = ()
    question: dict = field(default_factory=dict)
    answers: tuple = ()
    options: tuple = ()
    chosen: dict = field(default_factory=dict)
    taken: dict = field(default_factory=dict)
    declined: tuple = ()
    said: tuple = ()
    summary: str = ""
    outcome: str = ""
    queued_at: float = 0.0
    completed_at: float = 0.0
    stopped: bool = False
    dismissed: bool = False
    removed_at: float = 0.0
    removed_refs: tuple = ()

    @property
    def is_completed(self) -> bool:
        return bool(self.completed_at)

    @property
    def item_names(self) -> list[str]:
        return ((list(self.parts) or [TEXT]) if self.brief.strip() else []) + sorted(self.files)

    def item(self, name: str) -> DumpItem:
        return DumpItem.of(self.items.get(name) or {})

    def with_item(self, name: str, **values) -> "Dump":
        return self.with_(items={**self.items, name: {**self.item(name).to_json(), **values}})

    @property
    def all_settled(self) -> bool:
        settled = [self.item(name).settled for name in self.item_names]
        return bool(settled) and all(settled)

    def waiting(self) -> list[str]:
        return [name for name in self.item_names if not self.item(name).insight]

    def unsettled(self) -> list[str]:
        return [name for name in self.item_names if not self.item(name).settled]

    @staticmethod
    def items_in(names: list[str]) -> str:
        return f"{len(names)} item{'s' * (len(names) != 1)}"

    def logged(self, entry: dict, kept: int) -> "Dump":
        return self.with_(log=(*self.log, entry)[-kept:])

    def made_refs(self) -> list[str]:
        refs = [ref for name in self.item_names for ref in self.item(name).refs] + [e["on"] for e in self.log if e.get("on")]
        return list(dict.fromkeys(refs))
