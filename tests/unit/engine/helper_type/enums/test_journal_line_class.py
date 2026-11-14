from engine.command.command import Command
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.subcommand import Subcommand


class ShelfShow(ReadSubcommand[object]):
    cli_name = "shelf"
    name = "show"


class ShelfStock(Subcommand[Command[object], object]):
    cli_name = "shelf"
    name = "stock"


class ShelfPublish(Subcommand[Command[object], object]):
    cli_name = "shelf"
    name = "publish"
    outward = True
    background = True


def test_a_read_subcommand_gives_its_line_the_class_reads():
    assert JournalLineClass.subcommand_classes(ShelfShow) == frozenset([JournalLineClass.READS])


def test_a_changing_subcommand_gives_its_line_the_class_changes():
    assert JournalLineClass.subcommand_classes(ShelfStock) == frozenset([JournalLineClass.CHANGES])


def test_the_outward_and_background_flags_add_their_classes():
    assert JournalLineClass.subcommand_classes(ShelfPublish) == frozenset([JournalLineClass.CHANGES, JournalLineClass.OUTWARD, JournalLineClass.BACKGROUND])
