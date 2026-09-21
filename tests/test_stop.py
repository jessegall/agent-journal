import threading
import time

import serve
from commands.http import dispatch
from engine.stop import ask, asked, clear, gone


class Server:
    def __init__(self):
        self.down = False

    def shutdown(self):
        self.down = True


def test_the_stop_flag_is_asked_for_seen_and_cleared(tmp_path):
    root = tmp_path / ".journal"
    (root / "runtime").mkdir(parents=True)

    assert asked(root) is False, "nothing is asked to begin with"
    ask(root)
    assert (asked(root), (root / "runtime" / "stop").is_file()) == (True, True), \
        "asking leaves the flag where everything watching it looks"
    clear(root)
    assert asked(root) is False, "clearing takes it away"

    served = Server()
    halting = threading.Event()
    threading.Thread(target=serve.watch_stop, args=(root, served, halting), daemon=True).start()
    ask(root)
    for _ in range(50):
        if served.down:
            break
        time.sleep(0.1)
    assert (served.down, halting.is_set()) == (True, True), "the viewer is shut down once the flag is there, and says it is halting"

    stale = Server()
    after = threading.Event()
    threading.Thread(target=serve.watch_stop, args=(root, stale, after, time.time() + 1), daemon=True).start()
    time.sleep(1.5)
    assert (stale.down, after.is_set()) == (False, False), "a stop asked before this one started is ignored"
    after.set()
    clear(root)

    reply = dispatch("POST", "/api/stop", root, {}, {})
    assert (reply.code, reply.body, asked(root)) == (200, {"stopping": True}, True), "the viewer's stop route asks for it"
    clear(root)

    assert gone(root, seconds=1.0) is True, "with no viewer running, it is already gone"
