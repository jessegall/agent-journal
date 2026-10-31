from core.base.module.module import Module
from core.base.upgrade.move_check import MoveCheck
from core.base.upgrade.version_four_move import VersionFourMove


def move(reads: list[str], drops: list[str] | None = None, id_modules: list[str] | None = None) -> type[VersionFourMove]:
    return type("Move", (VersionFourMove,), {"name": "move", "reads": reads, "drops": drops or [], "id_modules": id_modules or []})


class First(Module):
    name = "first"
    requires_core = ">=5,<6"
    moves = [move(["notes"])]


class Second(Module):
    name = "second"
    requires_core = ">=5,<6"
    moves = [move(["notes"], ["drafts"])]


class Reader(Module):
    name = "reader"
    requires_core = ">=5,<6"
    dependencies = ["first"]
    moves = [move(["tags"], id_modules=["first"])]


def test_a_table_two_modules_claim_is_named_once_with_no_other_problem():
    assert MoveCheck().problems([First, Second]) == ("two moves claim the version 4 table notes",)


def test_a_table_dropped_by_one_move_and_claimed_by_another_is_claimed_twice():
    class Dropper(Module):
        name = "dropper"
        requires_core = ">=5,<6"
        moves = [move(["others"], ["notes"])]

    assert MoveCheck().problems([First, Dropper]) == ("two moves claim the version 4 table notes",)


def test_moves_that_claim_different_tables_and_read_ids_of_a_dependency_pass():
    assert MoveCheck().problems([First, Reader]) == ()


def test_a_move_reading_ids_of_a_module_not_installed_or_not_depended_on_is_named():
    class Lonely(Module):
        name = "lonely"
        requires_core = ">=5,<6"
        moves = [move(["solo"], id_modules=["first", "absent"])]

    assert MoveCheck().problems([First, Lonely]) == ("the move of lonely reads ids of first, and lonely does not depend on it",
                                                     "the move of lonely reads ids of absent, which is not installed")
