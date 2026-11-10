from engine.driver.foreign_answer import ForeignAnswer
from engine.driver.foreign_run import ForeignRun


def test_reads_the_decoded_answer():
    run = ForeignRun("check", 0, "ignored", "", 1, False, {"refusal": "unsafe", "lines": ["note"],
                                                            "updated_input": {"command": "safe"}, "terminal": "notice"})
    answer = ForeignAnswer.read(run)
    assert answer.reason() == "check: unsafe"
    assert answer.lines == tuple(["note"])
    assert answer.updated_input == {"command": "safe"}
    assert answer.terminal == "notice"
