import re
import json
import time

import pytest

from pathlib import Path
from types import SimpleNamespace
from engine.focus import SCRIPT, existing_tab
from controllers.types import Agents
from engine import runtime, viewer
from resources.base import SYSTEM
from tests.kit import report
from tests.conftest import fresh


URL = "http://127.0.0.1:8422/"


def recording(calls):
    def run(command, **options):
        calls.append((command, options))
        return SimpleNamespace(returncode=0)
    return run


def test_macos_asks_its_running_browsers_for_the_viewer_tab():
    calls = []
    run = recording(calls)
    assert existing_tab(URL, "darwin", run) is True, "macOS asks its running browsers for the viewer tab"
    assert (calls[0][0][:5], calls[0][0][-2:], calls[0][1]) == \
        (["osascript", "-l", "JavaScript", "-e", SCRIPT], ["--", URL], {"capture_output": True, "timeout": 2}), \
        "the focus script receives the viewer URL"


def test_other_systems_and_a_missing_tab_leave_opening_to_the_normal_path():
    calls = []
    run = recording(calls)
    assert (existing_tab(URL, "linux", run), calls) == (False, []), "other systems leave opening to the normal browser path"
    assert existing_tab(URL, "darwin", lambda *args, **options: SimpleNamespace(returncode=1)) is False, \
        "a missing macOS tab leaves opening to the normal browser path"


def test_a_session_starting_shows_the_viewer_once_a_subagent_never_does(monkeypatch):
    visible = []
    up = {"url": "http://127.0.0.1:8422/"}
    monkeypatch.setattr(viewer, "running", lambda root: up["url"])
    monkeypatch.setattr(viewer, "show", lambda url, env="": visible.append(f"{url}#/{env}"))

    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    report(record, "working", "UserPromptSubmit")
    assert visible == [], "no session start yet: the tab is left alone"

    report(record, "idle", "SessionStart")
    assert visible == [f"http://127.0.0.1:8422/#/{record.env}"], "the session started: its viewer is shown on the session's environment"
    report(record, "idle", "SessionStart")
    report(record, "working", "PreToolUse")
    assert len(visible) == 1, "a second start of the same session, a compaction or a clear, shows nothing more"

    report(record, "idle", "SessionStart", session="claude-2")
    assert len(visible) == 2, "a new session shows the viewer again"

    up["url"] = ""
    report(record, "idle", "SessionStart", session="claude-3")
    up["url"] = "http://127.0.0.1:8424/"
    report(record, "idle", "SessionStart", session="claude-3")
    assert visible[2:] == [f"http://127.0.0.1:8424/#/{record.env}"], "no viewer: nothing; once one runs, the next start shows it"

    Agents(record, actor=SYSTEM).create("child-1", parent="claude-1")
    report(record, "idle", "SessionStart", session="child-1")
    assert len(visible) == 3, "a subagent starting shows nothing"


def test_a_server_of_another_version_is_not_taken_for_this_journals(tmp_path, monkeypatch):
    from engine import viewer
    from engine.version import version
    answered = [viewer.Identity(str(tmp_path), "", "")]
    monkeypatch.setattr(viewer, "identity", lambda url, timeout=0.05: answered[0])
    assert viewer.answers("http://127.0.0.1:8423/", tmp_path) is False, "a server left from an older install is replaced, not reused"
    answered[0] = viewer.Identity(str(tmp_path), "", version())
    assert viewer.answers("http://127.0.0.1:8423/", tmp_path) is True


