import pytest

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.support.own_test_command import OwnTestCommand

COMMAND = "pytest -q tests/cart.py tests/stories/compaction_never_twice.py tests/totals.py --maxfail 3"


def test_the_paths_of_a_test_command_are_its_words_that_name_a_file_or_a_folder():
    assert OwnTestCommand.parse(COMMAND).paths() == ("tests/cart.py", "tests/stories/compaction_never_twice.py", "tests/totals.py")


def test_taking_paths_out_removes_those_whole_words_and_keeps_the_order_and_the_options():
    shorter = OwnTestCommand.parse(COMMAND).without(tuple(["tests/stories/compaction_never_twice.py"]))
    assert shorter.text() == "pytest -q tests/cart.py tests/totals.py --maxfail 3"


@pytest.mark.parametrize("paths, words", [
    (tuple(["tests/receipts.py"]), "tests/receipts.py is not a path of the test command"),
    (tuple(["tests/cart"]), "tests/cart is not a path of the test command"),
    (tuple(["--maxfail"]), "--maxfail is not a path of the test command"),
    (("tests/cart.py", "tests/stories/compaction_never_twice.py", "tests/totals.py"), "the test command would be left with no path"),
], ids=["a path that is not in it", "a part of a path", "an option", "every path"])
def test_taking_out_a_word_that_is_no_path_of_the_command_or_every_path_is_refused(paths, words):
    with pytest.raises(Refusal) as refusal:
        OwnTestCommand.parse(COMMAND).without(paths)
    assert words in refusal.value.reason


def test_a_command_cut_down_to_other_paths_keeps_its_program_and_options():
    assert OwnTestCommand.parse(COMMAND).with_paths(tuple(["tests/stories/compaction_never_twice.py"])).text() == "pytest -q --maxfail 3 tests/stories/compaction_never_twice.py"
