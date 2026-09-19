import sys
import tempfile
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import viewer  # noqa: E402
from engine.viewer import ensure, running  # noqa: E402
import serve as viewer_server  # noqa: E402
from serve import serve  # noqa: E402
from tests.kit import check, done  # noqa: E402

root = Path(tempfile.mkdtemp()) / ".journal"
server = serve(root, 0)
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_address[1]}/"
check("the viewer records and answers at its actual URL", running(root), url)
listed = viewer.known()
check("the machine remembers every journal whose viewer ran, newest first", (listed[0]["root"], listed[0]["project"], listed[0]["url"]), (str(root.resolve()), root.parent.name, url))
viewer.note(Path("/elsewhere/.journal"), "http://127.0.0.1:8421/")
viewer.forget("/elsewhere/.journal")
check("one entry per root, and forget drops one", [j["root"] for j in viewer.known()], [str(root.resolve())])
opened = []
focused = []
check("a journal launcher focuses the existing project viewer tab", (ensure(root, root.parent, opened.append, lambda found: focused.append(found) or True), focused, opened), (url, [url], []))
check("a journal launcher opens the viewer when its tab is missing", (ensure(root, root.parent, opened.append, lambda _: False), opened), (url, [url]))
server.shutdown()

package = Path(tempfile.mkdtemp()) / "package"
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
watcher = threading.Thread(target=viewer_server.watch_code, args=(package, FakeServer(), changed))
watcher.start()
time.sleep(0.03)
source.write_text("two\n")
watcher.join(1)
viewer_server.WATCH_SECONDS, viewer_server.SETTLE_SECONDS = originals
check("the viewer notices settled Python changes", changed.is_set(), True)

launched = []
answers = iter(("", "http://127.0.0.1:8427/"))
originals = viewer.running, viewer.available, viewer.subprocess.Popen, viewer.time.sleep
viewer.running = lambda _: next(answers)
viewer.available = lambda: 8427
viewer.subprocess.Popen = lambda command, **options: launched.append((command, options))
viewer.time.sleep = lambda _: None
fresh = Path(tempfile.mkdtemp()) / ".journal"
check("a launcher starts a missing viewer on the discovered port", viewer.start(fresh, fresh.parent), "http://127.0.0.1:8427/")
check("the detached viewer uses this record and project", (launched[0][0][-3:], launched[0][1]["cwd"], launched[0][1]["start_new_session"]), (["serve", "--port", "8427"], fresh.parent, True))
viewer.running, viewer.available, viewer.subprocess.Popen, viewer.time.sleep = originals

done()
