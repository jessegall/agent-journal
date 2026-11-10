import os
import fnmatch
import hashlib
import json
import shutil
import socket
import subprocess
import sys
import threading
import tarfile
import time
from collections.abc import Generator
from pathlib import Path

import pytest

from engine.file.code_copy import IGNORED
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.testing.expectations.expect_row import expect_row
from core.base.serving.code_handover import CodeHandover
from install.update.install_journal import InstallJournal
from engine.connection.unix_connection import UnixConnection
from core.base.serving.server_files import ServerFiles
from tests.stories.support.story_checks import expect_value_4
from tests.stories.server.support.server_client import request_answer
from tests.stories.server.support.file_changes import FileChanges

pytestmark = pytest.mark.install_job

SOURCE = Path(__file__).resolve().parents[3] / "src"
START_LIMIT_SECONDS = 60


def health_status(home: JournalHome) -> int:
    connection = UnixConnection(str(ServerFiles(home).socket), START_LIMIT_SECONDS, "journal")
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
def home(tmp_path: Path, request) -> Generator[JournalHome]:
    project = tmp_path / "project"
    project.mkdir()
    assert InstallJournal(project, SOURCE).run() == 0
    journal = JournalHome(project / ".journal")
    if getattr(request, "param", "") == "takeover-error":
        (journal.folder / "src" / "server" / "successor_start.py").write_text(
            "PROOF_LIMIT_SECONDS = 180\n"
            "class SuccessorStart:\n"
            "    def __init__(self, *args): pass\n"
            "    def run(self, tag): raise OSError('takeover connection failed')\n"
        )
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
    source = Path(__file__).parents[1] / "engine" / "module" / "support" / "folder_sample"
    folder = tmp_path / "installed_notes"
    shutil.copytree(source, folder)
    added = request_answer(ServerFiles(home).socket, "POST", "/cli",
                           {"argv": ["module", "add", str(folder)], "variables": {}, "folder": str(tmp_path)})
    expect_row(added, status=200, exit_code=0)
    running_pid = ServerFiles(home).pid_file.read_text()
    CodeHandover(home).run(SOURCE)
    wait_started(home)
    expect_changed_pid_file_server(home, running_pid)
    listed = wait_for_template_list(home, tmp_path, "Folder review")
    expect_row(listed, status=200, exit_code=0)
    expect_value_4("Folder review" in listed.text)


def wait_for_template_list(home: JournalHome, folder: Path, title: str):
    """The standard templates are written by a listener after the server starts serving, so the list is read until the title shows."""
    deadline = time.monotonic() + START_LIMIT_SECONDS
    while True:
        listed = request_answer(ServerFiles(home).socket, "POST", "/cli",
                                {"argv": ["template", "list", "--target", "plan", "--purpose", "critique"], "variables": {}, "folder": str(folder)})
        if title in listed.text or time.monotonic() > deadline:
            return listed


def publish_release(home, folder, source):
    folder.mkdir()
    archive = folder / "agent-journal.tar.gz"

    def included(entry):
        return None if any(fnmatch.fnmatch(part, pattern) for part in Path(entry.name).parts for pattern in IGNORED) else entry

    with tarfile.open(archive, "w:gz") as target:
        target.add(source, arcname="src", filter=included)
    checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
    (folder / "checksums.txt").write_text(f"{checksum}  agent-journal.tar.gz\n")
    answer = cli_answer(home, ["setting", "set", "journal.core.updates.release-address", folder.as_uri(), "--project"])
    expect_row(answer, exit_code=0)


def cli_answer(home, argv):
    return request_answer(ServerFiles(home).socket, "POST", "/cli", {"argv": argv, "variables": {}, "folder": str(home.folder.parent)})


def wait_install(home, step):
    deadline = time.monotonic() + START_LIMIT_SECONDS
    answer = None
    with FileChanges(home.folder) as changes:
        while time.monotonic() < deadline:
            answer = cli_answer(home, ["release-install", "list", "--json"])
            if answer.exit_code != 0:
                raise AssertionError(answer)
            rows = json.loads(answer.text)["rows"]
            if rows and rows[0]["step"] == step:
                return rows[0]
            if not changes.wait(max(0, deadline - time.monotonic())):
                break
    raise AssertionError(f"installation did not reach {step}: {answer}")


def expect_update_available(home):
    check = cli_answer(home, ["update", "check", "--json"])
    expect_row(check, exit_code=0)
    data = json.loads(check.text)
    assert data["is_current"] is False, data
    assert "retry" in data["line"].lower(), data
    releases = cli_answer(home, ["release", "list", "--json"])
    assert json.loads(releases.text)["rows"] == [], releases


def test_a_refused_release_proof_keeps_the_old_server_and_the_update_available(home, tmp_path):
    broken = tmp_path / "broken-release"
    (broken / "server").mkdir(parents=True)
    (broken / "server" / "server.py").write_text("raise SystemExit(1)\n")
    publish_release(home, tmp_path / "published", broken)
    running_pid = ServerFiles(home).pid_file.read_text()
    expect_row(cli_answer(home, ["update", "install"]), exit_code=0)
    wait_install(home, "failed")
    expect_pid_file_server(home, running_pid)
    expect_health_status(home, 200)
    expect_update_available(home)


@pytest.mark.parametrize("home", ["takeover-error"], indirect=True)
def test_a_failed_release_takeover_keeps_the_old_server_and_allows_retry(home, tmp_path):
    publish_release(home, tmp_path / "published", SOURCE)
    running_pid = ServerFiles(home).pid_file.read_text()
    expect_row(cli_answer(home, ["update", "install"]), exit_code=0)
    wait_install(home, "failed")
    expect_pid_file_server(home, running_pid)
    expect_health_status(home, 200)
    expect_update_available(home)
    expect_row(cli_answer(home, ["update", "install"]), exit_code=0)


def test_an_asynchronous_release_is_recorded_only_after_the_successor_takes_over(home, tmp_path):
    publish_release(home, tmp_path / "published", SOURCE)
    running_pid = ServerFiles(home).pid_file.read_text()
    answer = cli_answer(home, ["update", "install"])
    expect_row(answer, exit_code=0)
    expect_install_started(answer)
    wait_install(home, "finished")
    expect_changed_pid_file_server(home, running_pid)
    expect_health_status(home, 200)
    expect_installed_release(home)


def expect_install_started(answer):
    assert "installation started" in answer.text, answer


def expect_installed_release(home):
    check = cli_answer(home, ["update", "check", "--json"])
    assert json.loads(check.text)["is_current"] is True, check
    releases = cli_answer(home, ["release", "list", "--json"])
    assert len(json.loads(releases.text)["rows"]) == 1, releases


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
