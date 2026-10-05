import inspect
import json
import re
import subprocess
import time
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

import features
from commands.dispatch import resolve
from commands.http import dispatch
from commands.invoke import spread
from controllers.base import actions
from controllers.types import CONTROLLERS
from resources.base import AGENT, Refused, SYSTEM, USER
from resources.types import TYPES
from tests.conftest import fresh, refused

VIEWER = Path(__file__).resolve().parents[1] / "src" / "web" / "src"
RECORDER = Path(__file__).with_name("viewer_calls.mjs")
UNBOUND = ("unexpected keyword argument", "missing a required argument", "positional argument")
BUILT = {"get", "post", "here", "act", "command", "url", "at", "in", "page", "origin", "journal", "pluginUrl", "markdownUrl", "fileUrl",
         "extensionZip", "stream", "layoutFrom"}
REAL = {"checkForUpdate", "update", "upstream", "upgrade", "stop", "tunnelLogin", "tunnelLogout", "updateTunler", "installTunler",
        "tunnelAnswering", "tunnelDomains", "tunnelRelease", "setService", "installPlugin", "upgradePlugin", "previewPlugin",
        "previewUpgrade", "launchAgent", "saveAgentHooks", "relaunchAgent", "runShell", "agentKeys", "runCheck", "connectPhone"}
SESSION, AGENT_N, WALK = "claude-1", 1, "walk-1"
CALLS = {
    "changelog": [], "checkForUpdate": [], "update": [], "manifest": [], "identity": [], "saveIdentity": [{"name": "Walker"}],
    "pages": [], "journals": [], "forgetJournal": ["/nowhere/.journal"], "summary": [], "upstream": [], "upgrade": [], "stop": [],
    "extension": [], "tunnelLogin": [{"endpoint": "tunler.example", "username": "walker", "password": "a password"}],
    "tunnelLogout": [], "tunlerVersion": [], "updateTunler": [], "installTunler": ["tunler.example"], "tunnelAnswering": [],
    "tunnelDomains": [], "tunnelRelease": ["walk.tunler.example"], "connectPhone": [7], "disconnectPhone": [1],
    "shareLayout": ["a layout", {"panels": []}], "services": [], "serviceLog": ["sharing.server"], "setService": ["sharing.server", "up"],
    "pluginDashboard": [1, "main"], "pluginLog": ["works"], "onlineAgents": [], "agentControls": ["claude"], "agentHooks": ["claude"],
    "saveAgentHooks": ["claude", {}], "list": ["todo"], "all": ["todo"], "dashboard": [["todo", "plan"]], "show": ["todo", 1],
    "create": ["todo", {"title": "walked by the viewer"}], "fieldChoices": ["todo", 1], "installPlugin": ["/nowhere/plugin"],
    "upgradePlugin": [1, False], "planTimeline": [1], "hidePreview": ["doc", 1], "revision": [1, 1], "tasks": [AGENT_N],
    "board": [{}], "shift": [1, "Doing", {"why": "walked"}], "cancelWork": [1], "reviseWork": [1, "change one card", WALK],
    "followUpWork": [1, "and one more", WALK], "requestWork": [1, "a new card", WALK], "handWork": [1, "doc:1", "from this doc", WALK],
    "ticketBoard": [1], "dismissQuestion": [1, "not needed"], "moveTicket": [1, "Doing"], "stopTicket": [1], "confirmTicket": [1],
    "updateTicket": [1, {"title": "renamed"}], "deleteTicket": [1, "not needed"], "acceptDependencies": [1], "declineDependencies": [1],
    "buildBoard": [1, "a board", "steer it"], "startBoard": [1], "retryBoard": [1], "archiveBoard": [1], "restoreBoard": [1],
    "addedToBoard": [1, [1]], "markStage": [1, "Done", "done"], "stopShare": [1], "approveShare": [1], "tunnelStatus": [],
    "shareReachable": [1], "shareOpens": ["doc:1"], "questionsLinkedTo": ["todo:1"], "planFromDoc": [1], "keepDoc": [1],
    "runCheck": [1], "setCheck": [1, "every", 5], "closeNotice": [1], "editMessage": [1, "reworded"],
    "stopTask": [AGENT_N, "task-1", "a background run"], "updateComment": [1, "reworded"], "deleteComment": [1], "addToCollection": [1, ["todo:1"]],
    "setStartsOn": [1, "todo.created"], "setSteps": [1, ["one step"]], "pinRule": [1], "configurePlugin": [1, "key", "value"],
    "clearPluginLog": [1], "removeEnvironment": [1, False], "sweepEnvironment": [1, False], "readAll": ["todo", [1]],
    "upload": ["todo", 1, {"file": "walked.txt"}], "events": [], "recentEvents": [10], "settings": [], "saveSettings": [{}],
    "saveMode": ["solo"], "search": ["walked"], "files": [], "changes": [], "commit": ["HEAD"], "projectFile": ["README.md"],
    "fileDiff": ["README.md"], "previewPlugin": ["/nowhere/plugin"], "previewUpgrade": [1], "findFiles": ["read"], "projectFiles": [],
    "bar": [], "agents": [5], "launchAgent": [1, "claude"], "stopAgentIn": [1], "appoint": [SESSION],
    "controlAgent": [SESSION, "model", "opus"], "forceAgent": [SESSION], "pauseAgent": [SESSION], "resumeAgent": [SESSION],
    "permitAgent": [SESSION, True], "ticketTodos": [], "organization": [], "family": [], "agentScreen": [SESSION, 0],
    "agentKeys": [SESSION, "hello"], "runShell": [SESSION, "true"], "relaunchAgent": [SESSION, False],
    "transcript": [AGENT_N, SESSION, ""], "agentLinks": [AGENT_N, SESSION], "edits": [AGENT_N, 0, 25], "olderEdits": [AGENT_N, 0, 25],
    "editedFile": [AGENT_N, "c-1", "after"], "terminal": [AGENT_N, "commands"], "skills": [], "skill": ["journal"],
    "loadSkill": ["journal"], "alwaysSkill": ["journal", True], "skillKeywords": ["journal", "walk, walked"],
    "report": [{"kind": "threw", "message": "walked", "where": "/", "stack": ""}], "diagnostics": [], "clearDiagnostics": [],
}

