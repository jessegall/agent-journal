
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


def test_a_session_starting_shows_the_viewer_once_a_subagent_never_does():
    visible = []
    up = {"url": "http://127.0.0.1:8422/"}
    viewer.running = lambda root: up["url"]
    viewer.show = lambda url, env="": visible.append(f"{url}#/{env}")

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


def test_the_viewer_answers_only_its_own_host_and_reads_only_the_projects_visible_files(tmp_path):
    import threading
    import urllib.error
    import urllib.request
    from http.server import ThreadingHTTPServer
    import pytest
    from commands.dispatch import Request
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
    for asked in (".env", ".private/note.txt", str(other / "note.txt"), "linked.txt", "api_token.json"):
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
    finally:
        server.shutdown()
        server.server_close()


def test_every_request_stays_inside_its_journal(tmp_path, monkeypatch):
    import pytest
    from commands.dispatch import Request, static
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
