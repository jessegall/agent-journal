from engine.command.command import Command
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.module.helper_type_check import HelperTypeCheck
from engine.module.module import Module
from engine.module.suite import Suite
from engine.module.suite_list import SuiteList
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.subcommand import Subcommand

NAME = "sample.shelves's helper type stocker"


class ShelfShow(ReadSubcommand[object]):
    cli_name = "shelf"
    name = "show"


class ShelfStock(Subcommand[Command[object], object]):
    cli_name = "shelf"
    name = "stock"


class ShelvesModule(Module):
    name = "sample.shelves"
    dependencies = ["journal.core.agents"]
    subcommands = [ShelfShow, ShelfStock]


class Stocker(HelperType):
    key = "stocker"
    label = "Stocker"
    behaviours = HelperBehaviours.retired()
    commands = CommandAllowList(groups=("shelf",))


class ListlessStocker(HelperType):
    key = "stocker"
    label = "Stocker"
    behaviours = HelperBehaviours.retired()


def problems(declaration: type[HelperType]) -> tuple[str, ...]:
    suite = type("ShelvesSuite", (Suite,), {"name": "shelves", "modules": [ShelvesModule], "helper_types": [declaration]})
    listed = SuiteList((suite,))
    return HelperTypeCheck().problems(listed.modules(), listed)


def listing(commands: CommandAllowList) -> tuple[str, ...]:
    return problems(type("ListedStocker", (Stocker,), {"commands": commands}))


def test_a_list_that_names_served_groups_lines_and_classes_passes_the_boot():
    assert listing(CommandAllowList(groups=("shelf",), classes=(JournalLineClass.READS,))) == ()
    assert listing(CommandAllowList(lines=("shelf show", "shelf stock"))) == ()


def test_a_typo_in_a_list_stops_the_boot_naming_the_type_and_the_line():
    assert listing(CommandAllowList(lines=("shelf stok",))) == (f"{NAME} lists the line shelf stok, which no module serves",)
    assert listing(CommandAllowList(groups=("shelfs",))) == (f"{NAME} lists the group shelfs, which no module serves",)


def test_a_line_named_twice_stops_the_boot():
    assert listing(CommandAllowList(lines=("shelf show", "shelf show"))) == (f"{NAME} names shelf show twice",)
    assert listing(CommandAllowList(groups=("shelf",), lines=("shelf show",))) == (f"{NAME} lists the line shelf show and its whole group",)


def test_a_class_that_names_no_line_stops_the_boot():
    assert listing(CommandAllowList(classes=(JournalLineClass.BACKGROUND,))) == (f"{NAME} lists the class background, which no line has",)


def test_a_type_registered_with_no_list_stops_the_boot_saying_so():
    assert problems(ListlessStocker) == (f"{NAME} has no commands",)
