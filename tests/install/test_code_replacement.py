import subprocess

import pytest

from install.update.code_replacement import CodeReplacement
from tests.install.support import TIMEOUT_SECONDS


def test_the_steps_run_in_order_with_the_server_stopped_and_the_lock_kept(journal):
    server = journal.start_server()
    journal.wait_healthy()
    steps: list[tuple[str, bool, bool]] = []
    CodeReplacement(journal.home).run([lambda: steps.append(("copy", server.poll() is not None or server.wait(timeout=10) == 0, journal.lock_free())),
                                       lambda: steps.append(("sync", not journal.healthy(), journal.lock_free()))])
    assert steps == [("copy", True, False), ("sync", True, False)]
    assert journal.lock_free()


def test_the_lock_is_let_go_when_a_step_fails(journal):
    def failing() -> None:
        raise RuntimeError("the copy broke")

    with pytest.raises(RuntimeError, match="the copy broke"):
        CodeReplacement(journal.home).run([failing])
    assert journal.lock_free()


def test_a_client_started_during_the_steps_waits_and_is_served_by_a_server_started_after_the_release(journal, client):
    clients: list[subprocess.Popen[str]] = []
    waited: list[bool] = []

    def start_client() -> None:
        clients.append(subprocess.Popen([str(client), "setting", "list"], env=journal.environment(), cwd=journal.home.folder.parent,
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True))

    CodeReplacement(journal.home).run([start_client, lambda: waited.append(clients[0].poll() is None)])
    output, errors = clients[0].communicate(timeout=TIMEOUT_SECONDS)
    journal.stop_with(client)
    assert waited == [True] and clients[0].returncode == 0, (output, errors)