WORLD = ("run", "install", "uninstall", "upgrade", "services", "archive_file", "pickup", "unarchive", "ask", "launch")
SAID = {"title": "a row worth keeping", "text": "a line of words", "body": "the body", "why": "it stopped being true",
        "how": "it landed", "name": "a name", "term": "row", "description": "what it is", "awaiting": "the build", "word": "done",
        "question": "which way", "part": "their words", "became": "todo:1", "value": "high", "face": "\U0001f44d",
        "env": "main", "kind": "note", "ref": "todo:1", "tags": "one two", "abstract": "one line",
        "brief": "why, and where to start", "outcome": "done", "message": "a log line", "actor": USER,
        "to": "agent-1", "by": 1, "how_": "it landed", "action": "create", "type": "todo", "session": "s-1"}
def needed(type_: str) -> dict:
    return {name: "a word" for name in TYPES[type_].required}


COUNTED = ("n", "m", "p", "waits", "doc", "plan", "on", "days", "last", "back", "page")


def given(controller, parameter: inspect.Parameter, row):
    text = str(parameter.annotation)
    if text.startswith("list"):
        return [row.n] if "int" in text else ["a word"]
    if parameter.name in COUNTED:
        return row.n if parameter.name in ("n", "m", "waits", "doc", "plan") else 1
    if parameter.name in SAID:
        return SAID[parameter.name]
    if text.endswith("int"):
        return 1
    if text.endswith("bool"):
        return False
    return "a word"


def call(controller, name, row):
    fn = controller.action(controller.resource.command_names.get(name, name))
    parameters = [p for p in inspect.signature(fn).parameters.values() if p.name != "self"]
    args = [given(controller, p, row) for p in parameters
            if p.kind in (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD) and p.default is p.empty]
    return fn(*args)


def test_every_action_of_every_resource_runs_or_refuses_in_words():
    features.load()
    broke = []
    for type_ in TYPES:
        record = fresh(type_[:2])
        controller = CONTROLLERS[type_](record, actor=SYSTEM)
        row = controller.create(f"a {type_} to work on", abstract="one line", brief="why it is here", **needed(type_))
        for name in actions(CONTROLLERS[type_]):
            if name in WORLD:
                continue
            try:
                call(controller, name, row)
            except Refused:
                continue
            except Exception as e:
                broke.append(f"{type_} {name}: {type(e).__name__}: {e}")
    assert broke == [], "every action either does its work or refuses in words"


def test_every_action_is_reachable_as_a_command():
    features.load()
    from commands.parser import parser
    built = parser()._subparsers._group_actions[0].choices
    missing = [f"{type_} {controller.resource.command_names.get(name, name)}"
               for type_, controller in CONTROLLERS.items()
               for name in actions(type(controller(fresh(type_[:2]), actor=SYSTEM)))
               if controller.resource.command_names.get(name, name) not in built[type_]._subparsers._group_actions[0].choices]
    assert missing == [], "every public action on a controller is a journal command"


def viewer_calls(env: str) -> dict:
    walked = subprocess.run(["node", str(RECORDER), VIEWER.as_uri(), env, json.dumps(CALLS)], capture_output=True, text=True, timeout=60)
    assert walked.returncode == 0, walked.stderr
    return json.loads(walked.stdout)


def multipart(name: str) -> dict:
    boundary = "walked"
    raw = f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\n\r\nwalked\r\n--{boundary}--\r\n'
    return {"_raw": raw.encode(), "_type": f"multipart/form-data; boundary={boundary}"}


def unanswered(record, sent: dict, world: bool) -> str:
    url = urlparse(sent["url"])
    found = resolve(sent["method"], url.path)
    if found is None:
        return "no route answers it"
    body = multipart("walked.txt") if (sent["body"] or {}).get("form") else sent["body"] or {}
    if world:
        return unbound(record, found, body)
    reply = dispatch(sent["method"], url.path, record.root, dict(parse_qsl(url.query)), body)
    error = str(reply.body.get("error", "")) if isinstance(reply.body, dict) else ""
    if reply.code >= 500 or (reply.code == 404 and error == "no such route") or any(word in error for word in UNBOUND):
        return f"{reply.code} {error or reply.body}"
    return ""


def unbound(record, found, body: dict) -> str:
    route, params = found
    if route.handler.__name__ not in ("post_action", "post_action_bare"):
        return ""
    controller = CONTROLLERS[params["type"]](record, actor=USER)
    try:
        fn = controller.method(params["action"])
    except Refused as refused:
        return str(refused)
    ordered, keyed = spread(fn, (1,) if "n" in params else (), body, {})
    try:
        inspect.signature(fn).bind(*ordered, **keyed)
    except TypeError as error:
        return str(error)
    return ""


