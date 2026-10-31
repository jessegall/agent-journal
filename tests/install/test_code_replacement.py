import subprocess
import threading
import time

import pytest

from install.code_replacement import CodeReplacement
from tests.install.support import TIMEOUT_SECONDS


def test_the_steps_run_in_order_with_the_server_stopped_and_the_lock_kept(journal):
    server = journal.start_server()
    journal.wait_healthy()
    steps: list[tuple[str, bool, bool]] = []
    CodeReplacement(journal.home).run([lambda: steps.append(("copy", server.poll() is not None or server.wait(timeout=10) == 0, journal.lock_is_free())),
                                       lambda: steps.append(("sync", not journal.healthy(), journal.lock_is_free()))])
    assert steps == [("copy", True, False), ("sync", True, False)]
    assert journal.lock_is_free()


def test_the_lock_is_let_go_when_a_step_fails(journal):
    def failing() -> None:
        raise RuntimeError("the copy broke")

    with pytest.raises(RuntimeError, match="the copy broke"):
        CodeReplacement(journal.home).run([failing])
    assert journal.lock_is_free()


def test_a_client_started_during_the_steps_waits_and_is_served_by_a_server_started_after_the_release(journal, client):
    client_runs: list[subprocess.CompletedProcess[str]] = []

    def run_client() -> None:
        client_runs.append(subprocess.run([str(client), "setting", "list"], env=journal.environment(), cwd=journal.home.folder.parent, capture_output=True,
                                      text=True, timeout=TIMEOUT_SECONDS))

    client_thread = threading.Thread(target=run_client)
    CodeReplacement(journal.home).run([client_thread.start, lambda: time.sleep(1.5)])
    client_thread.join(timeout=TIMEOUT_SECONDS)
    assert len(client_runs) == 1 and client_runs[0].returncode == 0, client_runs
    journal.wait_healthy()
    subprocess.run([str(client), "server", "stop"], env=journal.environment(), capture_output=True, timeout=60)
