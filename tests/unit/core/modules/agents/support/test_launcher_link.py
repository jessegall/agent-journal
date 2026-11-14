import os
import subprocess
import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace

import pytest

from core.modules.agents.support.launcher_link import ANSWER_BYTES, LauncherLink
from core.modules.agents.testing.fake_launcher import FakeLauncher

START_REQUEST = {"agent_id": 41, "command": ["claude"]}


class CountingService:
    """Counts each launcher the link asks for and starts none."""

    def __init__(self) -> None:
        self.start_count = 0

    def start(self) -> bool:
        self.start_count += 1
        return False


@pytest.fixture
def refusing_socket() -> Path:
    """A launcher socket whose file is there and refuses every connection."""
    path = Path(tempfile.mkdtemp()) / "launcher"
    FakeLauncher.accepting(path).server.close()
    return path


def link_target(path: Path) -> tuple[LauncherLink, CountingService]:
    service = CountingService()
    return LauncherLink(SimpleNamespace(socket=lambda name: path), service), service


def ended_process_id() -> int:
    finished = subprocess.Popen([sys.executable, "-c", "pass"])
    finished.wait()
    return finished.pid


def test_a_launcher_whose_process_runs_and_refuses_is_not_replaced_and_keeps_its_socket(refusing_socket):
    refusing_socket.with_name("launcher.pid").symlink_to(str(os.getpid()))
    link, service = link_target(refusing_socket)
    assert link.request_launcher(START_REQUEST, ANSWER_BYTES) is None
    assert (service.start_count, refusing_socket.exists()) == (0, True)


def test_a_socket_left_by_a_launcher_whose_process_ended_is_removed_and_one_launcher_is_started(refusing_socket):
    refusing_socket.with_name("launcher.pid").symlink_to(str(ended_process_id()))
    link, service = link_target(refusing_socket)
    assert link.request_launcher(START_REQUEST, ANSWER_BYTES) is None
    assert (service.start_count, refusing_socket.exists()) == (1, False)


def test_a_socket_with_no_process_link_is_treated_as_left_by_a_launcher_that_ended(refusing_socket):
    link, service = link_target(refusing_socket)
    link.request_launcher(START_REQUEST, ANSWER_BYTES)
    assert (service.start_count, refusing_socket.exists()) == (1, False)


def test_a_request_that_starts_no_program_never_starts_a_launcher(refusing_socket):
    link, service = link_target(refusing_socket)
    assert not link.has_program(41)
    assert service.start_count == 0
