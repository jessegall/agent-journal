from pathlib import Path

import pytest

from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from install.code_handover import CodeHandover
from install.update_steps import UpdateSteps


class RecordedSteps(UpdateSteps):
    def __init__(self) -> None:
        self.recorded: list[tuple[str, str]] = []

    def record(self, step: str, detail: str = "") -> None:
        self.recorded.append((step, detail))


class FixedVersions:
    def switch(self, tag: str) -> None:
        return

    def add(self, source: Path) -> str:
        return "tag-one"


def handover_with(tmp_path: Path, steps: RecordedSteps, pids: list[str], status: int = 200) -> CodeHandover:
    handover = CodeHandover(JournalHome(tmp_path / ".journal"), steps)
    handover.versions = FixedVersions()
    handover.server_pid = lambda: pids.pop(0) if len(pids) > 1 else pids[0]
    handover.takeover_status = lambda tag: status
    return handover


def test_an_update_of_a_running_server_records_each_step_and_ends_with_the_version(tmp_path):
    steps = RecordedSteps()
    handover_with(tmp_path, steps, ["10", "11"]).run(tmp_path)
    assert steps.recorded == [("proof", ""), ("handover", ""), ("serving", ""), ("finished", "tag-one")]


def test_an_update_the_server_refuses_ends_with_the_refusal(tmp_path):
    steps = RecordedSteps()
    with pytest.raises(Refusal):
        handover_with(tmp_path, steps, ["10"], status=422).run(tmp_path)
    reason = "code version tag-one was not taken over: status 422: the running server keeps serving: read " + str(tmp_path / ".journal" / "runtime" / "server.log")
    assert steps.recorded == [("proof", ""), ("failed", reason)]


def test_an_update_with_no_server_running_records_only_its_end(tmp_path):
    steps = RecordedSteps()
    handover_with(tmp_path, steps, [""]).run(tmp_path)
    assert steps.recorded == [("finished", "tag-one")]
