from suites.coding.modules.workers.support.failed_test_paths import FailedTestPaths

OUTPUT = """tests/cart.py::test_total FAILED                                    [ 50%]
=========================== short test summary info ============================
FAILED tests/cart.py::test_total - assert 3 == 4
FAILED tests/cart.py::test_tax - assert 1 == 2
FAILED tests/totals.py::test_sum
ERROR tests/receipts.py::test_print - RuntimeError
2 failed, 4 passed in 0.12s
"""


def test_the_paths_are_those_of_the_lines_that_start_with_failed_each_once_in_the_order_printed():
    assert FailedTestPaths.read(OUTPUT).paths == ("tests/cart.py", "tests/totals.py")


def test_an_output_with_no_failed_line_names_no_path():
    assert FailedTestPaths.read("3 passed in 0.02s\n").paths == ()
    assert FailedTestPaths.read("").paths == ()
