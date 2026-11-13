from dataclasses import dataclass
from collections.abc import Sequence

from engine.enums.command_category import CommandCategory
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass


@dataclass(frozen=True)
class HelperCommands(CommandAllowList):
    """What a read-only helper may run: every journal line that only reads and stays in the journal, and the
    lines that file its documents, reports, plans, reviews and memories. Its shell lines are judged by the
    read-only access rule, so the list leaves every shell command type to it."""

    categories: Sequence[CommandCategory] = tuple(CommandCategory)
    groups: Sequence[str] = ("memory", "review-point")
    lines: Sequence[str] = ("doc make", "doc edit", "doc open", "doc close", "report make", "report edit", "report close", "plan make", "phase make", "task make",
                            "task overview", "plan context", "review record", "plan edit", "plan ready", "phase edit", "task edit", "task depend",
                            "task waits-on-nothing", "task log", "task comment", "plan comment", "output stop", "output read", "output title", "refusal skip", "refusal confirm", "refusal withdraw")
    classes: Sequence[JournalLineClass] = tuple([JournalLineClass.READS])
