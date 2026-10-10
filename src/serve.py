import faulthandler
import gc
import json
import os
import re
import resource
import signal
import sys
import threading
import time
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
import features
from engine.multipart import UPLOAD_LIMIT, UPLOAD_LIMIT_MB, spooled
from features.auto_update.announcing import announce  # noqa: E402
from commands.boot import boot  # noqa: E402
import commands.cli  # noqa: E402,F401
from commands.http import dispatch, unanswered  # noqa: E402
from controllers.stored import DEFER, flush_indexes, renew_stamps, watch_marks  # noqa: E402
from commands.dispatch import hook_path, reached_by_phone  # noqa: E402
from features.routing import resolve  # noqa: E402
from features.phone.allow_list import PhoneVisit, Reach  # noqa: E402
from features.routing import PHONE_ENVIRONMENT, PHONE_MEMBER, PHONE_UNLOCKED, Reply, sender_of  # noqa: E402
from controllers.base import SENDER, Sender  # noqa: E402
from resources.base import OWNER_ID  # noqa: E402
from engine import bus, runtime, waits  # noqa: E402
from engine.after_answer import AfterAnswer  # noqa: E402
from engine.quiet_collector import QuietCollector  # noqa: E402
from features.switches import WARMERS  # noqa: E402
from engine.stop import asked  # noqa: E402
from engine.viewer import elsewhere, heartbeat, known, pulse, remember  # noqa: E402
from controllers.types import warm  # noqa: E402
from providers.turns import read_transcripts  # noqa: E402
from runner.spool import drain, replay, spooled  # noqa: E402
from engine.runtime import default_env
from engine.package import ARCHIVE, CODE, ZIPPED, code_stamp, entry, publish_stamp

DEFAULT_PORT = 8430
REQUEST_BACKLOG = 128
THREADS = "threads.txt"
OPEN_FILES = 65536
WARM_WAIT = 30.0
SWITCH_INTERVAL = 0.001
LOOPBACK = re.compile(r"^http://(?:127\.0\.0\.1|localhost)(?::(\d+))?$")


