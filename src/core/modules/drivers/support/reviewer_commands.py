from dataclasses import dataclass
from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class ReviewerCommands(CommandAllowList):
    """What the reviewer profile of a read-only helper may run: every journal line that only reads, the
    review it records with its points, and the report it files."""

    categories: Sequence[CommandCategory] = tuple(CommandCategory)
    groups: Sequence[str] = tuple(["review-point"])
    lines: Sequence[str] = ("review record", "report make", "task overview", "output read")
    classes: Sequence[JournalLineClass] = tuple([JournalLineClass.READS])
