from dataclasses import dataclass
from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class HelperCommands(CommandAllowList):
    """What a read-only helper may run: it reads and searches files, runs every journal line that only reads
    and does not reach past the journal, and files its documents, reports, plans, reviews and memories."""

    categories: Sequence[CommandCategory] = (CommandCategory.READ, CommandCategory.SEARCH)
    groups: Sequence[str] = ("memory", "review-point")
    lines: Sequence[str] = ("doc make", "doc edit", "doc open", "doc close", "report make", "report edit", "report close", "plan make", "phase make", "task make",
                            "task overview", "plan context", "review record", "output read", "output title", "refusal skip", "refusal confirm", "refusal withdraw")
    classes: Sequence[JournalLineClass] = tuple([JournalLineClass.READS])
