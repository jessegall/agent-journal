from scripts.merged_failures import broken_tests, failed_tests

OUTPUT = """..F.F
=========================== short test summary info ============================
FAILED tests/stories/a.py::test_one - AssertionError: 1 != 2
FAILED tests/stories/b.py::test_two[case] - boom
FAILED tests/stories/a.py::test_one - repeated by another worker
2 failed, 40 passed in 3.1s
"""


def test_the_failed_tests_of_a_run_are_the_names_on_its_summary_lines_once_each():
    assert failed_tests(OUTPUT) == ["tests/stories/a.py::test_one", "tests/stories/b.py::test_two[case]"]


def test_only_a_test_that_fails_after_the_merge_and_passed_before_it_is_broken_by_it():
    failed_after = ["tests/stories/a.py::test_one", "tests/stories/b.py::test_two[case]", "tests/stories/c.py::test_three"]
    failed_before = ["tests/stories/a.py::test_one", "tests/stories/c.py::test_three"]
    assert broken_tests(failed_after, failed_before) == ["tests/stories/b.py::test_two[case]"]


def test_a_run_that_fails_nothing_after_the_merge_names_nothing():
    assert broken_tests([], ["tests/stories/a.py::test_one"]) == []
