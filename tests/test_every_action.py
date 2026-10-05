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
from resources.base import Refused, SYSTEM, USER
from resources.types import TYPES
from tests.conftest import fresh

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