def test_the_viewer_answers_only_its_own_host_and_reads_only_the_projects_visible_files(tmp_path, monkeypatch, capsys):
    import threading
    from types import SimpleNamespace
    import urllib.error
    import urllib.request
    import pytest
    from features.routing import Request
    from commands.http import get_file_diff, get_file_text, get_project_files
    from engine.project_files import read_source, walk
    from resources.base import Refused
    from serve import Handler, JournalServer
    project, other = tmp_path / "project", tmp_path / "other"
    (project / ".journal").mkdir(parents=True)
    (project / ".private").mkdir()
    (other / ".git").mkdir(parents=True)
    (project / "visible.txt").write_text("visible")
    (project / ".env").write_text("secret")
    (project / ".private" / "note.txt").write_text("private")
    (other / "note.txt").write_text("other")
    (project / "linked.txt").symlink_to(other / "note.txt")
    (project / "tokens.css").write_text("tokens")
    assert (read_source(project, "tokens.css").text, sorted(path.name for path in walk(project)[0])) == ("tokens", ["tokens.css", "visible.txt"]), \
        "visible files are read and listed, a word like tokens in a name included"
    (project / "api_token.json").write_text("secret")
    (project / "credentials").mkdir()
    (project / "credentials" / "prod.json").write_text("secret")
    for asked in (".env", ".private/note.txt", str(other / "note.txt"), "linked.txt", "api_token.json", "credentials/prod.json"):
        with pytest.raises(Refused):
            read_source(project, asked)
    for handler, query in ((get_file_text, {"path": ".env"}), (get_file_diff, {"path": ".env"}), (get_project_files, {"folder": ".journal"}), (get_file_text, {"path": str(other / "note.txt")})):
        with pytest.raises(Refused):
            handler(Request(project / ".journal", {"env": "main"}, query, {}))
    Handler.root = project / ".journal"
    server = JournalServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()

    def status(headers):
        request = urllib.request.Request(f"http://127.0.0.1:{server.server_port}/api/no-such-route", data=b"{}", headers=headers, method="POST")
        try:
            return urllib.request.urlopen(request, timeout=5).status
        except urllib.error.HTTPError as error:
            return error.code

    try:
        assert [status({}), status({"Origin": f"http://localhost:{server.server_port}"}), status({"Host": f"evil.example:{server.server_port}"}),
                status({"Origin": "http://localhost:9999"})] == [404, 404, 403, 403], "its own host and a journal's origin by either loopback name are answered; another host or an unknown origin is refused"
        asked = urllib.request.Request(f"http://127.0.0.1:{server.server_port}/api/no-such-route", method="OPTIONS")
        assert urllib.request.urlopen(asked, timeout=5).status == 204, "a browser's preflight question from its own address is answered without a body"
        foreign = urllib.request.Request(f"http://127.0.0.1:{server.server_port}/api/x", method="OPTIONS", headers={"Host": f"evil.example:{server.server_port}"})
        with pytest.raises(urllib.error.HTTPError) as refused:
            urllib.request.urlopen(foreign, timeout=5)
        assert refused.value.code == 403, "a preflight from another host is refused"
    finally:
        server.shutdown()
        server.server_close()

    from engine import project_files
    from resources.base import Missing
    (project / "docs").mkdir()
    (project / "docs" / "guide.txt").write_text("one")
    (project / "docs" / "twin.txt").write_text("a")
    (project / "docs" / "sub").mkdir()
    (project / "docs" / "sub" / "twin.txt").write_text("b")
    (project / "node_modules").mkdir()
    (project / "docs" / ".hidden").write_text("x")
    from dataclasses import replace
    real_walk = project_files.walk
    project_files.WALKED.pop(str(project))

    def held_refresh() -> tuple[list, dict]:
        walking, release, refresher = threading.Event(), threading.Event(), []

        def held_walk(folder):
            refresher.append(threading.current_thread())
            walking.set()
            release.wait()
            return real_walk(folder)
        monkeypatch.setattr(project_files, "walk", held_walk)
        answered = project_files.walked(project)
        walking.wait()
        assert str(project) in project_files.WALKING and project_files.walked(project) == answered and refresher[0] is not threading.current_thread(), \
            "one walk runs in the background while every request answers at once with what is held"
        with pytest.raises(Refused, match="still being listed" if not answered[0] else "no file"):
            project_files.read_source(project, "nothing-here.txt")
        release.set()
        refresher[0].join()
        monkeypatch.setattr(project_files, "walk", real_walk)
        assert len(refresher) == 1, "a walk under way is never started twice"
        return answered
    assert held_refresh() == ([], {}), "a request never walks the project itself: before the first walk it answers with no files"
    walked, names = project_files.walked(project)
    assert [p.name for p in project_files.project_paths(project)] == [p.name for p in walked] and "guide.txt" in names, "the project is walked once and its files are listed by name"
    assert project_files.walked(project) == (walked, names) and str(project) not in project_files.WALKING, "a recent walk is reused"
    project_files.WALKED[str(project)] = replace(project_files.WALKED[str(project)], at=time.time() - project_files.WALK_FOR - 1)
    assert held_refresh() == (walked, names), "an old walk is answered while it is refreshed in the background"
    assert str(project) not in project_files.WALKING and project_files.WALKED[str(project)].at > time.time() - 5, "the refreshed walk is kept and no longer under way"
    slow = replace(project_files.WALKED[str(project)], at=time.time() - project_files.WALK_FOR - 1, took=project_files.WALK_FOR)
    project_files.WALKED[str(project)] = slow
    assert project_files.walked(project) == (slow.paths, slow.by_name) and str(project) not in project_files.WALKING, "a slow walk rests ten times as long as it took before the next"
    limit = project_files.WALK_LIMIT
    monkeypatch.setattr(project_files, "WALK_LIMIT", 1)
    assert len(project_files.walk(project)[0]) < len(walked), "a walk stops at the end of the folder that reaches its limit of files"
    monkeypatch.setattr(project_files, "WALK_LIMIT", limit)
    project_files.walk(project)
    assert project_files.matching(project, "guide.txt") == ["docs/guide.txt"] and project_files.matching(project, "./sub/twin.txt") == ["docs/sub/twin.txt"], \
        "a file is found by its name or by the end of its path"
    assert project_files.read_source(project, "guide.txt").text == "one", "a bare file name is found anywhere in the project"
    for asked, why in (("twin.txt", "2 files in the project are called"), ("nothing-here.txt", "no file"), ("docs", "no file")):
        with pytest.raises(Refused, match=why):
            project_files.read_source(project, asked)
    assert sorted(entry["name"] for entry in project_files.list_folder(project, "docs")) == ["guide.txt", "sub", "twin.txt"], "a folder lists what may be read and no hidden file"
    with pytest.raises(Missing):
        project_files.list_folder(project, "nowhere")

    import serve
    stamps, clock, ended = iter(["same", "same", "edited", "edited", "edited", "edited"]), iter(range(1, 100)), []
    serving = SimpleNamespace(shutdown=lambda: ended.append("stopped"))
    changed = threading.Event()
    serve.runtime.restarting(project / ".journal").parent.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(serve, "code_stamp", lambda package: next(stamps))
    monkeypatch.setattr(serve, "time", SimpleNamespace(sleep=lambda seconds: None, monotonic=lambda: float(next(clock)), time=lambda: 0.0))
    serve.watch_code(project / ".journal", project, serving, changed)
    assert (changed.is_set(), ended, serve.runtime.restarting(project / ".journal").exists()) == (True, ["stopped"], True), \
        "once the code has stopped changing for a moment the server notes a restart and stops"
    halting = threading.Event()
    monkeypatch.setattr(serve, "asked", lambda root, began: True)
    serve.watch_stop(project / ".journal", serving, halting)
    assert halting.is_set() and ended[-1] == "stopped", "a stop asked for from outside halts the server"
    import engine.services
    import engine.stop
    monkeypatch.setattr(engine.stop, "stays_up", lambda record: True)
    monkeypatch.setattr(serve, "WATCH_SECONDS", 0)
    beats, staying = [], threading.Event()

    class ServiceBroke(Exception):
        pass

    class RestoreBroke(Exception):
        pass

    def tick(manager):
        beats.append(len(beats))
        if len(beats) == 1:
            raise ServiceBroke()
        staying.set()
    monkeypatch.setattr(engine.services.Manager, "tick", tick)
    serve.keep_services(project / ".journal", staying)
    assert beats == [0, 1], "a server that stays up with no agent keeps its services, and a tick that throws is noted and tried again"
    serve.warm_commands()
    monkeypatch.setattr("engine.handover.after_restore", lambda root: (_ for _ in ()).throw(RestoreBroke()))
    serve.settle_agents(project / ".journal")
    assert "RestoreBroke" in capsys.readouterr().err, "a failure while settling agents after a restore is printed, never raised into the server"


