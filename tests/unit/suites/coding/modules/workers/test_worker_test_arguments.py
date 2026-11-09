import pytest

from core.base.refusal import Refusal
from suites.coding.modules.workers.support.worker_test_arguments import WorkerTestArguments


@pytest.mark.parametrize("test_arguments", [["tests/a.py"], ["tests/a.py::test_one"], ["tests/a.py", "-q", "--tb=short"], ["src/a.test.js"], ["tests/a.py", "-k", "cart"]])
def test_plain_test_arguments_pass(test_arguments):
    assert WorkerTestArguments.check(test_arguments) is None


@pytest.mark.parametrize("test_arguments", [["a.py", "|"], ["a.py", ";"], ["a.py", "&&"], ["a.py", "||"], ["a.py", ">"], ["a.py", "<"], ["`a`.py"], ["$(a).py"], ["/a.py"], ["../a.py"], ["b/../../a.py"],
                                   ["a.py", "--rootdir=x"], ["a.py", "--rootdir"], ["a.py", "-C"], ["a.py", "--prefix"], ["a.py", "--cwd=x"], ["a.py", "--config=x"], ["a.py", "--config"]])
def test_an_argument_that_changes_the_program_is_refused(test_arguments):
    with pytest.raises(Refusal, match="cannot change"):
        WorkerTestArguments.check(test_arguments)


@pytest.mark.parametrize("test_arguments", [[], ["-q"], ["tests"], ["--tb=short", "-x"]])
def test_a_run_that_names_no_test_file_is_refused(test_arguments):
    with pytest.raises(Refusal, match="name each test file"):
        WorkerTestArguments.check(test_arguments)
