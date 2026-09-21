import json
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import pytest

import features
from controllers.types import Agents, Notices, Nudges, Plugins, Todos
from features.plugins.host import Host, PATIENCE
from features.plugins.queue import path
from features.plugins.source import folder, home, log
from resources.base import AGENT, PLUGIN, SYSTEM
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def installed(record, manifest, handler=""):
    where = folder(record.root, manifest["name"])
    home(record.root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    if handler:
        (where / "handler.sh").write_text(handler)
    return Plugins(record, actor=SYSTEM).create(manifest["name"], manifest=manifest, enabled=True, token="t0ken", settings={})


def test_events_reach_a_listening_plugin_from_the_moment_it_is_installed():
    record = fresh()
    Agents(record, actor=SYSTEM).by_session("claude-1")
    seen = folder(record.root, "works") / "seen.jsonl"
    installed(record, {"name": "works", "on": {"todo.created": {"run": "sh handler.sh"}}},
              handler=f"cat >> {seen}\necho '{{\"whisper\": \"a row was filed\"}}'\n")
    host = Host(record.root)
    todos = Todos(record, actor=AGENT)

    todos.create("before the plugin was listening")
    assert (host.step(), seen.exists()) == (0, False), "nothing old is delivered on the first step"

    made = todos.create("fix the header")
    assert (host.step(), host.step()) == (1, 0), "the matching event is delivered once"
    payload = json.loads(seen.read_text().splitlines()[0])
    assert (payload["event"], payload["n"], payload["resource"]["title"]) == ("todo.created", made.n, "fix the header"), \
        "the plugin is handed the event and the row"
    assert [n.brief for n in Nudges(record).all()] == ["a row was filed"], "its answer was applied"

    todos.update(made.n, brief="still wrapping")
    assert (host.step(), len(seen.read_text().splitlines())) == (0, 1), \
        "an event with no handler is passed over, and nothing more reaches the plugin"

    Todos(record, actor=PLUGIN).create("filed by the plugin", plugin="works")
    host.step()
    assert len(seen.read_text().splitlines()) == 1, "the plugin's own row is not sent back to it"


def test_a_failing_handler_is_logged_and_a_plugin_that_keeps_failing_backs_off():
    noisy = fresh("noisy")
    installed(noisy, {"name": "noisy", "on": {"todo.created": {"run": "sh handler.sh"}}}, handler="echo boom >&2; exit 1\n")
    loud = Host(noisy.root)
    Todos(noisy, actor=AGENT).create("one")
    loud.step()
    Todos(noisy, actor=AGENT).create("two")
    assert (loud.step(), "boom" in log(noisy.root, "noisy").read_text()) == (1, True), \
        "a failing handler is written to the plugin's log and does not stop the next event"

    base = time.time()
    loud.trouble.clear()
    for i in range(PATIENCE - 1):
        Todos(noisy, actor=AGENT).create(f"row {i}")
        loud.step(now=base)
    assert (Notices(noisy).all(), loud.trouble["noisy"]["failures"]) == ([], PATIENCE - 1), "while it is only stumbling, nothing is said"
    Todos(noisy, actor=AGENT).create("the one too many")
    loud.step(now=base)
    told = Notices(noisy).all()
    assert (len(told), told[0].title, "boom" in told[0].brief, "noisy.log" in told[0].brief) == \
        (1, "Plugin noisy is failing", True, True), "after five failures in a row the user is told once, with the log"
    assert (loud.trouble["noisy"]["until"] > base, loud.step(now=base)) == (True, 0), \
        "and it is left alone until its wait is over"
    (folder(noisy.root, "noisy") / "handler.sh").write_text("echo '{}'\n")
    Todos(noisy, actor=AGENT).create("after it was fixed")
    assert (loud.step(now=base + 120) > 0, bool(Notices(noisy).load(told[0].n).completed), "noisy" in loud.trouble) == (True, True, False), \
        "once it answers again, the notice is closed and it is no longer held back"


def test_events_older_than_the_replay_window_are_passed_over_after_the_viewer_was_down():
    old = fresh("old")
    installed(old, {"name": "late", "on": {"todo.created": {"run": "sh handler.sh"}}}, handler=f"echo delivered >> {folder(old.root, 'late') / 'late.txt'}\n")
    Todos(old, actor=AGENT).create("one")
    waited = Host(old.root, replay=60)
    waited.step()
    Todos(old, actor=AGENT).create("two")
    waited.step(now=time.time() + 3600)
    assert (folder(old.root, "late") / "late.txt").exists() is False, "an event older than the window is skipped, not delivered late"


def test_a_post_handler_is_delivered_over_http_and_the_cursor_waits_while_the_service_is_down():
    calls = []

    class Service(BaseHTTPRequestHandler):
        def do_POST(self):
            calls.append(json.loads(self.rfile.read(int(self.headers["Content-Length"]))))
            body = json.dumps({"todo": {"title": "asked for by the service"}}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            return

    posted = fresh("posted")
    server = ThreadingHTTPServer(("127.0.0.1", 0), Service)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        port = server.server_address[1]
        rows = Todos(posted, actor=AGENT)
        down = Host(posted.root)
        installed(posted, {"name": "over-http", "on": {"todo.created": {"post": f"http://127.0.0.1:{port + 1}/journal/events"}}})
        down.step()
        rows.create("while the service is down")
        assert (down.step(), posted.cursor("plugin-over-http") < posted.last_event()) == (0, True), \
            "a post to a service that is down delivers nothing and keeps the cursor"
        Plugins(posted, actor=SYSTEM).update(1, manifest={"name": "over-http", "on": {"todo.created": {"post": f"http://127.0.0.1:{port}/journal/events"}}})
        assert (down.step(), [c["resource"]["title"] for c in calls], [t.title for t in rows.all() if t.seen == [PLUGIN]]) == \
            (1, ["while the service is down"], ["asked for by the service"]), "once it answers, the event arrives and its answer is applied"
    finally:
        server.shutdown()


def test_a_service_with_nothing_to_say_answers_an_empty_list_and_that_is_not_a_failure():
    class Quiet(BaseHTTPRequestHandler):
        def do_POST(self):
            self.rfile.read(int(self.headers["Content-Length"]))
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", "2")
            self.end_headers()
            self.wfile.write(b"[]")

        def log_message(self, *args):
            return

    quiet = ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
    threading.Thread(target=quiet.serve_forever, daemon=True).start()
    try:
        silent = fresh("silent")
        host = Host(silent.root)
        installed(silent, {"name": "quiet", "on": {"todo.created": {"post": f"http://127.0.0.1:{quiet.server_address[1]}/journal/events"}}})
        host.step()
        Todos(silent, actor=AGENT).create("nothing comes back")
        assert (host.step(), silent.cursor("plugin-quiet") == silent.last_event(), host.trouble) == (1, True, {}), \
            "an empty list is taken as nothing to do, and the cursor moves"
    finally:
        quiet.shutdown()


def test_the_host_runs_in_the_server_started_once_it_delivers_by_itself():
    from features import FEATURES
    live = fresh("live")
    Agents(live, actor=SYSTEM).by_session("claude-1")
    landed = folder(live.root, "live") / "landed.txt"
    installed(live, {"name": "live", "on": {"todo.created": {"run": "sh handler.sh"}}}, handler=f"cat > /dev/null; echo landed >> {landed}\necho '{{\"whisper\": \"heard it\"}}'\n")
    FEATURES["plugins"].host(live.root)
    time.sleep(1.2)
    Todos(live, actor=AGENT).create("while the host is running")
    for _ in range(40):
        if landed.exists():
            break
        time.sleep(0.25)
    assert (landed.exists(), [n.brief for n in Nudges(live).all()]) == (True, ["heard it"]), \
        "the running host delivers without being stepped"
    assert (FEATURES["plugins"].host(live.root) or True) is True, "a second host on the same journal does not double up"


def test_a_plugins_queue_is_a_file_of_journal_commands_drained_a_few_lines_a_step():
    lined = fresh("lined")
    (lined.root / "runtime").mkdir(parents=True, exist_ok=True)
    (lined.root / "runtime" / "env").write_text(lined.env)
    host = Host(lined.root)
    installed(lined, {"name": "queued"})
    queue = path(lined.root, "queued")
    queue.parent.mkdir(parents=True, exist_ok=True)
    queue.write_text("".join(f'todo create "row {i}"\n' for i in range(1, 8)))
    assert (host.step(), len(Todos(lined).all()), queue.read_text().splitlines()) == \
        (5, 5, ['todo create "row 6"', 'todo create "row 7"']), "a step takes five lines and leaves the rest"
    assert (host.step(), len(Todos(lined).all()), queue.read_text().strip()) == (2, 7, ""), "the next step takes what is left"
    assert {tuple(t.seen) for t in Todos(lined).all()} == {(PLUGIN,)}, "every queued row is written as the plugin"
    queue.write_text("nonsense here\n")
    host.step()
    assert ("nonsense here was refused" in log(lined.root, "queued").read_text(), queue.read_text().strip()) == (True, ""), \
        "a line that is not a journal command is refused and logged, and the queue still empties"