def test_commit_and_diff_routes_only_show_visible_literal_files(tmp_path):
    import subprocess
    import pytest
    from features.routing import Request
    from commands.http import get_commit, get_file_diff
    from resources.base import Refused
    project = tmp_path / "project"
    (project / ".journal").mkdir(parents=True)
    (project / "credentials").mkdir()
    (project / ".env").write_text("hidden secret")
    (project / "credentials" / "prod.json").write_text("folder secret")
    (project / "star*.txt").write_text("visible star")
    (project / "star-other.txt").write_text("other visible")
    def run(*args):
        return subprocess.run(["git", *args], cwd=project, check=True, capture_output=True, text=True).stdout.strip()
    run("init", "-q")
    run("add", ".env", "credentials/prod.json", "star*.txt", "star-other.txt")
    run("-c", "user.name=Example", "-c", "user.email=example@example.com", "commit", "-qm", "seed")
    sha = run("rev-parse", "HEAD")
    body = get_commit(Request(project / ".journal", {"env": "main", "sha": sha}, {}, {})).body
    assert "visible star" in body["diff"] and "hidden secret" not in body["diff"] and "folder secret" not in body["diff"]
    assert ".env" not in body["stat"] and "credentials/prod.json" not in body["stat"]
    (project / "star*.txt").write_text("changed star")
    (project / "star-other.txt").write_text("changed other")
    diff = get_file_diff(Request(project / ".journal", {"env": "main"}, {"path": "star*.txt"}, {})).body["diff"]
    assert "changed star" in diff and "changed other" not in diff
    for path in (".", "credentials", ".env", "credentials/prod.json"):
        with pytest.raises(Refused):
            get_file_diff(Request(project / ".journal", {"env": "main"}, {"path": path}, {}))


def test_every_request_stays_inside_its_journal(tmp_path, monkeypatch):
    import pytest
    from commands.dispatch import static
    from features.routing import Request
    from controllers.types import Environments, Todos
    from engine.record import Record
    from engine.ledger import applied
    from resources.base import Refused, USER
    for name in (".", "..", "../other", "nested/name", "nested\\name"):
        with pytest.raises(Refused):
            Record(tmp_path, name)
    with pytest.raises(Refused):
        static("/../outside")
    record = fresh()
    environments = Environments(record, actor=USER)
    with pytest.raises(Refused):
        environments.update(environments.create("Safe name").n, title="../outside")
    request = Request(record.root, {"env": record.env, "type": "todo"}, {}, {"actor": "system"})
    assert (request.controller().actor, "actor" in request.body) == (USER, False), "the body never chooses the actor"
    shipped = Todos(record, actor=SYSTEM).create("Shipped row", system=True)
    todos = Todos(record, actor=USER)
    for refused in (lambda: todos.stamp(shipped.n, changed=True), lambda: todos.move(shipped.n, "another")):
        with pytest.raises(Refused):
            refused()
    source = tmp_path / "attachment.txt"
    source.write_text("content")
    row = todos.create("A row")
    monkeypatch.setattr(todos, "save", lambda *args, **kwargs: (_ for _ in ()).throw(Refused("cannot save")))
    with pytest.raises(Refused):
        todos.attach(row.n, str(source))
    assert not (todos.folder(row.n) / source.name).exists(), "a refused save leaves no attachment behind"
    (tmp_path / "migrations.json").write_text("not json")
    with pytest.raises(Refused):
        applied(tmp_path)


