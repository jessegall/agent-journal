from suites.coding.modules.workers.support.own_test import OwnTest

BUILD_TEST = "pytest tests/build.py"


def test_the_own_test_of_a_checkpoint_is_the_test_command_of_its_phase():
    assert OwnTest(BUILD_TEST).command == BUILD_TEST


def test_the_paths_an_earlier_checkpoint_deferred_are_added_to_the_command():
    assert OwnTest(BUILD_TEST, ("tests/slow.py", "tests/two words.py")).command == "pytest tests/build.py tests/slow.py 'tests/two words.py'"


def test_a_phase_with_no_test_command_has_no_own_test_whatever_was_deferred():
    assert OwnTest("").command == ""
    assert OwnTest("", tuple(["tests/slow.py"])).command == ""
