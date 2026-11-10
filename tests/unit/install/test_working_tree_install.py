import subprocess
from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.base.serving.update_steps import UpdateSteps
from install.working_tree_install import WorkingTreeInstall


class RecordingVersions:
    def __init__(self) -> None:
        self.switched: list[str] = []

    def switch(self, tag: str) -> None:
        self.switched.append(tag)


def install_at(tmp_path: Path) -> WorkingTreeInstall:
    home = JournalHome(tmp_path / ".journal")
    home.folder.mkdir(parents=True)
    install = WorkingTreeInstall(home)
    install.steps = UpdateSteps()
    install.versions = RecordingVersions()
    return install


def test_an_install_kills_a_server_that_does_not_answer_and_switches_the_code(tmp_path):
    install = install_at(tmp_path)
    hung_server = subprocess.Popen(["sleep", "60"])
    install.files.pid_file.write_text(str(hung_server.pid))

    install.request_takeover("tag-one", str(hung_server.pid))

    assert hung_server.wait(timeout=5) == -9
    assert install.versions.switched == ["tag-one"]


def test_a_server_that_handed_over_without_an_answer_is_left_running(tmp_path):
    install = install_at(tmp_path)
    new_server = subprocess.Popen(["sleep", "60"])
    pids = [str(new_server.pid + 100000), str(new_server.pid)]
    install.server_pid = lambda: pids.pop(0) if len(pids) > 1 else pids[0]

    try:
        install.request_takeover("tag-one", pids[0])

        assert new_server.poll() is None
        assert install.versions.switched == []
    finally:
        new_server.kill()
        new_server.wait(timeout=5)
