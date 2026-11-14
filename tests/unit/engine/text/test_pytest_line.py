import pytest

from engine.text.pytest_line import PytestLine


@pytest.mark.parametrize("line", [
    ".venv/bin/python -m pytest -q --tb=short -rf -n 4 tests",
    "pytest",
    "pytest tests/ -n 4 --maxfail 5",
    "python -m pytest -p no:cacheprovider tests",
])
def test_a_line_that_names_no_target_but_the_tests_folder_is_a_full_run(line):
    assert PytestLine(line).is_full_run()


@pytest.mark.parametrize("line", [
    "pytest tests/unit/engine -q",
    "pytest -n 4 tests/stories/a.py tests",
    "pytest tests -k cart",
    "pytest tests --deselect tests/a.py::test_b",
    "pytest --lf tests",
    "make test",
    "pytest 'tests",
])
def test_a_line_that_names_part_of_the_suite_or_runs_no_pytest_is_not(line):
    assert not PytestLine(line).is_full_run()
