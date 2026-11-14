from collections.abc import Mapping, Sequence, Set

from engine.bookkeeping.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.module.model_declaration import ALL_SUBCOMMANDS
from engine.module.module import Module
from engine.module.subcommand_line import subcommand_line

READ_MODEL_SUBCOMMANDS = ("show", "list")


class JournalLines:
    """Every journal line the given modules serve, each with the classes of its subcommand: their own
    subcommands, the standard subcommands and moves of their models, and the journal's bookkeeping lines."""

    def classes(self, modules: Sequence[type[Module]]) -> Mapping[str, Set[JournalLineClass]]:
        lines: dict[str, Set[JournalLineClass]] = {line: JournalLineClass.subcommand_classes(subcommand) for line, subcommand in BOOKKEEPING_SUBCOMMANDS.items()}
        for module in modules:
            for declaration in module.model_declarations():
                lifecycle = declaration.model.lifecycle
                subcommand_names = (*ALL_SUBCOMMANDS, *(move.name for move in lifecycle.moves())) if lifecycle is not None else ALL_SUBCOMMANDS
                lines.update({f"{declaration.model.cli_name} {subcommand_name}": frozenset([JournalLineClass.READS if subcommand_name in READ_MODEL_SUBCOMMANDS else JournalLineClass.CHANGES])
                              for subcommand_name in subcommand_names if subcommand_name not in declaration.excluded_subcommands})
            lines.update({subcommand_line(subcommand): JournalLineClass.subcommand_classes(subcommand) for subcommand in module.subcommands})
        return lines
