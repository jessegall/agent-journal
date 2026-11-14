import os
from types import SimpleNamespace

from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders import PruneRuntimeFolders
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders_handler import KEPT_SECONDS, PruneRuntimeFoldersHandler

RUNNING_AGENT_ID = 7
ENDED_AGENT_ID = 8


class AgentRows:
    def __init__(self, running_ids: set[int]) -> None:
        self.running_ids = running_ids

    def query(self, model: type) -> "AgentRows":
        return self

    def matching(self, condition: object) -> "AgentRows":
        return self

    def every_row(self, reason: str) -> list[SimpleNamespace]:
        return [SimpleNamespace(id=agent_id, ended_at=None) for agent_id in self.running_ids]


def aged(path, clock: Clock, seconds: float) -> None:
    point = clock.epoch_seconds() - seconds
    os.utime(path, (point, point))


def test_old_scan_states_and_ended_agents_old_terminal_logs_go_while_the_rest_stay(tmp_path):
    home, clock = JournalHome(tmp_path / ".journal"), Clock()
    scans, terminals = home.folder / "runtime" / "file-scan", home.folder / "runtime" / "terminals"
    (scans / "old").mkdir(parents=True)
    (scans / "fresh").mkdir()
    terminals.mkdir(parents=True)
    for agent_id in (RUNNING_AGENT_ID, ENDED_AGENT_ID):
        (terminals / f"{agent_id}.log").write_text("output")
        aged(terminals / f"{agent_id}.log", clock, KEPT_SECONDS + 60)
    aged(scans / "old", clock, KEPT_SECONDS + 60)
    aged(scans / "fresh", clock, 60)
    removed = PruneRuntimeFoldersHandler(AgentRows({RUNNING_AGENT_ID}), home, clock).handle(PruneRuntimeFolders(), None)
    assert removed == 2
    assert sorted(path.name for path in scans.iterdir()) == ["fresh"]
    assert sorted(path.name for path in terminals.iterdir()) == [f"{RUNNING_AGENT_ID}.log"]


def launch_socket(folder, name: str, answering: bool):
    import socket

    path = folder / name
    listener = socket.socket(socket.AF_UNIX)
    listener.bind(str(path))
    listener.listen(1)
    if not answering:
        listener.close()
    return path, listener


def test_an_old_launch_socket_nobody_answers_on_goes_while_a_live_one_and_a_young_one_stay():
    import tempfile
    from pathlib import Path

    with tempfile.TemporaryDirectory(dir="/tmp") as short:
        home, clock = JournalHome(Path(short) / "j"), Clock()
        home.folder.mkdir()
        dead, _ = launch_socket(home.folder, "l-dead", False)
        recent, _ = launch_socket(home.folder, "l-young", False)
        alive, listener = launch_socket(home.folder, "l-alive", True)
        for path in (dead, alive):
            aged(path, clock, 2 * 3600)
        removed = PruneRuntimeFoldersHandler(AgentRows(set()), home, clock).handle(PruneRuntimeFolders(), None)
        listener.close()
        assert removed == 1
        assert sorted(path.name for path in home.folder.iterdir()) == ["l-alive", "l-young"]
