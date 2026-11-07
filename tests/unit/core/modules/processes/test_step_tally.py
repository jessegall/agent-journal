from core.modules.processes.support.step_tally import StepTally


def test_result_groups():
    assert StepTally.counted(r"(?m)^--- (?:(?P<passed>PASS)|(?P<failed>FAIL)): .+", "", "--- PASS: TestOne (0.00s)\n--- FAIL: TestTwo (0.00s)\n") == StepTally(passed=1, failed=1)


def test_symbol_rows():
    assert StepTally.counted(r"[.FE]", r"\[([0-9]+)%\]", "tests/example.py ..F [100%]\n") == StepTally(passed=2, failed=1)
