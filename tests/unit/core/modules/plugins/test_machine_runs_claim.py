import time
from types import SimpleNamespace

from core.modules.plugins.support.machine_runs import MACHINE_FOLDER_VARIABLE, MachineRuns


def claimer(tmp_path, project: str) -> MachineRuns:
    outputs = SimpleNamespace(pid_path=lambda process_id: tmp_path / f"{project}-pid-{process_id}")
    return MachineRuns(SimpleNamespace(folder=tmp_path / project), outputs, SimpleNamespace(epoch_seconds=time.time))


def run(process_id: int) -> SimpleNamespace:
    return SimpleNamespace(id=process_id, plugin="graph", run_name="build")


def test_two_claimers_at_the_limit_let_one_through_and_the_other_waits(tmp_path, monkeypatch):
    monkeypatch.setenv(MACHINE_FOLDER_VARIABLE, str(tmp_path / "machine"))
    first, second = claimer(tmp_path, "first"), claimer(tmp_path, "second")
    assert first.claim(run(1), 1) is True
    assert second.claim(run(1), 1) is False
    assert second.count("graph", "build") == 1


def test_a_released_place_is_claimed_again_and_no_limit_claims_every_time(tmp_path, monkeypatch):
    monkeypatch.setenv(MACHINE_FOLDER_VARIABLE, str(tmp_path / "machine"))
    first, second = claimer(tmp_path, "first"), claimer(tmp_path, "second")
    assert first.claim(run(1), 1) is True
    first.release(run(1))
    assert second.claim(run(1), 1) is True
    assert first.claim(run(2), None) is True
    assert second.count("graph", "build") == 2
