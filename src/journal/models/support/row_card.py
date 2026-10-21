from dataclasses import dataclass

from journal.models.model import Model
from journal.models.support.dock_card import DockCard
from journal.support.export_name import ExportName
from journal.models.support.ref import Ref


@dataclass(frozen=True)
class RowCard:
    """What any card in the chat or above it reads of a row, and nothing else: its ref, its heading, its summary, how its dock card is drawn, and the file it downloads as when it exports."""

    row: str
    heading: str
    summary: str
    dock: DockCard
    file: str

    @classmethod
    def build(cls, row: Model) -> "RowCard":
        return cls(str(Ref.build(row)), row.heading(), row.summary_line(), row.docked(), ExportName.build(row.title_words(), f"{row.noun()} {row.id}") if row.exports else "")

    def as_data(self) -> dict:
        return {"row": self.row, "heading": self.heading, "summary": self.summary, "dock": self.dock.as_data(), "file": self.file}
