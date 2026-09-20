import os
import signal
import socket
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.viewer import PORTS, available, free, last, restart, running, start, waited  # noqa: E402
from tests.kit import check, done  # noqa: E402

project = Path(tempfile.mkdtemp())
root = project / ".journal"
(root / "runtime").mkdir(parents=True)

first = start(root, project)
before = last(root)
check("the viewer notes its port and its process", (first.endswith(f":{before['port']}/"), bool(before.get("pid"))), (True, True))

again = restart(root, project)
check("a restart comes back on the same port, as a new process", (again, last(root)["pid"] != before["pid"]), (first, True))

spare = available()
held = socket.socket()
held.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
held.bind(("127.0.0.1", spare))
held.listen(1)
check("a port someone else is listening on is not free", free(spare), False)
began = time.time()
check("the wait gives it a moment and then gives up", (waited(spare, 0.4), time.time() - began >= 0.4), (False, True))
check("the preferred port being held, another is taken", available(spare) != spare, True)
held.close()
check("once it is let go the preferred port is taken", available(spare), spare)

with socket.socket() as outside:
    outside.bind(("127.0.0.1", 0))
    check("a preferred port outside the viewer's range is ignored", available(outside.getsockname()[1]) in PORTS, True)

os.kill(int(last(root)["pid"]), signal.SIGTERM)
for _ in range(50):
    if not running(root):
        break
    time.sleep(0.1)
check("the test's viewer is stopped", running(root), "")

done()
