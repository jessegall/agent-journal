from types import SimpleNamespace

from core.modules.plugins.support.machine_runs import MachineRuns


def test_a_run_file_removed_during_the_count_holds_no_place(tmp_path):
    runs = MachineRuns(SimpleNamespace(folder=tmp_path), SimpleNamespace(), SimpleNamespace(epoch_seconds=lambda: 0.0))
    assert runs.is_blocked(tmp_path / "gone-run") is False
