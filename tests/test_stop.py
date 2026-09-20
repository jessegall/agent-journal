import sys
import tempfile
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import serve  # noqa: E402
from commands.http import dispatch  # noqa: E402
from engine.stop import ask, asked, clear, gone  # noqa: E402
from tests.kit import check, done  # noqa: E402

root = Path(tempfile.mkdtemp()) / ".journal"
(root / "runtime").mkdir(parents=True)

# THE FLAG is asked for, seen and cleared by whoever asked
check("nothing is asked to begin with", asked(root), False)
ask(root)
check("asking leaves the flag where everything watching it looks", (asked(root), (root / "runtime" / "stop").is_file()), (True, True))
clear(root)
check("clearing takes it away", asked(root), False)

# THE VIEWER watches the flag and shuts itself down, without the restart the code watch uses
class Server:
    def __init__(self):
        self.down = False

    def shutdown(self):
        self.down = True


served = Server()
halting = threading.Event()
threading.Thread(target=serve.watch_stop, args=(root, served, halting), daemon=True).start()
ask(root)
for _ in range(50):
    if served.down:
        break
    time.sleep(0.1)
check("the viewer is shut down once the flag is there, and says it is halting", (served.down, halting.is_set()), (True, True))

# A FLAG LEFT BEHIND by an earlier stop never takes down what started after it
stale = Server()
after = threading.Event()
threading.Thread(target=serve.watch_stop, args=(root, stale, after, time.time() + 1), daemon=True).start()
time.sleep(1.5)
check("a stop asked before this one started is ignored", (stale.down, after.is_set()), (False, False))
after.set()
clear(root)

# THE ROUTE asks for the same stop the command does
reply = dispatch("POST", "/api/stop", root, {}, {})
check("the viewer's stop route asks for it", (reply.code, reply.body, asked(root)), (200, {"stopping": True}, True))
clear(root)

# WAITING FOR IT TO GO answers as soon as no viewer answers on this root
check("with no viewer running, it is already gone", gone(root, seconds=1.0), True)

done()
