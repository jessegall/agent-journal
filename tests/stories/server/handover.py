import os
import shutil
import socket
import subprocess
import sys
import threading
import time
from collections.abc import Generator
from pathlib import Path

import pytest

from core.base.code_copy import IGNORED
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.testing.expect_row import expect_row
from install.code_handover import CodeHandover
from install.install_journal import InstallJournal
from install.unix_connection import UnixConnection
from server.server_files import ServerFiles
from tests.stories.support.story_checks import expect_value_4
from tests.stories.server.support.server_client import request_answer

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
    expect_changed_pid_file_server(home, running_pid)
    expect_viewer_port_file(home, viewer_port)
    expect_symlink_folder_home(home, "src")
    expect_value_4(statuses)
    expect_statuses(statuses, {200})
    expect_absent_exists_restart_mark(home)
    with socket.create_connection(("127.0.0.1", int(viewer_port)), timeout=5):
        pass


def test_two_updates_in_a_row_leave_the_server_on_the_newest_code_with_the_one_before_it_kept(home, tmp_path):
    first, second = tmp_path / "first", tmp_path / "second"
    for source, text in ((first, "# first update\n"), (second, "# second update\n")):
        shutil.copytree(SOURCE, source, ignore=shutil.ignore_patterns(*IGNORED))
        (source / "update_note.py").write_text(text)
        CodeHandover(home).run(source)
        wait_started(home)
    expect_folder_home_src(home, "src", "update_note.py", "# second update\n")
    expect_health_status(home, 200)
    expect_version_iterdir_folder(home, "versions", 2)


def test_new_code_that_fails_its_proof_leaves_the_old_server_serving(home, tmp_path):
    running_pid = ServerFiles(home).pid_file.read_text()
    broken = tmp_path / "broken"
    (broken / "server").mkdir(parents=True)
    (broken / "server" / "server.py").write_text("raise SystemExit(1)\n")
    with pytest.raises(Refusal):
        CodeHandover(home).run(broken)
    expect_pid_file_server(home, running_pid)
    expect_health_status(home, 200)
    expect_absent_symlink_folder_home(home, "src")
    expect_absent_exists_restart_mark(home)


def test_an_external_module_still_loads_after_a_server_handover(home, tmp_path):
    source = Path(__file__).parents[1] / "core" / "base" / "module" / "support" / "folder_sample"
    folder = tmp_path / "installed_notes"
    shutil.copytree(source, folder)
    added = request_answer(ServerFiles(home).socket, "POST", "/cli",
                           {"argv": ["module", "add", str(folder)], "variables": {}, "folder": str(tmp_path)})
    expect_row(added, status=200, exit_code=0)
    running_pid = ServerFiles(home).pid_file.read_text()
    CodeHandover(home).run(SOURCE)
    wait_started(home)
    expect_changed_pid_file_server(home, running_pid)
    listed = request_answer(ServerFiles(home).socket, "POST", "/cli",
                            {"argv": ["template", "list", "--target", "plan", "--purpose", "critique"], "variables": {}, "folder": str(tmp_path)})
    expect_row(listed, status=200, exit_code=0)
    expect_value_4("Folder review" in listed.text)


def expect_health_status(home: JournalHome, expected) -> None:
    actual = health_status(home)
    assert actual == expected, actual


def expect_absent_exists_restart_mark(home) -> None:
    actual = home.restart_mark.exists()
    assert not actual, actual


def expect_absent_symlink_folder_home(home, text) -> None:
    actual = (home.folder / text).is_symlink()
    assert not actual, actual


def expect_pid_file_server(home, expected) -> None:
    actual = ServerFiles(home).pid_file.read_text()
    assert actual == expected, actual


def expect_version_iterdir_folder(home, text, expected) -> None:
    actual = len([version for version in (home.folder / text).iterdir() if version.is_dir()])
    assert actual == expected, actual


def expect_folder_home_src(home, text, text_2, expected) -> None:
    actual = (home.folder / text / text_2).read_text()
    assert actual == expected, actual


def expect_statuses(statuses, expected) -> None:
    actual = set(statuses)
    assert actual == expected, actual


def expect_symlink_folder_home(home, text) -> None:
    actual = (home.folder / text).is_symlink()
    assert actual, actual


def expect_viewer_port_file(home, expected) -> None:
    actual = home.viewer_port_file.read_text()
    assert actual == expected, actual


def expect_changed_pid_file_server(home, expected) -> None:
    actual = ServerFiles(home).pid_file.read_text()
    assert actual != expected, actual