def test_running_out_of_viewer_ports_is_refused_in_words_with_the_hooks_put_back(tmp_path, monkeypatch):
    import json
    from commands.launch import launch
    from providers import DRIVERS
    from features.clean_slate.slate import moved
    from tests.conftest import refused
    import commands.launch
    import commands.launch_update
    monkeypatch.setattr(commands.launch, "started", lambda *a, **k: pytest.fail("the launch went on to start the agent"))
    monkeypatch.setattr(commands.launch_update, "latest_first", lambda record: "")
    monkeypatch.setattr(viewer, "PORTS", [59990, 59991])
    monkeypatch.setattr(viewer, "free", lambda port: False)
    assert "no viewer port is free" in refused(lambda: viewer.available(fresh().root)), "a plain line, not a traceback"
    record = fresh()
    project = record.root.parent
    (project / ".claude").mkdir()
    hooks = project / ".claude" / "settings.local.json"
    hooks.write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "keep-going.sh"}]}]}}))
    before = hooks.read_text()
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.chdir(project)
    monkeypatch.setattr(DRIVERS["claude"], "binary", classmethod(lambda cls, path: "claude"))
    assert "no viewer port is free" in refused(lambda: launch(record, "claude", ["--no-interaction"]))
    assert moved(record) == [] and hooks.read_text() == before, "nothing stays set aside"


def test_the_viewer_waits_for_a_busy_port_opens_a_page_only_when_no_tab_has_it_and_lists_the_journals_running(tmp_path, monkeypatch, capsys):
    import socket
    held = socket.socket()
    held.bind(("127.0.0.1", 0))
    held.listen()
    assert viewer.waited(held.getsockname()[1], 0.3) is False, "a port that stays busy is given up on after the wait"
    held.close()
    free_port = socket.socket()
    free_port.bind(("127.0.0.1", 0))
    unused = free_port.getsockname()[1]
    free_port.close()
    assert viewer.waited(unused, 0.3) is True, "a free port is answered at once"

    opened, focused = [], []
    assert viewer.show("http://x/", "dev", opener=opened.append, focuser=lambda url: focused.append(url) or False) == "http://x/#/dev" and opened == ["http://x/#/dev"], \
        "a page is opened when no tab has it"
    assert viewer.show("http://x/", opener=opened.append, focuser=lambda url: True) == "http://x/" and opened == ["http://x/#/dev"], "a tab that already has it is brought forward instead"
    assert viewer.show("", "dev", opener=opened.append, focuser=lambda url: True) == "" and opened == ["http://x/#/dev"], "nothing is opened with no address"

    monkeypatch.setenv("AGENT_JOURNAL_HOME", str(tmp_path))
    kept = tmp_path / "kept" / ".journal"
    kept.mkdir(parents=True)
    viewer.keep([viewer.KnownJournal(str(kept), "kept", "http://127.0.0.1:1/", 2.0), viewer.KnownJournal(str(tmp_path / "gone" / ".journal"), "gone", "http://127.0.0.1:2/", 1.0)])
    assert [j.project for j in viewer.known()] == ["kept"], "a journal whose folder is gone is no longer listed"

    probed = []
    monkeypatch.setattr(viewer, "probe", lambda: probed.append("probe"))
    monkeypatch.setattr(viewer, "PROBED", [0.0, ["first"]])
    assert viewer.running_journals() == ["first"] and probed == ["probe"], "the first look probes the ports"
    viewer.PROBED[0] = time.time() - viewer.PROBE_FOR - 1
    viewer.running_journals()
    assert viewer.PROBED[0] > time.time() - 5, "an old list is refreshed in the background"

    monkeypatch.setattr(viewer, "other_journal_on", lambda port, root: False)
    monkeypatch.setattr(viewer, "waited", lambda port, seconds: False)
    monkeypatch.setattr(viewer, "free", lambda port: port != viewer.PORTS[0])
    assert viewer.available(kept, viewer.PORTS[0]) == viewer.PORTS[1] and "is still taken after" in capsys.readouterr().err, \
        "a port that stays taken is left for the next free one, and the move is said"
    viewer.remember(kept, viewer.PORTS[0])
    assert (viewer.wait_for(kept, viewer.PORTS[0]), viewer.wait_for(kept, viewer.PORTS[1])) == (viewer.OWN_PORT_WAIT, viewer.PORT_WAIT), \
        "a journal whose own server still holds its port waits for it to leave, and waits the usual time for any other port"
    monkeypatch.setattr(viewer, "alive", lambda pid: False)
    assert viewer.wait_for(kept, viewer.PORTS[0]) == viewer.PORT_WAIT, "and when that server is gone the port is waited for only the usual time"
    import shutil
    shutil.rmtree(viewer.marker(kept).parent)
    import serve
    monkeypatch.setattr("commands.parser.parser", lambda *given: None)
    monkeypatch.setattr("features.open_viewer.manifest.manifest", lambda root: None)
    asked = []
    monkeypatch.setattr(serve, "dispatch", lambda method, path, *given: asked.append(path))
    serve.warm_changed(kept)
    assert asked == ["/api/main/dashboard"], "what a setting change cleared is warmed in the background, the dashboard's rows included, so no request pays for rebuilding them"
    from engine.record import Record
    from engine.runtime import env as runtime_env
    assert viewer.configured(kept) == 0, "a journal that has set no port of its own has none configured"
    Record(kept, runtime_env(kept)).change_setting("viewer", {"port": viewer.PORTS[2]})
    assert viewer.configured(kept) == viewer.PORTS[2], "the port a project sets for its viewer is the one it is configured for"
    Record(kept, runtime_env(kept)).change_setting("viewer", {"port": 80})
    assert viewer.configured(kept) == 0, "a port outside the viewer ports is ignored"
    Record(kept, runtime_env(kept)).change_setting("viewer", {"port": viewer.PORTS[2]})
    asked = []
    monkeypatch.setattr(viewer, "running", lambda root: "")
    monkeypatch.setattr(viewer, "elsewhere", lambda root: "")
    monkeypatch.setattr(viewer, "available", lambda root, prefer: asked.append(prefer) or (_ for _ in ()).throw(RuntimeError("stop")))
    with pytest.raises(RuntimeError, match="stop"):
        viewer.launch(kept, kept.parent)
    assert asked == [viewer.PORTS[2]], "a launch asks for the configured port, not for the one it last served on"
    shutil.rmtree(viewer.marker(kept).parent)
    monkeypatch.setattr(viewer, "running", lambda root: "")
    assert viewer.answered(kept, SimpleNamespace(poll=lambda: 3, returncode=3)) == ("", 3), "a server that ends before it answers hands back its exit code"

    class Answer:
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *raised):
            return False
    monkeypatch.setattr(viewer, "urlopen", lambda url, timeout: Answer())
    assert viewer.healthy("http://x/", "main"), "a server that answers its health check is healthy"
    monkeypatch.setattr(viewer, "urlopen", lambda url, timeout: (_ for _ in ()).throw(OSError("refused")))
    assert not viewer.healthy("http://x/", "main"), "one that cannot be reached is not"
    monkeypatch.setattr(viewer, "running", lambda root: "http://x/")
    monkeypatch.setattr(viewer, "healthy", lambda url, env: True)
    watch = viewer.StuckServer(kept, "main")
    watch.missed = 2
    assert (watch.restarted(), watch.missed) == ("", 0), "a server that answers again starts its count of missed checks over"
    (kept / "runtime").mkdir()
    (kept / "runtime" / viewer.STUCK_THREADS).write_text("Thread 0x1: waiting on the record lock")
    signals = []
    monkeypatch.setattr(viewer, "os", SimpleNamespace(kill=lambda pid, number: signals.append(number)))
    monkeypatch.setattr(viewer, "time", SimpleNamespace(time=time.time, sleep=lambda seconds: None))
    monkeypatch.setattr(viewer, "STOP_WAIT", 0)
    monkeypatch.setattr(viewer, "alive", lambda pid: True)
    kept_threads = watch.restart(4242)
    assert signals == [viewer.signal.SIGUSR1, viewer.signal.SIGTERM, viewer.signal.SIGKILL] and "the record lock" in Path(kept_threads).read_text(), \
        "a stuck server is asked for its threads, which are kept, then stopped, and killed when it will not stop"


