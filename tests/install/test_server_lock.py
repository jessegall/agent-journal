import subprocess
import sys
import threading
import time

import pytest

from install.server_lock import ServerLock, ServerWontStopError
from tests.install.support import SERVER_SOURCE, TIMEOUT_SECONDS

STUBBORN_SERVER = """
import fcntl, socket, sys
folder, path = sys.argv[1], sys.argv[2]
lock = open(folder + "/server.lock", "a")
fcntl.flock(lock, fcntl.LOCK_EX)
listener = socket.socket(socket.AF_UNIX)
listener.bind(path)
listener.listen()
while True:
    connection, _ = listener.accept()
    connection.recv(4096)
    connection.sendall(b"HTTP/1.1 200 OK\\r\\nContent-Length: 2\\r\\nConnection: close\\r\\n\\r\\n{}")
    connection.close()
"""

LOCK_HOLDER_SCRIPT = """
import sys, time
from pathlib import Path
from core.base.journal_home import JournalHome
from install.server_lock import ServerLock
with ServerLock(JournalHome(Path(sys.argv[1]))):
    print("held", flush=True)
    time.sleep(120)
"""


def test_the_lock_helper_stops_a_running_server_waits_for_it_to_drain_and_holds_the_lock(journal):
    server = journal.start_server()
    journal.wait_healthy()
    with ServerLock(journal.home):
        assert server.wait(timeout=10) == 0 and not journal.healthy()
        assert not journal.lock_is_free()
    assert journal.lock_is_free()


def test_a_client_started_while_the_lock_is_held_waits_and_starts_the_new_server_after_the_release(journal, client):
    with ServerLock(journal.home):
        running = subprocess.Popen([str(client), "setting", "list"], env=journal.environment(), cwd=journal.home.folder.parent, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True)
        time.sleep(1.5)
        assert running.poll() is None and not (journal.home.folder / "server.pid").exists()
    stdout, stderr = running.communicate(timeout=TIMEOUT_SECONDS)
    journal.wait_healthy()
    assert running.returncode == 0, stdout + stderr
    assert (journal.home.folder / "server.pid").exists()
    subprocess.run([str(client), "server", "stop"], env=journal.environment(), capture_output=True, timeout=60)


def test_a_server_cannot_start_on_its_own_while_the_lock_is_held(journal):
    with ServerLock(journal.home):
        second = journal.start_server()
        assert second.wait(timeout=30) == 0
        assert not journal.healthy() and not (journal.home.folder / "server.pid").exists()


def test_a_server_that_will_not_stop_in_the_limit_makes_the_helper_refuse_and_change_nothing(journal):
    stubborn = subprocess.Popen([sys.executable, "-c", STUBBORN_SERVER, str(journal.home.folder), str(journal.home.socket("server"))])
    journal.processes.append(stubborn)
    journal.wait_healthy()
    with pytest.raises(ServerWontStopError, match="did not stop in 1 seconds"):
        with ServerLock(journal.home, stop_limit_seconds=1):
            pytest.fail("the lock was taken from a server that did not stop")
    assert stubborn.poll() is None and not journal.lock_is_free()


def test_releasing_after_a_crash_of_the_holder_lets_the_next_start_proceed(journal):
    environment = {**journal.environment(), "PYTHONPATH": str(SERVER_SOURCE)}
    lock_process = subprocess.Popen([sys.executable, "-c", LOCK_HOLDER_SCRIPT, str(journal.home.folder)], env=environment, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    journal.processes.append(lock_process)
    assert lock_process.stdout is not None
    first_line = lock_process.stdout.readline().strip()
    if first_line != "held":
        lock_process.kill()
        first_line += lock_process.stdout.read()
    assert first_line == "held", first_line
    assert not journal.lock_is_free()
    lock_process.kill()
    lock_process.wait(timeout=10)
    assert journal.lock_is_free()
    journal.start_server()
    journal.wait_healthy()


def test_two_installs_at_once_take_the_lock_in_turn(journal):
    spans: list[tuple[float, float]] = []

    def install() -> None:
        with ServerLock(journal.home, lock_limit_seconds=30):
            started = time.monotonic()
            time.sleep(0.5)
            spans.append((started, time.monotonic()))

    threads = [threading.Thread(target=install) for _ in range(2)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join(timeout=60)
    first, second = sorted(spans)
    assert len(spans) == 2 and first[1] <= second[0]
