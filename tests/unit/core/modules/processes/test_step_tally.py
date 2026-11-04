from core.modules.processes.support.step_tally import StepTally


def test_test_result_lines_are_counted_by_named_groups():
    tally = StepTally.counted(r"(?m)^--- (?:(?P<passed>PASS)|(?P<failed>FAIL)): .+", "", "--- PASS: TestOne (0.00s)\n--- FAIL: TestTwo (0.00s)\n")
    assert tally == StepTally(passed=1, failed=1)


def test_symbol_rows_still_count_passes_and_failures():
    tally = StepTally.counted(r"[.FE]", r"\[([0-9]+)%\]", "tests/example.py ..F [100%]\n")
    assert tally == StepTally(passed=2, failed=1)
