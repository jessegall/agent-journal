import os
import signal
import socket
import time

from engine.viewer import PORTS, available, free, last, restart, running, start, waited


def test_the_viewer_starts_restarts_and_finds_a_free_port(tmp_path):
    project = tmp_path
    root = project / ".journal"
    (root / "runtime").mkdir(parents=True)

    first = start(root, project)
    before = last(root)
    assert (first.endswith(f":{before['port']}/"), bool(before.get("pid"))) == (True, True), \
        "the viewer notes its port and its process"

    again = restart(root, project)
    assert (again, last(root)["pid"] != before["pid"]) == (first, True), "a restart comes back on the same port, as a new process"

    spare = available()
    held = socket.socket()
    held.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    held.bind(("127.0.0.1", spare))
    held.listen(1)
    try:
        assert free(spare) is False, "a port someone else is listening on is not free"
        began = time.time()
        assert (waited(spare, 0.4), time.time() - began >= 0.4) == (False, True), "the wait gives it a moment and then gives up"
        assert available(spare) != spare, "the preferred port being held, another is taken"
    finally:
        held.close()
    assert available(spare) == spare, "once it is let go the preferred port is taken"

    with socket.socket() as outside:
        outside.bind(("127.0.0.1", 0))
        assert (available(outside.getsockname()[1]) in PORTS) is True, "a preferred port outside the viewer's range is ignored"

    os.kill(int(last(root)["pid"]), signal.SIGTERM)
    for _ in range(50):
        if not running(root):
            break
        time.sleep(0.1)
    assert running(root) == "", "the test's viewer is stopped"
