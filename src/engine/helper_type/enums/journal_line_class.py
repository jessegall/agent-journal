from enum import StrEnum

from engine.command.command import Command
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.subcommand import Subcommand


class JournalLineClass(StrEnum):
    """A class of journal lines a helper type may be allowed as a whole, taken from what the line's
    subcommand is."""

    READS = "reads"
    CHANGES = "changes"
    EXTERNAL = "outward"
    BACKGROUND = "background"

    @classmethod
    def subcommand_classes(cls, subcommand: type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]) -> frozenset["JournalLineClass"]:
        classes = {cls.READS if issubclass(subcommand, ReadSubcommand) else cls.CHANGES}
        if subcommand.external:
            classes.add(cls.EXTERNAL)
        if subcommand.background:
            classes.add(cls.BACKGROUND)
        return frozenset(classes)
