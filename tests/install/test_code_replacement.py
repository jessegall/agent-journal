import subprocess
import threading
import time

import pytest

from install.code_replacement import CodeReplacement
from tests.install.support import TIMEOUT_SECONDS


def test_the_steps_run_in_order_with_the_server_stopped_and_the_lock_kept(journal):
    server = journal.start_server()
    journal.wait_healthy()
    seen: list[tuple[str, bool, bool]] = []
    CodeReplacement(journal.home).run([lambda: seen.append(("copy", server.poll() is not None or server.wait(timeout=10) == 0, journal.lock_is_free())),
                                       lambda: seen.append(("sync", not journal.healthy(), journal.lock_is_free()))])
    assert seen == [("copy", True, False), ("sync", True, False)]
    assert journal.lock_is_free()


def test_the_lock_is_let_go_when_a_step_fails(journal):
    def failing() -> None:
        raise RuntimeError("the copy broke")

    with pytest.raises(RuntimeError, match="the copy broke"):
        CodeReplacement(journal.home).run([failing])
    assert journal.lock_is_free()


def test_a_client_started_during_the_steps_waits_and_is_served_by_a_server_started_after_the_release(journal, client):
    answers: list[subprocess.CompletedProcess[str]] = []

    def ask() -> None:
        answers.append(subprocess.run([str(client), "setting", "list"], env=journal.environment(), cwd=journal.home.folder.parent, capture_output=True,
                                      text=True, timeout=TIMEOUT_SECONDS))

    asker = threading.Thread(target=ask)
    CodeReplacement(journal.home).run([asker.start, lambda: time.sleep(1.5)])
    asker.join(timeout=TIMEOUT_SECONDS)
    assert len(answers) == 1 and answers[0].returncode == 0, answers
    journal.wait_healthy()
    subprocess.run([str(client), "server", "stop"], env=journal.environment(), capture_output=True, timeout=60)
