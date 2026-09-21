import threading
import time
from pathlib import Path

from engine import viewer
from engine.viewer import ensure, running
import serve as viewer_server
from serve import serve


def test_the_machine_remembers_every_viewer_and_a_launcher_focuses_or_opens_it(tmp_path):
    root = tmp_path / ".journal"
    server = serve(root, 0)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        url = f"http://127.0.0.1:{server.server_address[1]}/"
        assert running(root) == url, "the viewer records and answers at its actual URL"
        listed = viewer.known()
        assert (listed[0]["root"], listed[0]["project"], listed[0]["url"]) == (str(root.resolve()), root.parent.name, url), \
            "the machine remembers every journal whose viewer ran, newest first"
        viewer.note(Path("/elsewhere/.journal"), "http://127.0.0.1:8421/")
        viewer.forget("/elsewhere/.journal")
        assert [j["root"] for j in viewer.known()] == [str(root.resolve())], "one entry per root, and forget drops one"
        opened = []
        focused = []
        assert (ensure(root, root.parent, opened.append, lambda found: focused.append(found) or True), focused, opened) == (url, [url], []), \
            "a journal launcher focuses the existing project viewer tab"
        assert (ensure(root, root.parent, opened.append, lambda _: False), opened) == (url, [url]), \
            "a journal launcher opens the viewer when its tab is missing"
    finally:
        server.shutdown()


def test_the_viewer_notices_settled_python_changes(tmp_path):
    package = tmp_path / "package"
    package.mkdir()
    source = package / "serve.py"
    source.write_text("one\n")

    class FakeServer:
        stopped = False

        def shutdown(self):
            self.stopped = True

    changed = threading.Event()
    originals = viewer_server.WATCH_SECONDS, viewer_server.SETTLE_SECONDS
    viewer_server.WATCH_SECONDS, viewer_server.SETTLE_SECONDS = 0.01, 0.02
    try:
        watcher = threading.Thread(target=viewer_server.watch_code, args=(package, FakeServer(), changed))
        watcher.start()
        time.sleep(0.03)
        source.write_text("two\n")
        watcher.join(1)
    finally:
        viewer_server.WATCH_SECONDS, viewer_server.SETTLE_SECONDS = originals
    assert changed.is_set() is True, "the viewer notices settled Python changes"


def test_a_launcher_starts_a_missing_viewer_on_the_discovered_port(tmp_path):
    launched = []
    answers = iter(("", "http://127.0.0.1:8427/"))
    originals = viewer.running, viewer.available, viewer.subprocess.Popen, viewer.time.sleep
    viewer.running = lambda _: next(answers)
    viewer.available = lambda prefer=0: 8427
    viewer.subprocess.Popen = lambda command, **options: launched.append((command, options))
    viewer.time.sleep = lambda _: None
    try:
        fresh = tmp_path / ".journal"
        assert viewer.start(fresh, fresh.parent) == "http://127.0.0.1:8427/", "a launcher starts a missing viewer on the discovered port"
        assert (launched[0][0][-3:], launched[0][1]["cwd"], launched[0][1]["start_new_session"]) == \
            (["serve", "--port", "8427"], fresh.parent, True), "the detached viewer uses this record and project"
    finally:
        viewer.running, viewer.available, viewer.subprocess.Popen, viewer.time.sleep = originals
