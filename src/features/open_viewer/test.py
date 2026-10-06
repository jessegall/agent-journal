import time

import pytest

from types import SimpleNamespace
from engine.focus import SCRIPT, existing_tab
from controllers.types import Agents
from engine import viewer
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


def test_the_viewer_answers_only_its_own_host_and_reads_only_the_projects_visible_files(tmp_path, monkeypatch):
    import threading
    from types import SimpleNamespace
    import urllib.error
    import urllib.request
    from http.server import ThreadingHTTPServer
    import pytest
    from features.routing import Request
    from commands.http import get_file_diff, get_file_text, get_project_files
    from engine.project_files import read_source, walk
    from resources.base import Refused
    from serve import Handler
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
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
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
    walked, names = project_files.walk(project)
    assert [p.name for p in project_files.project_paths(project)] == [p.name for p in walked] and "guide.txt" in names, "the project is walked once and its files are listed by name"
    assert project_files.walked(project) == (walked, names), "a recent walk is reused"
    project_files.WALKED[str(project)] = (time.time() - project_files.WALK_FOR - 1, walked, names)
    project_files.walked(project)
    assert str(project) in project_files.WALKING, "an old walk is refreshed in the background"
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
    from migrations import applied
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


def test_the_viewer_waits_for_a_busy_port_opens_a_page_only_when_no_tab_has_it_and_lists_the_journals_running(monkeypatch):
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

    probed = []
    monkeypatch.setattr(viewer, "probe", lambda: probed.append("probe"))
    monkeypatch.setattr(viewer, "PROBED", [0.0, ["first"]])
    assert viewer.running_journals() == ["first"] and probed == ["probe"], "the first look probes the ports"
    viewer.PROBED[0] = time.time() - viewer.PROBE_FOR - 1
    viewer.running_journals()
    assert viewer.PROBED[0] > time.time() - 5, "an old list is refreshed in the background"
