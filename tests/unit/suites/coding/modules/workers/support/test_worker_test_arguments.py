import pytest

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.support.worker_test_arguments import WorkerTestArguments


@pytest.mark.parametrize("test_arguments", [["tests/a.py"], ["tests/a.py::test_one"], ["tests/a.py", "-q", "--tb=short"], ["src/a.test.js"], ["tests/a.py", "-k", "cart"],
                                            ["tests/Unit/HookDatabaseTest.php"], ["spec/cart_spec.rb"], ["src/CartTest.java"], ["tests/Cart.Tests.cs"], ["test/cart_test.exs"]])
def test_plain_test_arguments_pass(test_arguments):
    assert WorkerTestArguments.check(test_arguments, ["pytest", *test_arguments]) is None


@pytest.mark.parametrize("test_arguments", [["a.py", "|"], ["a.py", ";"], ["a.py", "&&"], ["a.py", "||"], ["a.py", ">"], ["a.py", "<"], ["`a`.py"], ["$(a).py"], ["/a.py"], ["../a.py"], ["b/../../a.py"],
                                   ["a.py", "--rootdir=x"], ["a.py", "--rootdir"], ["a.py", "-C"], ["a.py", "--prefix"], ["a.py", "--cwd=x"], ["a.py", "--config=x"], ["a.py", "--config"]])
def test_an_argument_that_changes_the_program_is_refused(test_arguments):
    with pytest.raises(Refusal, match="cannot change"):
        WorkerTestArguments.check(test_arguments, ["pytest", *test_arguments])


@pytest.mark.parametrize("test_arguments", [[], ["-q"], ["tests"], ["--tb=short", "-x"], ["DB_HOST=127.0.0.1", "DB_PORT=54702"]])
def test_a_run_that_names_no_test_file_is_refused(test_arguments):
    with pytest.raises(Refusal, match="name each test file"):
        WorkerTestArguments.check(test_arguments, ["pytest", *test_arguments])


def test_a_command_that_already_names_its_go_package_needs_no_file_beside_it():
    assert WorkerTestArguments.check([], ["go", "-C", "tools/journal", "test", "-count=1", "./launch", "."]) is None


def test_a_command_that_names_no_package_still_needs_one_in_its_arguments():
    with pytest.raises(Refusal):
        WorkerTestArguments.check([], ["go", "-C", "tools/journal", "test", "-count=1"])


@pytest.mark.parametrize("pattern", [".", ".*", "^", "^.*$", ""])
def test_a_go_pattern_that_matches_every_test_is_the_whole_suite(pattern):
    with pytest.raises(Refusal, match="name each test file"):
        WorkerTestArguments.check(["-run", pattern], ["go", "test", "-run", pattern])
    with pytest.raises(Refusal, match="name each test file"):
        WorkerTestArguments.check([f"-run={pattern}"], ["go", "test", f"-run={pattern}"])


def test_a_go_pattern_that_names_a_test_passes():
    assert WorkerTestArguments.check(["-run", "^TestLaunch$"], ["go", "test", "-run", "^TestLaunch$"]) is None


def test_a_command_with_variables_in_front_still_needs_a_named_file():
    command = ["DB_HOST=127.0.0.1", "DB_PORT=54702", "vendor/bin/phpunit"]
    with pytest.raises(Refusal, match="name each test file"):
        WorkerTestArguments.check([], command)
    assert WorkerTestArguments.check(["tests/Unit/HookDatabaseTest.php"], [*command, "tests/Unit/HookDatabaseTest.php"]) is None
