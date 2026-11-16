from dataclasses import dataclass
from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class ReaderCommands(CommandAllowList):
    """What a read-only helper whose profile files reports, never documents or plans, may run: every journal
    line that only reads and stays in the journal, its reports and its memories."""

    categories: Sequence[CommandCategory] = tuple(CommandCategory)
    groups: Sequence[str] = ("memory",)
    lines: Sequence[str] = ("report make", "report edit", "report close", "task overview", "task log", "plan context", "output read", "output title", "output stop",
                            "refusal skip", "refusal confirm", "refusal withdraw")
    classes: Sequence[JournalLineClass] = (JournalLineClass.READS,)