def test_every_call_the_viewer_makes_is_answered_by_the_api_as_the_user():
    features.load()
    record = fresh()
    walked = viewer_calls(record.env)
    unwalked = set(walked["methods"]) - set(CALLS) - BUILT
    assert unwalked == set(), "every method of the viewer's API client is walked here, or named as one that only builds a url"
    broken = [f"{name}: {sent.get('error') or sent['method'] + ' ' + sent['url']} - {why}"
              for name, requests in walked["sent"].items()
              for sent in requests or [{"error": "sent nothing"}]
              for why in [sent.get("error") or unanswered(record, sent, name in REAL)] if why]
    assert broken == [], "every request the viewer sends reaches a route, binds its body to the method and never fails with a 500"


def get(record, path: str, **query):
    return dispatch("GET", path.format(env=record.env), record.root, query, {})


def test_every_read_the_viewer_polls_answers_with_the_keys_it_reads():
    from controllers.types import Todos
    from engine.package import code
    from tests.kit import report
    features.load()
    record = fresh()
    Todos(record, actor=SYSTEM).create("a row to find")
    report(record, "working", "PreToolUse")
    code(record.root).mkdir(parents=True, exist_ok=True)
    (code(record.root) / "CHANGELOG.md").write_text("# changes\n")
    keys = {
        "/api/manifest": {"actions", "actors", "build", "environment", "features", "fields", "groups", "methods", "priority", "project", "scopes", "types", "version", "views"},
        "/api/summary": {"color", "environments", "helpers", "project", "root", "start", "version"},
        "/api/{env}/bar": {"queue"},
        "/api/{env}/family": {"links", "members"},
        "/api/agent-controls/claude": {"groups", "note", "provider"},
        "/api/{env}/agent": {"more", "rows"},
        "/api/{env}/agent/1/transcript": {"first", "total", "turns"},
        "/api/changelog": {"changelog", "checking", "latest", "newer", "repository", "updating", "version"},
    }
    wrong = {path: sorted(keys[path] ^ set(reply.body)) for path in keys if (reply := get(record, path)).code != 200 or set(reply.body) != keys[path]}
    assert wrong == {}, "each object the viewer reads has the keys it reads, and nothing else"
    assert "`journal plan create`" in get(record, "/api/manifest").body["features"]["plans"]["help"], \
        "a feature's help reaches the viewer through the formatters, its commands set as code"
    lists = {"/api/pages": set(), "/api/services": set(), "/api/journals": {"current", "port", "project", "root", "running", "version"},
             "/api/{env}/events": {"action", "actor", "at", "data", "handled", "id", "n", "pid", "type"},
             "/api/{env}/search": {"matches", "n", "ref", "title", "type"}}
    asked = {"/api/{env}/events": {"since": "0"}, "/api/{env}/search": {"q": "row"}}
    bad = {}
    for path, shape in lists.items():
        reply = get(record, path, **asked.get(path, {}))
        if reply.code != 200 or not isinstance(reply.body, list) or any(not shape <= set(row) for row in reply.body) or (path in asked and not reply.body):
            bad[path] = (reply.code, reply.body)
    assert bad == {}, "each list the viewer reads is a list, and its rows have the keys it reads"
    assert (reply := get(record, "/api/{env}/todo/1/choices")).code == 200 and isinstance(reply.body, dict), "a row's field choices are an object keyed by field"


def test_a_refusal_is_a_400_a_missing_row_a_404_and_nothing_is_ever_a_500():
    features.load()
    record = fresh()
    todo = CONTROLLERS["todo"](record, actor=SYSTEM).create("a row")
    post = lambda path, body=None: dispatch("POST", f"/api/{record.env}/{path}", record.root, {}, body or {}).code
    assert dispatch("GET", "/api/nowhere/todo", record.root, {}, {}).code == 404, "an environment that is not there is a 404"
    assert (post("todo/99/done", {"how": "x"}), dispatch("GET", f"/api/{record.env}/todo/99", record.root, {}, {}).code, post("nonsense/create")) == (404, 404, 404), \
        "a row or a type that is not there is a 404"
    assert (post("todo/create"), post(f"todo/{todo.n}/bogus"), post(f"todo/{todo.n}/priority", {"value": "urgentest"})) == (400, 400, 400), \
        "a missing argument, an unknown action and a value the action refuses are each a 400"
    assert (post(f"todo/{todo.n}/create"), post(f"todo/{todo.n}/search", {"term": "x"})) == (400, 400), \
        "an action that takes no row, posted to a row's route, is a 400 that names its route, never a 500"
    assert (post("work/start", {"title": "one"}), post("work/start", {"title": "two"})) == (201, 400), "an action the row's state refuses is a 400"
    answered = {}
    for type_, resource in TYPES.items():
        if resource.required and type_ not in ("work", "board"):
            answered[type_] = post(f"{type_}/{resource.command_names.get('create', 'create')}")
    assert set(answered.values()) == {400}, f"creating any type without what it needs is refused in words, never a 500: {answered}"


