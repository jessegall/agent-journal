from engine.driver.foreign_run import ForeignRun

RUN = {"id": "guard", "exit_code": 1, "stdout": "", "stderr": "boom", "milliseconds": 4, "timed_out": False, "answer": {}}


def test_on_failure_is_read_and_optional():
    assert ForeignRun.parsed({**RUN, "on_failure": "block"}).on_failure == "block"
    assert ForeignRun.parsed(RUN).on_failure == ""
