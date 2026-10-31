import os
import signal
import subprocess
import time
from pathlib import Path

import pytest

from core.base.journal_home import JournalHome
from tests.stories.tunnels.tunler.support.real_tunler import real_client

SCRIPT = "#!/bin/sh\nsleep 300 &\ntrap 'kill $!; exit 0' TERM\nwait\n"
PORT = 8000
SUBDOMAIN = "cart-team"


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
    assert running_tunlers(program) == [leftover]
    second = real_client(home)
    second.start(PORT, SUBDOMAIN)
    time.sleep(0.3)
    assert running_tunlers(program) == [second.process.pid] and leftover != second.process.pid
    second.stop()
    assert running_tunlers(program) == [] and not (home.folder / "tunnel.pid").exists()


def test_a_pid_that_names_some_other_program_is_left_alone(program, tmp_path):
    home = JournalHome(tmp_path / "project" / ".journal")
    home.folder.mkdir(parents=True)
    bystander = subprocess.Popen(["sleep", "300"])
    try:
        (home.folder / "tunnel.pid").write_text(str(bystander.pid))
        client = real_client(home)
        client.start(PORT, SUBDOMAIN)
        assert bystander.poll() is None
        client.stop()
    finally:
        bystander.kill()
        bystander.wait()