def test_the_command_line_refuses_in_words_and_exits_nonzero():
    import io
    from tests.kit import run
    features.load()
    record = fresh()

    def refused(*argv: str) -> tuple[int, str]:
        err = io.StringIO()
        return run(["--root", str(record.root), "--env", record.env, *argv], out=io.StringIO(), err=err), err.getvalue()
    code, said = refused("todo", "all", "--force")
    assert (code, "takes the reason" in said) == (1, True), "--force without its reason exits 1 and says it takes one"
    code, said = refused("todo", "bogus")
    assert (code, "invalid choice" in said or "bogus" in said) == (2, True), "a word the noun does not have exits 2 and names it"
    code, said = refused("--as", "bogus", "todo", "all")
    assert (code, "choose from 'user', 'agent', 'system', 'plugin'" in said) == (2, True), "an unknown actor exits 2 and names the actors there are"
    code, said = refused("--agent", "sub-1", "todo", "create", "a title")
    assert (code, said.startswith("! ")) == (1, True), f"a subagent that was never lent the environment is refused in words: {said}"
    assert CONTROLLERS["todo"](record, actor=SYSTEM).all() == [], "and nothing was written by the refused command"

    def answered(*argv: str) -> str:
        out = io.StringIO()
        run(["--root", str(record.root), "--env", record.env, *argv], out=out, err=io.StringIO())
        return out.getvalue()
    assert "in force" in answered("verify") and f"settings on {record.env}" in answered("settings"), "verify and settings answer without raising"
    assert "usage:" in answered("help") and "usage:" in answered("help", "todo") and "no command" in answered("help", "nonsense"), "help answers for the whole journal, for one noun and for a word it does not have"
    assert answered("services", "list") != "" and refused("services", "bogus")[0] == 1, "services lists, and a word it does not know is refused in words"


def test_no_command_argument_shares_a_name_with_a_global_option():
    features.load()
    from commands.parser import parser
    top = parser()
    globals_ = {action.dest for action in top._actions if action.dest not in ("help", "command")}
    clashes = [f"{noun} {verb}: {action.dest}"
               for noun, nouns in top._subparsers._group_actions[0].choices.items() if nouns._subparsers
               for verb, command in nouns._subparsers._group_actions[0].choices.items()
               for action in command._actions if action.dest in globals_]
    assert clashes == [], "a command's own argument never shares its name with a global option, which would swallow it"


BUDGET, PAGE, MANY = 50, 25, 150


def fastest(call, times: int = 3) -> float:
    took = []
    for _ in range(times):
        began = time.perf_counter()
        call()
        took.append((time.perf_counter() - began) * 1000)
    return min(took)


def test_every_listing_is_one_page_of_open_rows_inside_the_budget():
    from commands.http import dispatch
    record = fresh("li")
    for type_ in TYPES:
        controller = CONTROLLERS[type_](record, actor=SYSTEM)
        for i in range(MANY if type_ in ("message", "comment") else PAGE + 5):
            try:
                row = controller.create(f"{type_} {i}", **needed(type_))
                if i % 3 == 0:
                    controller.complete(row.n, "done")
            except Refused:
                continue
    slow, wrong = {}, {}
    for type_ in TYPES:
        ask = lambda: dispatch("GET", f"/api/{record.env}/{type_}", record.root, {}, {}).body
        got = ask()
        if len(got["rows"]) > PAGE or any(r["completed"] for r in got["rows"]):
            wrong[type_] = (len(got["rows"]), sum(bool(r["completed"]) for r in got["rows"]))
        took = fastest(ask)
        if took > BUDGET:
            slow[type_] = round(took)
    everything = {"types": ",".join(TYPES), "completed": "1", "events": "100"}
    whole = fastest(lambda: dispatch("GET", f"/api/{record.env}/dashboard", record.root, everything, {}))
    assert wrong == {}, "a listing returns at most one page, and no completed row unless asked"
    assert slow == {}, f"every listing answers inside {BUDGET}ms"
    assert whole <= BUDGET * 2, f"the whole dashboard answers inside {BUDGET * 2}ms, took {whole:.0f}"
    named = dispatch("GET", f"/api/{record.env}/todo", record.root, {"n": "1,2,3", "completed": "1"}, {}).body
    assert [r["n"] for r in named["rows"]] == [1, 2, 3], "a listing asked for rows by number returns those rows, however old"
    CONTROLLERS["todo"](record, actor=USER).delete(2, why="gone")
    named = dispatch("GET", f"/api/{record.env}/todo", record.root, {"n": "2", "completed": "1"}, {}).body
    assert [r["n"] for r in named["rows"]] == [2], "a row asked for by number is returned even when deleted"
    CONTROLLERS["todo"](record, actor=USER).update(1, brief="touched last")
    recent = dispatch("GET", f"/api/{record.env}/todo", record.root, {"last": "1", "by": "updated", "completed": "1"}, {}).body
    assert 1 in [r["n"] for r in recent["rows"]], "by=updated returns the most recently changed rows, however old their number"


def test_a_row_is_changed_only_by_those_its_resource_names_for_its_author():
    from resources.base import AGENT, USER
    guarded = [type_ for type_, resource in TYPES.items() if resource.editors]
    changed = []
    for type_ in guarded:
        record = fresh(type_[:2])
        row = CONTROLLERS[type_](record, actor=USER).create(f"the user's {type_}", brief="their words", **needed(type_))
        agent = CONTROLLERS[type_](record, actor=AGENT)
        agent.section(row.n, "their words", "todo:1")
        for change in (lambda: agent.update(row.n, brief="rewritten"), lambda: agent.delete(row.n, why="gone")):
            try:
                change()
                changed.append(type_)
            except Refused:
                continue
    assert (guarded, changed) != ([], []) and changed == [], "the agent answers what the user wrote and records what each part became; it never rewrites or deletes it"


def test_project_rows_made_at_once_from_two_environments_never_share_a_number():
    import threading
    from engine.record import Record
    from resources.base import PROJECT
    features.load()
    root = fresh().root
    for type_, resource in TYPES.items():
        if resource.scope != PROJECT:
            continue
        made = []

        def make(env: str, i: int) -> None:
            try:
                made.append(CONTROLLERS[type_](Record(root, env), actor=USER).create(f"Row {env} {i}", brief="why", **needed(type_)).n)
            except (Refused, ValueError, TypeError):
                return

        runs = [threading.Thread(target=make, args=(env, i)) for env in ("east", "west") for i in range(4)]
        for run in runs:
            run.start()
        for run in runs:
            run.join()
        assert len(made) == len(set(made)), f"{type_} rows made at once from two environments share a number: {sorted(made)}"


