import os
import socket
import subprocess
import sys
import threading
import time
from collections.abc import Generator
from pathlib import Path

import pytest

from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from install.code_handover import CodeHandover
from install.install_journal import InstallJournal
from install.unix_connection import UnixConnection
from server.server_files import ServerFiles

pytestmark = pytest.mark.install_job

SOURCE = Path(__file__).resolve().parents[3] / "src"
START_LIMIT_SECONDS = 60


def health_status(home: JournalHome) -> int:
    connection = UnixConnection(str(ServerFiles(home).socket), START_LIMIT_SECONDS)
    try:
        connection.request("GET", "/health")
        return connection.getresponse().status
    finally:
        connection.close()


def wait_started(home: JournalHome) -> None:
    files, deadline = ServerFiles(home), time.monotonic() + START_LIMIT_SECONDS
    while time.monotonic() < deadline:
        if files.pid_file.is_file() and files.socket.exists() and not home.restart_mark.exists():
            try:
                assert health_status(home) == 200
                return
            except ConnectionError:
                continue
    raise AssertionError(files.log.read_text())


@pytest.fixture
def home(tmp_path: Path) -> Generator[JournalHome]:
    project = tmp_path / "project"
    project.mkdir()
    assert InstallJournal(project, SOURCE).run() == 0
    journal = JournalHome(project / ".journal")
    server = subprocess.Popen([sys.executable, str(journal.folder / "src" / "server" / "server.py"), "--home", str(journal.folder)], cwd=project,
                              env={**os.environ, "PYTHONPATH": str(journal.folder / "src")}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    wait_started(journal)
    yield journal
    pid = ServerFiles(journal).pid_file.read_text().strip()
    subprocess.run(["kill", pid], check=False)
    server.wait(START_LIMIT_SECONDS)


def test_an_update_hands_over_to_a_new_server_on_the_same_sockets_and_refuses_no_request(home):
    running_pid, viewer_port = ServerFiles(home).pid_file.read_text(), home.viewer_port_file.read_text()
    statuses: list[int] = []
    finished = threading.Event()

    def repeated_health_requests() -> None:
        while not finished.is_set():
            statuses.append(health_status(home))

    asking = threading.Thread(target=repeated_health_requests)
    asking.start()
    try:
        CodeHandover(home).run(SOURCE)
    finally:
        finished.set()
        asking.join(START_LIMIT_SECONDS)
    wait_started(home)
    assert ServerFiles(home).pid_file.read_text() != running_pid
    assert home.viewer_port_file.read_text() == viewer_port
    assert (home.folder / "src").is_symlink()
    assert statuses and set(statuses) == {200}
    assert not home.restart_mark.exists()
    with socket.create_connection(("127.0.0.1", int(viewer_port)), timeout=5):
        pass


def test_new_code_that_fails_its_proof_leaves_the_old_server_serving(home, tmp_path):
    running_pid = ServerFiles(home).pid_file.read_text()
    broken = tmp_path / "broken"
    (broken / "server").mkdir(parents=True)
    (broken / "server" / "server.py").write_text("raise SystemExit(1)\n")
    with pytest.raises(Refusal):
        CodeHandover(home).run(broken)
    assert ServerFiles(home).pid_file.read_text() == running_pid
    assert health_status(home) == 200
    assert not (home.folder / "src").is_symlink()
    assert not home.restart_mark.exists()
