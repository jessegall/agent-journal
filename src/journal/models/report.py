from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar

from journal.models.scoped import Scoped
from journal.models.support.dock_button import DockButton
from journal.models.support.dock_card import DockCard
from journal.support.rejection import Rejection

UPDATE = "update"
SECTION_NAMES = {"need": ("waits on you", "wait on you"), "done": ("done", "done"), "doing": ("under way", "under way"), "plans": ("plan under way", "plans under way"), "commits": ("commit", "commits"), "also": ("also written", "also written")}


@dataclass(frozen=True)
class Report(Scoped):
    """What was checked or researched now; an update report is of kind update, its abstract the agent's summary and its items the rows the journal gathered for the time it covers, each with its section, ref, title and note, and the moment the user read it."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "abstract", "body")

    title: str = ""
    abstract: str = ""
    body: str = ""
    kind: str = ""
    items: tuple = ()
    start_at: datetime | None = None
    end_at: datetime | None = None
    read_at: datetime | None = None

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        if self.is_update():
            return f"{self.abstract} ({self.counts_text()})" if self.items else self.abstract
        return self.abstract or self.opening_line(self.body)

    def counts_text(self) -> str:
        counts = {section: sum(1 for item in self.items if item["section"] == section) for section in SECTION_NAMES}
        return ", ".join(f"{count} {SECTION_NAMES[section][count != 1]}" for section, count in counts.items() if count)

    def docked(self) -> DockCard:
        return DockCard((DockButton("Open update", "open_update"), DockButton("Close", "close"))) if self.is_update() else DockCard.plain()

    def is_update(self) -> bool:
        return self.kind == UPDATE

    def read(self, time: datetime) -> "Report":
        return self if self.read_at else self.with_(read_at=time)

    def item_added(self, section: str, ref: str, title: str) -> "Report":
        return self.with_(items=(*self.items, {"section": section, "ref": ref, "title": title}))

    def noted(self, n: int, note: str) -> "Report":
        self.numbered_item(n)
        return self.with_(items=tuple({**item, "note": note} if index == n else item for index, item in enumerate(self.items, start=1)))

    def dropped(self, n: int) -> "Report":
        self.numbered_item(n)
        return self.with_(items=tuple(item for index, item in enumerate(self.items, start=1) if index != n))

    def numbered_item(self, n: int) -> dict:
        if not 1 <= n <= len(self.items):
            raise Rejection(f"update {self.id} has {len(self.items)} items: journal report show {self.id} lists them")
        return self.items[n - 1]