def test_every_type_with_its_own_word_for_create_is_created_over_http():
    from commands.dispatch import dispatch
    features.load()
    record = fresh()
    renamed = [type_ for type_, resource in TYPES.items() if "create" in resource.command_names]
    answers = {type_: dispatch("POST", f"/api/{record.env}/{type_}", record.root, {}, {"title": f"a {type_} from the viewer", "brief": "why", **needed(type_)})
               for type_ in renamed}
    assert {type_: reply.code for type_, reply in answers.items()} == {type_: 201 for type_ in renamed}, \
        {type_: reply.body for type_, reply in answers.items() if reply.code != 201}


def test_no_environment_name_is_shadowed_by_a_global_route():
    from commands import http  # noqa: F401
    from commands.dispatch import ranked
    from engine.paths import ROUTED
    features.load()
    fixed = {parts[2] for parts in (r.pattern.split("/") for r in ranked()) if parts[1] == "api" and len(parts) > 3 and not parts[2].startswith("{")}
    assert fixed <= ROUTED, f"environments named {sorted(fixed - ROUTED)} would be shadowed by a global route"


def test_an_action_is_marked_on_a_public_name_only():
    import inspect
    features.load()
    marked = {f"{type_} {name}" for type_, controller in CONTROLLERS.items()
              for name, fn in inspect.getmembers(controller, inspect.isfunction) if getattr(fn, "action", False) and name.startswith("_")}
    assert marked == set(), "an underscore name is a helper, never an action"


def test_unloading_the_features_empties_every_extension_point():
    from engine.extension import EXTENSIONS
    features.load()
    try:
        features.unload()
        assert [extension for extension in EXTENSIONS if extension.entries] == [], "a feature leaves nothing behind once it is unloaded"
    finally:
        features.load()


def test_a_row_moved_to_another_environment_keeps_its_file_and_leaves_an_archived_original(tmp_path):
    from engine.record import Record
    features.load()
    record = fresh("east")
    west = Record(record.root, "west")
    source = tmp_path / "note.txt"
    source.write_text("kept")
    for type_ in ("todo", "doc"):
        controller = CONTROLLERS[type_](record, actor=USER)
        row = controller.create(f"a {type_} to carry", brief="the brief", **needed(type_))
        controller.attach(row.n, str(source))
        moved = controller.move(row.n, "west")
        there = CONTROLLERS[type_](west, actor=USER)
        assert (there.load(moved.n).title, there.load(moved.n).brief) == (row.title, "the brief"), f"the moved {type_} keeps its words"
        assert (there.folder(moved.n) / "note.txt").read_text() == "kept", f"the moved {type_} keeps its file"
        whys = [e.data["why"] for e in record.event_log.events() if e.type == type_ and e.action == "deleted" and e.n == row.n]
        assert (controller.load(row.n).deleted > 0, whys) == (True, [f"moved to west as {type_} {moved.n}"]), \
            f"the original {type_} is archived with where it went"


def test_a_row_made_twice_in_ten_seconds_is_one_row_unless_the_words_author_or_target_differ():
    features.load()
    record = fresh()
    users, agents = (CONTROLLERS["message"](record, actor=who) for who in (USER, AGENT))
    first = users.create("same words", brief="same brief")
    assert users.create("same words", brief="same brief").n == first.n, "the same author and words make one row"
    assert agents.create("same words", brief="same brief").n != first.n, "a different author makes a new row"
    assert users.create("same words", brief="other brief").n != first.n, "different words make a new row"
    keyed = users.create("keyed", idempotency="a")
    assert (users.create("keyed", idempotency="a").n, users.create("keyed", idempotency="b").n) == (keyed.n, keyed.n + 1), \
        "a message with the same key is the same row, and a different key is a new one"
    comments, others = (CONTROLLERS["comment"](record, actor=who) for who in (USER, AGENT))
    about = comments.create("same note", about="todo:1")
    assert (comments.create("same note", about="todo:1").n, comments.create("same note", about="todo:2").n, others.create("same note", about="todo:1").n) == \
        (about.n, about.n + 1, about.n + 2), "a comment about the same row by the same author is one row; another target or author is new"


def test_a_row_that_ships_with_the_journal_refuses_removal_and_new_words_but_keeps_its_progress_open():
    features.load()
    record = fresh()
    system = CONTROLLERS["sequence"](record, actor=SYSTEM)
    shipped = system.create("a shipped sequence", system=True)
    users = CONTROLLERS["sequence"](record, actor=USER)
    for name, change in (("delete", lambda: users.delete(shipped.n)), ("complete", lambda: users.complete(shipped.n, how="done")),
                         ("title", lambda: users.update(shipped.n, title="another")), ("brief", lambda: users.update(shipped.n, brief="another"))):
        assert "ships with the journal" in refused(change), f"a shipped row refuses a change by {name}"
    users.stamp(shipped.n, kept=True, runs={"a": {}})
    stored = users.load(shipped.n)
    assert (stored.data["kept"], stored.data["runs"]) == (True, {"a": {}}), "a shipped row still lets its kept and progress fields change"
    assert "ships with the journal" in refused(lambda: users.stamp(shipped.n, starts_on="todo.created")), "a field outside progress is refused"