def test_the_viewer_reads_and_changes_its_settings_hooks_services_files_and_identity(tmp_path, monkeypatch):
    from commands.http import dispatch
    from controllers.types import Todos
    from resources.base import USER
    record = fresh()
    import os
    import socket
    import stat
    import threading
    from commands import http
    from serve import Handler, JournalServer
    monkeypatch.setattr(http, "STREAM_BEAT", 0.05)
    monkeypatch.setattr(Handler, "root", record.root)
    server = JournalServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    hook = json.dumps({"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}})
    asked = {"stream": f"GET /api/{record.env}/stream HTTP/1.1\r\nHost: 127.0.0.1:{server.server_port}\r\n\r\n",
             "hook": f"POST /api/hook/claude?root={record.root}&env={record.env}&pid=0 HTTP/1.1\r\nHost: 127.0.0.1:{server.server_port}\r\n"
                     f"Content-Type: application/json\r\nContent-Length: {len(hook)}\r\n\r\n{hook}"}
    def sockets() -> int:
        return sum(1 for fd in os.listdir("/dev/fd") if is_socket(int(fd)))

    def is_socket(fd: int) -> bool:
        try:
            return stat.S_ISSOCK(os.fstat(fd).st_mode)
        except OSError:
            return False
    try:
        open_before = sockets()
        for _ in range(5):
            for request in asked.values():
                with socket.create_connection(("127.0.0.1", server.server_port), timeout=5) as dropped:
                    dropped.sendall(request.encode())
                    dropped.recv(64)
        waited = time.monotonic() + 5
        while sockets() > open_before and time.monotonic() < waited:
            time.sleep(0.05)
        assert sockets() <= open_before, "every connection a viewer or a hook drops is closed by the server, a live stream included"
    finally:
        server.shutdown()
        server.server_close()
    ask = lambda method, path, query=None, body=None: dispatch(method, path, record.root, query or {}, body or {})
    assert ask("GET", f"/api/{record.env}/settings").code == 200 and ask("POST", f"/api/{record.env}/settings", body={"ask_questions": {"hold": 1}}).code == 200, \
        "the settings are read and written through the viewer"
    from controllers.invoke import invoked
    from controllers.types import Environments, Features
    from resources.base import AGENT, Refused
    assert invoked(Features(record, actor=AGENT), "settings") == ask("GET", f"/api/{record.env}/settings").body, "the viewer reads its settings through the command the CLI runs"
    assert invoked(Environments(record, actor=AGENT), "events") == ask("GET", f"/api/{record.env}/events").body, "and its events"
    with pytest.raises(Refused, match="only the user"):
        invoked(Features(record, actor=AGENT), "save", named={"values": {"viewer": {"theme": "light"}}})
    assert ask("POST", "/api/identity", body={"color": "not-a-colour"}).code == 400, "an identity colour that is no colour is refused"
    named = ask("POST", "/api/identity", body={"color": "#aa3355"}).body
    assert named["root"] == str(record.root) and ask("GET", "/api/identity").body["root"] == str(record.root), "the identity names the root it serves"
    assert ask("GET", f"/api/{record.env}/health").body == {"locks": "taken"}, "the health check answers once it could take the record's locks"
    from controllers.types import Messages
    pictures = [tmp_path / "pixel.png", tmp_path / "other.png"]
    notes = tmp_path / "notes.txt"
    for path in (*pictures, notes):
        path.write_bytes(b"x")
    carrier = Messages(record, actor=USER).create("with files")
    for path in (*pictures, notes):
        Messages(record, actor=USER).attach(carrier.n, str(path), f"the {path.name}")
    files = lambda **asked: ask("GET", f"/api/{record.env}/files/page", {k: str(v) for k, v in asked.items()}).body
    first, rest = files(kind="images", last=1), files(kind="images", last=1, skip=1)
    assert ([len(first["files"]), first["more"], len(rest["files"]), rest["more"]], first["counts"]["images"], files(kind="other")["found"], files(search="notes")["found"]) == ([1, True, 1, False], 2, 1, 1), \
        "the Files page asks the server for one page of one kind of files at a time, filtered and searched there, with the counts of the whole set"
    http.unanswered(record.root)
    assert not runtime.hook_failures(record.root).exists(), "with no hook failures logged there is nothing to report"
    from features.open_viewer.manifest import built
    assert re.fullmatch(r"main-[\w-]+\.js", built()), "the manifest names the bundle the page loads, whatever the bundle is called, so an open tab sees a new build and reloads"
    started = runtime.STARTED[0] = time.time()
    told: list = []
    monkeypatch.setattr(http, "broke", lambda _, text, **__: told.append(text))
    runtime.hook_failures(record.root).write_text(f"{started - 3} 000 claude {record.env}\n{started + 3} 000 claude {record.env}\n")
    http.unanswered(record.root)
    assert not told, "a hook that got no answer while the server restarted, warm-up included, is not reported"
    runtime.hook_failures(record.root).write_text(f"{started + 100} 000 claude {record.env} 500.0\n")
    http.unanswered(record.root)
    assert told and "machine load 500.0" in told[-1], "a hook that got no answer is reported whatever the load, with the load beside it"
    told.clear()
    import serve
    import threading
    from commands.parser import PARSERS
    PARSERS.clear()
    serve.warm_viewer(record.root, record.env, threading.Event())
    assert not [key for key in PARSERS if key[0] == ""], "the warm-up leaves the parser of every command to the first help that asks for it"
    runtime.restarting(record.root).write_text(str(started - 60))
    waits = iter([False, True])
    serve.watch_runtime(record.root, SimpleNamespace(wait=lambda _: next(waits)))
    assert not runtime.restarting(record.root).exists(), "once the new server answers, the restart marker is taken away, so a later crash is told"
    started = runtime.STARTED[0]
    runtime.hook_failures(record.root).write_text(f"{started - http.RESTART_GRACE - 5} 000 claude {record.env}\n")
    http.unanswered(record.root)
    assert told, "after a crash, with no marker, a failure from before the new server's grace is reported"
    told.clear()
    runtime.hook_failures(record.root).write_text(f"{started + http.RESTART_GRACE + 5} 000 claude {record.env}\n")
    http.unanswered(record.root)
    assert told, "a hook with no answer long after the server was up is reported"
    assert ask("GET", "/api/agent-hooks/nobody").code == 404, "hooks of a provider that does not exist are not found"
    wired = ask("GET", "/api/agent-hooks/claude").body
    assert {"path", "hooks", "elsewhere"} <= set(wired), "a provider's hooks come with the file that holds them"
    assert ask("POST", "/api/agent-hooks/claude", body={"hooks": {}}).code == 200, "the hooks can be set again from the viewer"
    assert ask("GET", "/api/extension").code == 200 and ask("GET", "/extension.zip").code in (200, 404), "the browser extension is offered when it is in the package"
    from surfaces import package
    monkeypatch.setattr(package, "HERE", tmp_path / "no-extension")
    assert (package.info(), package.archive()) == ({"available": False, "store": ""}, b""), "with no extension in the package there is none to offer, and nothing to download"
    monkeypatch.undo()
    assert ask("POST", f"/api/{record.env}/settings", body={"viewer": {"theme": "dark"}}).code == 200, "a viewer preference is merged into the ones kept"
    assert ask("GET", f"/api/{record.env}/settings").body["viewer"]["theme"] == "dark", "and read back"
    assert ask("POST", f"/api/{record.env}/settings", body={"boards": {}}).code == 200, "boards can be set from the viewer too"
    assert ask("POST", "/api/services/sharing.server", body={"want": "sideways"}).code == 404, "a service is only asked to be up, down or restart"
    assert [ask("POST", "/api/services/sharing.server", body={"want": want}).code for want in ("up", "down", "restart")] == [200, 200, 200], "a service is asked to run, stop and restart"
    assert ask("GET", "/api/services/sharing.server/log").body["id"] == "sharing.server", "a service's log is read by its id"
    assert ask("GET", "/api/journals").code == 200, "the journals this machine knows are listed"
    assert ask("GET", f"/api/{record.env}/search", {"q": ""}).body == {"hits": [], "more": 0}, "a search for nothing finds nothing"
    row = Todos(record, actor=USER).create("a row with a file", brief="the brief")
    sent = b"--b\r\nContent-Disposition: form-data; name=f; filename=notes.txt\r\n\r\nhello\r\n--b\r\nContent-Disposition: form-data; name=x\r\n\r\nskipped\r\n--b--\r\n"
    uploaded = ask("POST", f"/api/{record.env}/todo/{row.n}/upload", body={"_type": "multipart/form-data; boundary=b", "_raw": sent})
    assert uploaded.body == {"files": ["notes.txt"]}, "a file sent from the viewer is attached to the row, and a field with no file is left out"
    from io import BytesIO
    from engine.multipart import spooled, uploads
    with spooled(BytesIO(sent), len(sent)) as spool:
        assert [(u.name, bytes(u.data)) for u in uploads("multipart/form-data; boundary=b", spool)] == [("notes.txt", b"hello")], "a body spooled to disk and read from there carries the same file"
    fetched = ask("GET", f"/api/{record.env}/todo/{row.n}/files/notes.txt")
    assert (fetched.code, fetched.body) == (200, b"hello"), "an attached file comes back as it was sent"
    assert ask("GET", f"/api/{record.env}/todo/{row.n}/files/missing.txt").code == 404, "a file that is not attached is not found"
    assert ask("GET", f"/api/{record.env}/todo/{row.n}/markdown").body.startswith(b"#"), "a row can be read as markdown"
    assert ask("GET", f"/api/{record.env}/todo/{row.n}/choices").code == 200, "a row's field choices are read"
    import features
    import commands.dispatch as dispatching
    from commands.dispatch import dispatch, guarded, later, known_environment
    from commands.http import Reply
    features.load()
    assert dispatch("POST", "/no/such/route/at/all/x/y/z", record.root, {}, {}).code == 404, "an address nothing serves is not found"
    assert dispatch("GET", "/../../etc/passwd", record.root, {}, {}).code == 400, "a path out of the viewer's folder is refused"
    site = tmp_path / "web"
    site.mkdir()
    monkeypatch.setattr(dispatching, "WEB", site)
    assert dispatch("GET", "/anything", record.root, {}, {}).code == 404, "with no build of the viewer there is nothing to show"
    (site / "index.html").write_text("<p>viewer</p>")
    (site / "app.js").write_text("1")
    assert (dispatch("GET", "/app.js", record.root, {}, {}).body, dispatch("GET", "/some/page", record.root, {}, {}).body) == (b"1", b"<p>viewer</p>"), \
        "a file of the build is served as it is and any other page is the viewer itself"
    ran = []
    reply = Reply(200, {}, after=lambda: ran.append("first"))
    later(reply, lambda: ran.append("second"))
    reply.after()
    assert ran == ["first", "second"], "what must follow a reply runs after what the reply already had to do"
    assert known_environment(record.root, record.env) is True and known_environment(record.root, "never-made") is False, "an environment is known by its folder"
    broken = Reply(200, {}, after=lambda: 1 / 0)
    guarded(broken, record.root, record.env, "after GET /x").after()
    assert guarded(Reply(200, {}), record.root, record.env, "x").after is None, "a reply with nothing after it is left as it is"

    import commands.http as http
    from commands.http import dispatch
    from providers import PROVIDERS
    called = []
    monkeypatch.setattr(http, "check_now", lambda root: called.append("check"))
    monkeypatch.setattr("install.upgrade", lambda project, root: called.append("upgrade") or ["upgraded"])
    monkeypatch.setattr("engine.stop.ask", lambda root: called.append("stop"))
    assert [ask("POST", "/api/update/check").body, ask("POST", "/api/upgrade").body, ask("POST", "/api/stop").body] == \
        [{"checking": True}, {"lines": ["upgraded"]}, {"stopping": True}], "the viewer can ask for an update check, an upgrade and a stop"
    assert called == ["check", "upgrade", "stop"], "each of them reaches the machine once"
    assert "every block needs a list of hooks" in str(ask("POST", "/api/agent-hooks/claude", body={"hooks": {"PreToolUse": [{"hooks": [{"command": " "}]}]}}).body), \
        "hooks a provider cannot take are refused in its words"
    claude = PROVIDERS["claude"]()
    bare = record.root.parent / "bare-project"
    (bare / ".claude").mkdir(parents=True)
    assert claude.wiring_trouble(bare) == "no journal hook is wired", "a project with no journal hook is told so"
    (bare / "hook.sh").write_text("")
    claude.set_hooks(bare, {"Stop": [{"hooks": [{"type": "command", "command": f"sh {bare}/hook.sh claude {bare}/.journal-gone"}]}]})
    assert claude.wiring_trouble(bare).endswith("which does not exist"), "a hook that names a journal that is gone is told so"
    (bare / ".claude" / "settings.json").write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "other"}]}]}}))
    assert [found["path"] for found in claude.hooks_elsewhere(bare)] == [".claude/settings.json"], "hooks kept in another settings file of the project are listed with where they are"
    from features.open_viewer import commands as viewer_commands
    monkeypatch.setattr(viewer_commands, "terminal_of", lambda root, session: "term-1" if session == "claude-1" else "")
    monkeypatch.setattr(viewer_commands.typist, "send", lambda root, terminal, keys: terminal == "term-1" and keys == b"hi")
    monkeypatch.setattr(viewer_commands, "relaunch", lambda root, env, session: {"relaunched": session})
    monkeypatch.setattr(viewer_commands, "set_skipped", lambda row, skip: called.append(skip))
    assert ask("POST", f"/api/{record.env}/agent/claude-1/keys", body={"text": "hi"}).body == {"sent": True}, "keys typed in the viewer reach the agent's terminal"
    assert ask("POST", f"/api/{record.env}/agent/nobody/keys", body={"text": "hi"}).code == 404, "an agent with no terminal is not found"
    assert ask("POST", f"/api/{record.env}/agent/claude-1/relaunch", body={"skip": 1}).body == {"relaunched": "claude-1", "skip": True}, "a relaunch says whether prompts are skipped"
    assert called[-1] is True, "and the choice is kept"
    for word, named in (("appoint", {"session": "claude-1"}), ("shell", {"session": "claude-1", "command": "ls"}), ("keys", {"session": "claude-1", "text": "hi"}),
                        ("relaunch", {"session": "claude-1"}), ("force", {"session": "claude-1"}), ("pause", {"session": "claude-1"}),
                        ("resume", {"session": "claude-1"}), ("control", {"session": "claude-1", "action": "model"}), ("wire", {"provider": "claude", "hooks": {}})):
        with pytest.raises(Refused, match="only the user"):
            invoked(Agents(record, actor=AGENT), word, named=named)
    assert invoked(Agents(record, actor=AGENT), "hooks", named={"provider": "claude"}) == ask("GET", "/api/agent-hooks/claude").body, "an agent reads the hooks the viewer shows"
    chunk = {"hook_event_name": "MessageDisplay", "session_id": "claude-1", "message_id": "m1", "delta": "hi", "final": True}
    monkeypatch.setattr(http, "displayed", lambda root, chunk: called.append(chunk.message))
    refused = ask("POST", "/api/hook/claude", {"root": str(record.root.parent / "elsewhere")}, chunk)
    assert refused.code == 409, "a hook that names another journal's root is turned away"
    reply = ask("POST", "/api/hook/claude", {"root": str(record.root)}, chunk)
    reply.after()
    assert called[-1] == "m1", "a chunk of the agent's words on display is mirrored into the chat after the reply"
    elsewhere = tmp_path / "other-journal"
    elsewhere.mkdir()
    monkeypatch.setattr(viewer, "known", lambda: [viewer.KnownJournal(root=str(elsewhere), project="other", at=1.0), viewer.KnownJournal(root=str(tmp_path / "gone"), project="gone")])
    listed = ask("GET", "/api/journals").body
    assert [(j["project"], j["running"]) for j in listed if j["root"] == str(elsewhere)] == [("other", False)], "a journal that is not running is listed as stopped"
    assert all(j["project"] != "gone" for j in listed), "one whose folder is gone is not listed"
    from controllers.types import Environments
    from features.starting_agents import launch
    Environments(record, actor=SYSTEM).create("main")
    launched = []
    monkeypatch.setattr(launch, "detached", lambda root, cwd, env, agent, args, conversation="": launched.append((env, agent)))
    assert ask("POST", "/api/journals/start", None, {"root": str(record.root.resolve()), "agent": "codex"}).code == 200
    assert launched == [("main", "codex")], "the hub starts a stopped journal's agent in its main environment, as the phone does"
    assert ask("POST", "/api/journals/start", None, {"root": str(tmp_path / "nowhere")}).code == 400, "a journal this machine does not hold is refused"
    monkeypatch.setattr(http, "found_files", lambda project, asked: [SimpleNamespace(path="../outside.txt", name="x"), SimpleNamespace(path="inside.txt", name="y")])
    monkeypatch.setattr(http, "project_path", lambda project, path: (_ for _ in ()).throw(http.Refused("outside")) if path.startswith("..") else path)
    monkeypatch.setattr(http, "asdict", lambda found: {"path": found.path})
    assert ask("GET", f"/api/{record.env}/project-files/find", {"q": "x"}).body == [{"path": "inside.txt"}], "a found file outside the project is left out of the answer"
    project = record.root.parent
    for folder in ("a", "b"):
        (project / folder).mkdir(exist_ok=True)
        (project / folder / "twin.txt").write_text(folder)
    from engine.project_files import walk
    walk(project.resolve())
    assert ask("GET", f"/api/{record.env}/file", {"path": "twin.txt"}).body == {"matches": ["a/twin.txt", "b/twin.txt"]}, "a name that fits two files offers both"

    class Quiet(http.Queue):
        def get(self, block=True, timeout=None):
            raise http.Empty

    monkeypatch.setattr(http, "Queue", Quiet)
    stream = ask("GET", f"/api/{record.env}/stream").chunks
    assert [next(stream), next(stream)] == [b": open\n\n", b"event: beat\ndata: keep\n\n"], "a stream says it is open, and beats while nothing happens, so the viewer can tell it is alive"
    stream.close()
