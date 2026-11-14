import os
import signal
import subprocess
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from tests.stories.tunnels.tunler.support.real_tunler import real_client
from tests.stories.support.story_checks import expect_absent_exists_folder_repository, expect_poll_second

SCRIPT = "#!/bin/sh\nsleep 300 &\ntrap 'kill $!; exit 0' TERM\nwait\n"
PORT = 8000
SUBDOMAIN = "cart-team"
STOP_LIMIT_SECONDS = 5


def running_tunlers(program: Path) -> list[int]:
    listing = subprocess.run(["ps", "-axo", "pid=,command="], capture_output=True, text=True, check=True).stdout.splitlines()
    return [int(line.split()[0]) for line in listing if str(program) in line and "ps -axo" not in line]


@pytest.fixture
def program(tmp_path, monkeypatch):
    folder = tmp_path / "bin"
    folder.mkdir()
    tunler = folder / "tunler"
    tunler.write_text(SCRIPT)
    tunler.chmod(0o755)
    monkeypatch.setenv("PATH", f"{folder}:{os.environ['PATH']}")
    yield tunler
    for pid in running_tunlers(tunler):
        os.kill(pid, signal.SIGKILL)


def test_a_server_killed_with_its_tunler_up_finds_one_tunler_after_it_starts_again(program, tmp_path):
    home = JournalHome(tmp_path / "project" / ".journal")
    home.folder.mkdir(parents=True)
    first = real_client(home)
    first.start(PORT, SUBDOMAIN)
    leftover = first.process.pid
    expect_running_tunlers(program, [leftover])
    second = real_client(home)
    second.start(PORT, SUBDOMAIN)
    first.process.wait(STOP_LIMIT_SECONDS)
    expect_running_tunlers(program, [second.process.pid])
    expect_changed_value_2(leftover, second.process.pid)
    second.stop()
    expect_running_tunlers(program, [])
    expect_absent_exists_folder_repository(home, "tunnel.pid")


def test_a_pid_that_names_some_other_program_is_left_alone(program, tmp_path):
    home = JournalHome(tmp_path / "project" / ".journal")
    home.folder.mkdir(parents=True)
    unrelated_process = subprocess.Popen(["sleep", "300"])
    try:
        (home.folder / "tunnel.pid").write_text(str(unrelated_process.pid))
        client = real_client(home)
        client.start(PORT, SUBDOMAIN)
        expect_poll_second(unrelated_process, None)
        client.stop()
    finally:
        unrelated_process.kill()
        unrelated_process.wait()


def expect_running_tunlers(program: Path, expected) -> None:
    actual = running_tunlers(program)
    assert actual == expected, actual


def expect_changed_value_2(actual, expected) -> None:
    assert actual != expected, actual