def test_closing_reopening_restoring_and_deleting_a_row_refuse_what_the_row_cannot_do():
    features.load()
    record = fresh()
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    row = todos.create("a row to close")
    todos.complete(row.n, how="done")
    assert "already closed" in refused(lambda: todos.complete(row.n, how="again")), "closing a closed row twice is refused"
    todos.delete(row.n, why="gone")
    assert "archived" in refused(lambda: todos.reopen(row.n, why="back")), "an archived row cannot be reopened"
    todos.restore(row.n)
    assert (refused(lambda: todos.reopen(row.n, why="back")), "not done" in refused(lambda: todos.reopen(row.n, why="again"))) == ("", True), \
        "a restored row keeps its closed state, so it reopens once and then refuses as not done"
    open_row = todos.create("an open row")
    assert "not done" in refused(lambda: todos.reopen(open_row.n, why="back")), "an open row cannot be reopened"
    facts = CONTROLLERS["fact"](record, actor=USER)
    fact = facts.create("a claim", brief="why", keywords="word,other")
    assert USER in facts.load(fact.n).seen, "the user's own row is seen by the user"
    CONTROLLERS["fact"](record, actor=AGENT).complete(fact.n, how="closed by the agent")
    assert USER not in facts.load(fact.n).seen, "a row listed as completed-unread loses the user's seen mark when the agent closes it"


def test_finding_a_row_by_title_takes_an_exact_title_or_number_and_refuses_a_shared_prefix():
    features.load()
    record = fresh()
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    one, two = todos.create("tidy the shelves"), todos.create("tidy the garden")
    assert (todos.find("tidy the shelves").n, todos.find(str(two.n)).n) == (one.n, two.n), "a title and a number each load their row"
    assert "say more of the title" in refused(lambda: todos.find("tidy")), "a shared prefix refuses and asks for more"
    assert "no todos match" in refused(lambda: todos.find("nothing like it")), "a title nothing has refuses in words"


def test_linking_twice_keeps_one_ref_unlinking_removes_it_and_superseding_closes_the_old_row():
    features.load()
    record = fresh()
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    one, two = todos.create("one"), todos.create("two")
    todos.link(one.n, "todo:2")
    todos.link(one.n, "todo:2")
    assert (todos.load(one.n).refs, [r.n for r in todos.linked_to("todo:2")]) == (["todo:2"], [one.n]), "linking twice keeps one ref, and the target finds its linker"
    todos.unlink(one.n, "todo:2")
    assert (todos.load(one.n).refs, todos.linked_to("todo:2")) == ([], []), "unlinking removes the ref from the row and from linked_to"
    docs = CONTROLLERS["doc"](record, actor=SYSTEM)
    old, new = docs.create("the old doc"), docs.create("the new doc")
    docs.supersede(old.n, new.n)
    assert (docs.load(old.n).completed > 0, "doc:1" in docs.load(new.n).refs, docs.load(old.n).outcome) == (True, True, "superseded by doc 2"), \
        "superseding closes the old row with where it went and links the new one to it"
    assert two.n == 2, "the second to-do keeps its number"


def test_pruning_deletes_old_closed_to_dos_with_a_reason_and_placing_and_waiting_refuse_what_is_not_there():
    features.load()
    record = fresh()
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    old, recent, open_row = todos.create("old"), todos.create("recent"), todos.create("still open")
    todos.complete(old.n, how="done")
    todos.complete(recent.n, how="done")
    stale = todos.load(old.n)
    stale.completed = time.time() - 40 * 86400
    todos.rows.persist(stale)
    assert [r.n for r in todos.prune(days=30)] == [old.n], "prune takes only the rows closed longer ago than the days"
    reasons = [e.data["why"] for e in record.event_log.events() if e.type == "todo" and e.action == "deleted"]
    assert (reasons, [r.n for r in todos.all(completed=True)]) == (["pruned after 30 days"], [recent.n, open_row.n]), \
        "the pruned row is archived with a reason and the others stay"
    assert "not in the same column" in refused(lambda: todos.place(open_row.n, recent.n)), "placing before a closed row is refused"
    high = todos.create("high")
    todos.priority(high.n, "high")
    todos.place(open_row.n, high.n)
    assert todos.load(open_row.n).priority == todos.load(high.n).priority, "placing before a row puts the row in that row's column"
    assert "no todo 99" in refused(lambda: todos.after(open_row.n, "99")), "waiting on a to-do that is not there is refused in words"
    assert "wait on itself" in refused(lambda: todos.after(open_row.n, str(open_row.n))), "a to-do cannot wait on itself"


def test_a_field_given_the_wrong_type_is_refused_in_words_and_nothing_is_stored():
    from resources.shapes import normalize_options
    features.load()
    unrefused = []
    for type_, resource in TYPES.items():
        record = fresh(type_[:2])
        controller = CONTROLLERS[type_](record, actor=SYSTEM)
        row = controller.create(f"a {type_} to change", **needed(type_))
        for name, spec in resource.fields.items():
            wrong = "wrong" if isinstance(spec, dict) else {"wrong": "type"}
            said = refused(lambda: controller.update(row.n, **{name: wrong}))
            if not said or controller.load(row.n).data.get(name) == wrong:
                unrefused.append(f"{type_}.{name}")
    assert unrefused == [], "every field of every type refuses a value of the wrong type, and stores nothing"
    assert "options.title is required" in refused(lambda: normalize_options([{"description": "no title"}])), "an option without a title is refused"
    assert normalize_options([{"label": "Yes", "value": "y"}, "plain"]) == [{"title": "Yes", "code": "y"}, "plain"], \
        "an option's label and value become its title and code, and a plain word stays"


