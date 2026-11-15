from engine.driver.project_hook_answer import ProjectHookAnswer
from engine.driver.project_hook_run import ProjectHookRun


def test_reads_the_decoded_answer():
    run = ProjectHookRun("check", 0, "ignored", "", 1, False, {"refusal": "unsafe", "lines": ["note"],
                                                            "updated_input": {"command": "safe"}, "terminal": "notice"})
    answer = ProjectHookAnswer.read(run)
    assert answer.reason() == "check: unsafe"
    assert answer.lines == tuple(["note"])
    assert answer.updated_input == {"command": "safe"}
    assert answer.terminal == "notice"