class Handler(BaseHTTPRequestHandler):
    root: Path = Path(".journal")

    def log_message(self, *_):
        pass

    def trusted_origin(self, origin: str) -> bool:
        found = LOOPBACK.match(origin)
        ports = {self.server.server_port, *(urlparse(journal.url).port for journal in known())}
        return bool(found) and int(found.group(1) or 80) in ports

    def sibling(self) -> None:
        origin = self.headers.get("Origin")
        if origin is None or not self.trusted_origin(origin):
            return
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Vary", "Origin")

    def allowed_request(self) -> bool:
        host = self.headers.get("Host")
        port = self.server.server_port
        if host not in (f"127.0.0.1:{port}", f"localhost:{port}"):
            self.send_error(403)
            return False
        origin = self.headers.get("Origin")
        if origin is not None and not self.trusted_origin(origin):
            self.send_error(403)
            return False
        return True

    def handle_one(self, method: str) -> None:
        pulse(self.root, self.server.server_port)
        if not self.allowed_request():
            return
        url = urlparse(self.path)
        if not hook_path(url.path):
            self.answer(method, url)
            return
        with self.server.after_answer.answering_hook():
            self.answer(method, url)

    def answer(self, method: str, url) -> None:
        length = self.headers["Content-Length"]
        kind = self.headers.get("Content-Type") or ""
        if kind.startswith("multipart/"):
            return self.reply_to(self.uploaded(method, url, int(length) if length else 0, kind))
        raw = self.rfile.read(int(length)) if length else b""
        try:
            body = {"_raw": raw, "_type": kind} if kind.startswith("text/plain") else json.loads(raw or b"{}")
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            return self.reply_to(Reply(400, {"error": f"the request body is not JSON: {error}"}))
        self.reply_to(self.answered_as(sender_of(self.headers), method, url, body))

    def uploaded(self, method: str, url, length: int, kind: str) -> Reply:
        """The answer to a file upload, whose body is spooled to disk a chunk at a time and read from there, so a big file is never held whole."""
        if length > UPLOAD_LIMIT:
            self.close_connection = True
            return Reply(413, {"error": f"that upload is {length // (1024 * 1024)} MB, over the {UPLOAD_LIMIT_MB} MB limit for one upload"})
        with spooled(self.rfile, length) as raw:
            return self.answered_as(sender_of(self.headers), method, url, {"_raw": raw, "_type": kind})

    def reply_to(self, reply: Reply) -> None:
        self.send_response(reply.code)
        self.sibling()
        self.send_header("Content-Type", reply.kind)
        if reply.chunks is None:
            data = reply.bytes()
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            self.wfile.flush()
            if reply.after:
                self.server.after_answer.add(reply.after, reply.after_lane)
            return
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        if reply.after:
            reply.after()
        try:
            for chunk in reply.chunks:
                self.wfile.write(chunk)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            reply.chunks.close()

    def answered_as(self, sender: Sender | None, method: str, url, body: dict) -> Reply:
        """Answers a request as from the member the login page named on it, who writes as themselves and sees only what is shared with them."""
        sending = SENDER.set(sender)
        try:
            return self.answered(method, url, body)
        finally:
            SENDER.reset(sending)

    def answered(self, method: str, url, body: dict) -> Reply:
        with self.server.collector.serving():
            return self.answered_now(method, url, body)

    def answered_now(self, method: str, url, body: dict) -> Reply:
        if method == "GET" and environmental(url.path):
            self.server.warm.wait(WARM_WAIT)
        query = dict(parse_qsl(url.query))
        within = self.headers.get(PHONE_ENVIRONMENT)
        if within is None:
            return dispatch(method, url.path, self.root, query, body)
        reach = reached_by_phone(self.root, method, url.path, query, body, PhoneVisit(within, self.headers.get(PHONE_UNLOCKED) == "1", self.headers.get(PHONE_MEMBER, OWNER_ID)))
        if reach is not Reach.OPEN:
            return reach.refusal()
        return dispatch(method, url.path, self.root, query, body)

    def do_GET(self):
        self.handle_one("GET")

    def do_POST(self):
        self.handle_one("POST")

    def do_OPTIONS(self):
        if not self.allowed_request():
            return
        self.send_response(204)
        self.sibling()
        self.end_headers()


def tell_threads_on_signal(root: Path) -> None:
    folder = runtime.folder(root)
    folder.mkdir(parents=True, exist_ok=True)
    faulthandler.register(signal.SIGUSR1, file=open(folder / THREADS, "w"), all_threads=True)


def allow_open_files() -> None:
    soft, most = resource.getrlimit(resource.RLIMIT_NOFILE)
    wanted = OPEN_FILES if most == resource.RLIM_INFINITY else min(OPEN_FILES, most)
    resource.setrlimit(resource.RLIMIT_NOFILE, (max(soft, wanted), most))


def environmental(path: str) -> bool:
    found = resolve("GET", path)
    return found is not None and "env" in found[1]


class JournalServer(ThreadingHTTPServer):
    request_queue_size = REQUEST_BACKLOG

    def __init__(self, address, handler):
        super().__init__(address, handler)
        self.warm = threading.Event()
        self.warm.set()
        self.after_answer = AfterAnswer.started()
        self.collector = QuietCollector()


def serve(root: Path, port: int = DEFAULT_PORT) -> ThreadingHTTPServer:
    Handler.root = root
    other = elsewhere(root)
    if other:
        print(f"journal: this journal is already served at {other}", flush=True)
        raise SystemExit(0)
    boot(root)
    announce(root)
    features.FEATURES["plugins"].host(root)
    server = JournalServer(("127.0.0.1", port), Handler)
    remember(root, server.server_address[1])
    heartbeat(root, server.server_address[1])
    return server


WATCH_SECONDS = 1.0
SETTLE_SECONDS = 1.5
DRIFT_SECONDS = 10.0
STOP_SECONDS = 0.2
LATE_STOP = 5.0


