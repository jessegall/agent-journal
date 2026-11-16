from engine.driver.project_hook_run import ProjectHookRun

RUN = {"id": "guard", "exit_code": 1, "stdout": "", "stderr": "boom", "milliseconds": 4, "timed_out": False, "answer": {}}


def test_on_failure_is_read_and_optional():
    assert ProjectHookRun.parsed({**RUN, "on_failure": "block"}).failure_mode == "block"
    assert ProjectHookRun.parsed(RUN).failure_mode == ""