def test_renaming_an_environment_moves_its_rows_and_refuses_a_folder_that_holds_rows():
    import tarfile
    from engine.record import Record
    features.load()
    record = fresh()
    environments = CONTROLLERS["environment"](record, actor=SYSTEM)
    old, other = environments.create("old"), environments.create("other")
    CONTROLLERS["todo"](Record(record.root, "old"), actor=SYSTEM).create("a row that travels")
    seeded = record.root / "environments" / "new" / "feature"
    seeded.mkdir(parents=True)
    (seeded / "001.md").write_text("a seeded row")
    environments.rename(old.n, "new")
    assert [t.title for t in CONTROLLERS["todo"](Record(record.root, "new"), actor=SYSTEM).all()] == ["a row that travels"], \
        "renaming onto a seeded folder moves the rows over it"
    assert (not (record.root / "environments" / "old").exists(), len(list((record.root / "attic").glob("new-seed-*.tar.gz")))) == (True, 1), \
        "the old folder is gone and what the seeded folder held is packed in the attic"
    with tarfile.open(next((record.root / "attic").glob("new-seed-*.tar.gz"))) as packed:
        assert any(name.endswith("feature/001.md") for name in packed.getnames()), "the packed seed holds its row"
    CONTROLLERS["todo"](Record(record.root, "plain"), actor=SYSTEM).create("a row already here")
    assert "already holds rows" in refused(lambda: environments.rename(other.n, "plain")), "a folder that holds real rows is never written over"
    assert "exists" in refused(lambda: environments.rename(other.n, "new")), "a name another environment has is refused"


def test_sweeping_an_environment_packs_every_swept_row_into_the_attic_and_keeps_the_open_ones():
    import tarfile
    from engine.record import Record
    features.load()
    record = fresh()
    environments = CONTROLLERS["environment"](record, actor=SYSTEM)
    env = environments.create("busy")
    there = Record(record.root, "busy")
    todos = CONTROLLERS["todo"](there, actor=SYSTEM)
    closed, open_row = todos.create("a closed row"), todos.create("an open row")
    todos.complete(closed.n, how="done")
    CONTROLLERS["message"](there, actor=SYSTEM).create("a message", brief="swept whatever its state")
    assert "--yes sweeps" in environments.sweep(env.n), "without --yes a sweep only says what it would do"
    assert len(todos.rows.summaries()) == 2, "the sweep without --yes removes nothing"
    environments.sweep(env.n, yes=True)
    assert ([t.n for t in todos.all(completed=True)], CONTROLLERS["message"](there, actor=SYSTEM).rows.summaries()) == ([open_row.n], []), \
        "the closed row and the message are swept and the open row stays"
    with tarfile.open(next((record.root / "attic").glob("busy-swept-*.tar.gz"))) as packed:
        kept = [name for name in packed.getnames() if name.endswith(".md")]
    assert sorted(name.split("/")[-2] for name in kept) == ["message", "todo"], "every swept row is in the attic"
    assert "nothing to sweep" in environments.sweep(env.n, yes=True), "sweeping again finds nothing"


def test_the_overview_counts_only_live_rows_and_splits_a_helper_environment_out():
    from overview.counts import tally
    from overview.summary import environment, summarize
    from controllers.types import Environments
    features.load()
    rows = [{"deleted": 0, "completed": 0, "seen": []}, {"deleted": 0, "completed": 0, "seen": [USER]}, {"deleted": 0, "completed": 5, "seen": []},
            {"deleted": 5, "completed": 0, "seen": []}, {"deleted": 0, "completed": 0, "seen": [], "hidden": True}]
    assert tally(rows) == {"all": 3, "open": 2, "unread": 1}, "deleted and hidden rows are not counted, closed rows are all but not open, and a seen row is not unread"
    record = fresh()
    todos, messages = (CONTROLLERS[type_](record, actor=SYSTEM) for type_ in ("todo", "message"))
    todos.create("kept")
    closed, struck = todos.create("closed"), todos.create("struck")
    todos.complete(closed.n, how="done")
    todos.delete(struck.n, why="gone")
    messages.create("unread", brief="from the agent")
    messages.create("read", brief="already seen")
    CONTROLLERS["message"](record, actor=USER).read(2)
    counted = environment(record)["counts"]
    assert (counted["todos"], counted["messages"]) == (1, 1), "an environment counts its open to-dos and its unread messages, never a closed or archived row"
    environments = Environments(record, actor=SYSTEM)
    environments.create("helped", owner="helper:1")
    environments.create("plain")
    found = summarize(record.root)
    assert ([e["name"] for e in found["helpers"]], "helped" in [e["name"] for e in found["environments"]], "plain" in [e["name"] for e in found["environments"]]) == \
        (["helped"], False, True), "a helper's environment is listed with the helpers, not among the environments"


def test_a_row_written_behind_the_stores_back_shows_up_in_lists_fresh_stale_or_in_bulk(monkeypatch):
    import controllers.stored as stored
    from engine.stored import read_json, write_text
    features.load()
    record = fresh()
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    todos.create("the first row")
    assert [t.n for t in todos.all()] == [1], "the list is warm before another process writes"

    def written_elsewhere(n: int, title: str) -> None:
        row = todos.load(1)
        row.n, row.title = n, title
        write_text(todos.path(n), row.dump())
    written_elsewhere(2, "written by another process")
    assert [t.title for t in todos.all()] == ["the first row", "written by another process"], "a new row file shows up while the stamps are fresh"
    written_elsewhere(1, "edited by another process")
    monkeypatch.setattr(stored, "STAMPS_FRESH", 0.0)
    assert [t.title for t in todos.all()] == ["edited by another process", "written by another process"], "an edited row file shows once the stamps are stale"
    monkeypatch.setattr(stored, "FLUSH_ROWS", 5)
    for n in range(3, 10):
        written_elsewhere(n, f"bulk row {n}")
    assert [t.n for t in todos.all(last=0)] == list(range(1, 10)), "a bulk of rows past the flush count all show up"
    assert sorted(int(n) for n in read_json(todos.rows.folder() / stored.INDEX, dict, {})) == list(range(1, 10)), "a bulk past the flush count is written to the index"