def drifted(root: Path) -> bool:
    """Whether the installed build is not the one this server runs, with no upgrade under way."""
    return ZIPPED and (Path(root) / ARCHIVE).resolve().name != CODE.name and not runtime.upgrading(root)


def watch_code(root: Path, package: Path, server: ThreadingHTTPServer, changed: threading.Event) -> None:
    before = code_stamp(package)
    last_change = 0.0
    drifting = 0.0
    while not changed.is_set():
        time.sleep(WATCH_SECONDS)
        now = code_stamp(package)
        publish_stamp(root)
        drifting = (drifting or time.monotonic()) if drifted(root) else 0.0
        if now != before:
            before = now
            last_change = time.monotonic()
        elif last_change and time.monotonic() - last_change >= SETTLE_SECONDS or drifting and time.monotonic() - drifting >= DRIFT_SECONDS:
            runtime.restarting(root).write_text(str(time.time()))
            changed.set()
            server.shutdown()


def watch_stop(root: Path, server: ThreadingHTTPServer, halting: threading.Event, began: float = 0.0) -> None:
    while not halting.is_set():
        time.sleep(STOP_SECONDS)
        if asked(root, began):
            halting.set()
            server.shutdown()


def watch_runtime(root: Path, halting: threading.Event) -> None:
    from controllers.agents import write_pending_rows
    from features.auto_update.pausing import resume_when_done
    while not halting.wait(WATCH_SECONDS):
        runtime.refresh_flags(root)
        watch_marks()
        renew_stamps()
        flush_indexes()
        waits.write_holds()
        write_pending_rows()
        if runtime.hook_failures(root).is_file():
            unanswered(root)
        if spooled(root):
            bus.background("spool", lambda: drain(root))
        runtime.restarting(root).unlink(missing_ok=True)
        resume_when_done(root)


def keep_services(root: Path, halting: threading.Event) -> None:
    """A journal that stays up with no agent, such as one on a server, keeps its services up from here."""
    from controllers.faults import threw
    from engine.record import Record
    from engine.services import Manager, lifeline
    from engine.stop import stays_up
    from features.plugins.services import plugin_services
    if not stays_up(Record(root, default_env(root))):
        return
    alive, _keeping = lifeline()
    manager = Manager(root, alive, sources=(plugin_services,), faulted=lambda where: threw(root, default_env(root), where))
    while not halting.wait(WATCH_SECONDS):
        try:
            manager.tick()
        except Exception:
            threw(root, default_env(root), "the server's services")


def pruned_at_start(root: Path) -> None:
    """Removes the folders of sessions that have been quiet for long, so the first hooks after a start look at fewer of them."""
    from controllers.faults import threw
    from engine.record import Record
    from features import FEATURES
    from features.runtime_cleanup.details import RuntimeCleanupDetails
    from features.runtime_cleanup.tidy import tidy_files
    record = Record(root, default_env(root))
    try:
        if "runtime_cleanup" in FEATURES and FEATURES["runtime_cleanup"].enabled(record):
            tidy_files(root, RuntimeCleanupDetails.values(record).days)
    except Exception:
        threw(root, record.env, "pruning the quiet sessions at the start")


def warm_commands() -> None:
    from commands.cli import served
    from commands.parser import parser
    for noun in sorted(served()):
        parser(noun)


def warm_work(root: Path) -> None:
    """What ending work reads, the work and the to-dos still open, so the first command after a start answers from memory."""
    from controllers.types import Todos, Works
    from engine.record import Record
    from resources.base import SYSTEM
    record = Record(root, default_env(root))
    Works(record, actor=SYSTEM).rows.standing()
    Todos(record, actor=SYSTEM).rows.standing()


def warm_replies(root: Path) -> None:
    """What answering a message reads, the messages and the comments linked to them, so the first reply after a start answers from memory."""
    from controllers.types import Comments, Messages
    from engine.record import Record
    from resources.base import SYSTEM
    record = Record(root, default_env(root))
    Messages(record, actor=SYSTEM).rows.summaries()
    Comments(record, actor=SYSTEM).rows.summaries()


