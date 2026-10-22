from dataclasses import dataclass

from journal.models.model import Model
from journal.models.support.dock_card import DockCard
from journal.models.support.ref import Ref


@dataclass(frozen=True)
class RowCard:
    """What any card in the chat or above it reads of a row, and nothing else: its ref, its heading, its summary and how its dock card is drawn."""

    row: str
    heading: str
    summary: str
    dock: DockCard

    @classmethod
    def build(cls, row: Model) -> "RowCard":
        return cls(str(Ref.build(row)), row.heading(), row.summary_line(), row.docked())

    def as_data(self) -> dict:
        return {"row": self.row, "heading": self.heading, "summary": self.summary, "dock": self.dock.as_data()}