def test_picture_dimensions_are_read_from_tiny_files_and_search_sees_an_edit_that_kept_its_updated_stamp(tmp_path):
    import struct
    from engine.stored import write_text
    from resources.pictures import dimensions
    riff = lambda kind, body: b"RIFF" + struct.pack("<I", 4 + 8 + len(body)) + b"WEBP" + kind + struct.pack("<I", len(body)) + body
    vp8l_bits = (640 - 1) | ((480 - 1) << 14)
    pictures = {
        "a.png": b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", 1390, 486) + b"\x08\x06\x00\x00\x00",
        "a.gif": b"GIF89a" + struct.pack("<HH", 320, 200) + b"\x00\x00\x00;",
        "x.webp": riff(b"VP8X", b"\0" * 4 + (799).to_bytes(3, "little") + (599).to_bytes(3, "little")),
        "l.webp": riff(b"VP8L", b"\x2f" + struct.pack("<I", vp8l_bits)),
        "v.webp": riff(b"VP8 ", b"\0\0\0\x9d\x01\x2a" + struct.pack("<HH", 400, 300) + b"\0" * 4),
        "a.jpg": b"\xff\xd8\xff\xe0" + struct.pack(">H", 16) + b"JFIF\0" + b"\0" * 9 + b"\xff\xc0" + struct.pack(">H", 17) + b"\x08" + struct.pack(">HH", 480, 640) + b"\x03" + b"\0" * 9 + b"\xff\xd9",
    }
    wanted = {"a.png": (1390, 486), "a.gif": (320, 200), "x.webp": (800, 600), "l.webp": (640, 480), "v.webp": (400, 300), "a.jpg": (640, 480)}
    for name, data in pictures.items():
        (tmp_path / name).write_bytes(data)
    (tmp_path / "text.png").write_bytes(b"not a picture at all")
    assert {name: dimensions(tmp_path / name) for name in pictures} == wanted, "each picture type gives its width and height from its first bytes"
    (tmp_path / "cut.webp").write_bytes((tmp_path / "v.webp").read_bytes()[:29])
    assert (dimensions(tmp_path / "text.png"), dimensions(tmp_path / "gone.png"), dimensions(tmp_path / "cut.webp")) == (None, None, None), \
        "a file that is no picture, is not there, or is cut short has no dimensions"
    features.load()
    record = fresh()
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    row = todos.create("alpha")
    assert [t.n for t in todos.search("alpha")] == [row.n], "search finds a row by its words"
    edited = todos.load(row.n)
    edited.title = "omega"
    write_text(todos.path(row.n), edited.dump())
    assert ([t.n for t in todos.search("omega")], todos.search("alpha")) == ([row.n], []), \
        "search finds the new words after an edit that kept the same updated stamp, and not the old"


def test_the_hook_route_refuses_in_the_providers_shape_and_a_stranger_with_409():
    from providers import PROVIDERS
    from runner.hooks import handle
    features.load()
    refusal = features.FEATURES["work_tracking"].line("undeclared held", {})[0]
    record = fresh()
    query = {"root": str(record.root), "env": record.env, "pid": "0"}
    for name, provider in PROVIDERS.items():
        hook = {"session_id": f"{name}-9"}
        handle(provider(), record.root, record.env, {**hook, "hook_event_name": "SessionStart"})
        edit = {**hook, "hook_event_name": "PreToolUse", "tool_name": "Edit", "tool_input": {"file_path": "x.py"}}
        refused = dispatch("POST", f"/api/hook/{name}", record.root, query, edit)
        assert (refused.code, refused.body) == (403, provider().blocking(refusal)), f"{name}: a refused write is a 403 carrying the provider's blocking body"
        elsewhere = dispatch("POST", f"/api/hook/{name}", record.root, {**query, "root": str(record.root.parent / "elsewhere")}, edit)
        assert elsewhere.code == 409, f"{name}: a hook meant for another journal's root is a 409"
    assert dispatch("POST", "/api/hook/nobody", record.root, query, {}).code == 409, "a provider the journal does not know is a 409"


def test_a_command_over_the_run_route_is_a_409_when_local_a_400_when_refused_and_takes_its_actor_only_from_the_query():
    record = fresh()
    run = lambda *words, **query: dispatch("POST", "/api/run", record.root, {"env": record.env, **query}, {"_raw": "\0".join(words).encode(), "_type": "text/plain"})
    row = lambda reply: json.loads(reply.body.split("---\n")[1])
    assert run("browser", "open").code == 409, "a command that needs the user's own browser is not run by the server"
    refused = run("todo", "done", "99", "--how", "x")
    assert (refused.code, refused.body) == (400, "! no todo 99\n"), "a refused action is a 400 saying why"
    named, plain, plugin = run("todo", "create", "one", actor=USER), run("todo", "create", "two"), run("todo", "create", "three", plugin="clock")
    assert (named.code, plain.code, plugin.code) == (200, 200, 200), "a valid command is a 200"
    assert (row(named)["seen"], row(plain)["seen"]) == (["user"], ["agent"]), "the actor is the one the query names, and the agent when it names none"
    assert row(plugin)["data"]["plugin"] == "clock", "the plugin the query names is the one the command runs as"