def warm_texts(root: Path) -> None:
    """What a search of the to-dos and the messages reads, each row's text, so the first search after a start does not read every row."""
    from controllers.types import Messages, Todos
    from engine.record import Record
    from resources.base import SYSTEM
    record = Record(root, default_env(root))
    for controller in (Todos, Messages):
        controller(record, actor=SYSTEM)._texts()


def warm_changed(root: Path) -> None:
    from commands.parser import parser
    from features.open_viewer.manifest import manifest
    parser()
    manifest(root)
    warm_dashboard(root, default_env(root))


def warmed(root: Path, warm: threading.Event) -> None:
    try:
        warm_viewer(root, default_env(root), warm)
        warm_commands()
        warm_work(root)
        warm_replies(root)
        warm_texts(root)
        WARMERS.append(lambda: warm_changed(root))
        read_transcripts(root)
    except Exception:
        traceback.print_exc()
        os._exit(1)
    settle_agents(root)
    prune_builds(root)
    gc.freeze()


def mark_first_start(root: Path) -> None:
    try:
        from features.auto_update.new_feature import mark_first_start_seen
        from features.auto_update.routes import CHANGELOG
        mark_first_start_seen(root, CHANGELOG.read_text() if CHANGELOG.is_file() else "")
    except Exception:
        traceback.print_exc()


def prune_builds(root: Path) -> None:
    try:
        from engine.heal import pruned
        pruned(root)
    except Exception:
        traceback.print_exc()


def settle_agents(root: Path) -> None:
    try:
        from engine.handover import after_restore
        from engine.record import Record
        from features.machines.restart import after_restart
        after_restore(root)
        for record in Record.every(root):
            after_restart(record)
    except Exception:
        traceback.print_exc()


def warm_dashboard(root: Path, env: str) -> None:
    from controllers.types import CONTROLLERS
    dispatch("GET", f"/api/{env}/dashboard", root, {"types": ",".join(CONTROLLERS), "completed": "1", "last": "25", "events": "100"}, {})


def warm_viewer(root: Path, env: str, warm: threading.Event) -> None:
    warm_dashboard(root, env)
    warm.set()
    dispatch("GET", f"/api/{env}/family", root, {}, {})
    dispatch("GET", "/api/manifest", root, {}, {})


def run(root: Path, port: int = DEFAULT_PORT) -> None:
    sys.setswitchinterval(SWITCH_INTERVAL)
    DEFER.set()
    runtime.mark_started(root)
    mark_first_start(root)
    runtime.remember_git_user(root)
    tell_threads_on_signal(root)
    allow_open_files()
    server = serve(root, port)
    print(f"http://127.0.0.1:{server.server_address[1]}/", flush=True)
    changed = threading.Event()
    halting = threading.Event()
    server.warm.clear()
    threading.Thread(target=warmed, args=(root, server.warm), daemon=True).start()
    threading.Thread(target=watch_code, args=(root, Path(root) / ARCHIVE if ZIPPED else CODE, server, changed), daemon=True).start()
    threading.Thread(target=watch_stop, args=(root, server, halting, time.time() - LATE_STOP), daemon=True).start()
    threading.Thread(target=watch_runtime, args=(root, halting), daemon=True).start()
    threading.Thread(target=server.collector.run, args=(halting,), daemon=True).start()
    threading.Thread(target=replay, args=(root,), daemon=True).start()
    threading.Thread(target=warm, args=(root,), daemon=True).start()
    threading.Thread(target=pruned_at_start, args=(root,), daemon=True).start()
    threading.Thread(target=keep_services, args=(root, halting), daemon=True).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    if halting.is_set():
        print("journal: stopped", flush=True)
        return
    if changed.is_set():
        print("journal: Python code changed; restarting on the same port", flush=True)
        command = [*entry("journal"), "--root", str(root), "serve", "--port", str(server.server_port)]
        os.execv(sys.executable, command)


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".journal").resolve()
    port = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_PORT
    run(root, port)
