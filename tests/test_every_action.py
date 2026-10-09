import inspect
import io
import json
import os
import struct
import subprocess
import tarfile
import threading
import time
from functools import partial
from os.path import commonprefix
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

import pytest

import controllers.files as files
import controllers.stored as stored
import features
from commands.dispatch import dispatch
from features.routing import ranked, resolve
from controllers.invoke import invoked, spread
from commands.parser import parser
from controllers.base import Controller, actions
from controllers.environments import KEPT, SWEPT
from controllers.types import CONTROLLERS, Environments, Todos, Works
from engine.extension import EXTENSIONS
from engine.package import code
from engine.paths import ROUTED, environment_names
from engine.record import Record
from engine.stored import read_json, write_text
from engine.transaction import snapshot, undoable
from engine.wording import noun
from overview.counts import tally
from overview.summary import environment, summarize
from resources.base import AGENT, ENVIRONMENT, PROJECT, Refused, SYSTEM, USER
from resources.pictures import dimensions
from resources.shapes import normalize_options
from resources.types import TYPES, EnvironmentKind
from tests.conftest import fresh, refused
from tests.kit import Nudges, project_on, report, run
from commands import http  # noqa: F401

VIEWER = Path(__file__).resolve().parents[1] / "src" / "web" / "src"
RECORDER = Path(__file__).with_name("viewer_calls.mjs")
UNBOUND = ("unexpected keyword argument", "missing a required argument", "positional argument")
BUILT = {"get", "post", "here", "act", "command", "url", "at", "in", "point", "page", "origin", "journal", "pluginUrl", "markdownUrl", "fileUrl",
         "extensionZip", "stream", "layoutFrom"}
REAL = {"checkForUpdate", "update", "upstream", "upgrade", "stop", "tunnelLogin", "tunnelLogout", "updateTunler", "installTunler",
        "tunnelAnswering", "tunnelDomains", "tunnelRelease", "tunnelReaddress", "tunnelCause", "restartTunnel", "setService", "installPlugin", "installSuggested", "upgradePlugin", "previewPlugin",
        "previewUpgrade", "launchAgent", "saveAgentHooks", "relaunchAgent", "runShell", "agentKeys", "runCheck", "connectPhone", "connectTo",
        "logInIntegration", "logOutIntegration", "checkIntegration", "integrationTeams", "integrationWebhook"}
LOGIN_PAGE = {"hosting", "hostingUpgrade", "hostingTakeDown", "hostingMe", "members", "inviteMember", "assignRole", "removeMember", "shareEnvironments", "endLogins",
              "leaveJournal"}
SESSION, AGENT_N, WALK = "claude-1", 1, "walk-1"
CALLS = {
    "changelog": [], "connection": [], "connectTo": ["127.0.0.1:9"], "disconnectFromServer": [], "releases": [], "restore": ["todo", 1], "press": [{"label": "Read it", "type": "todo", "n": 1, "action": "read"}], "checkForUpdate": [], "update": [], "manifest": [], "identity": [], "saveIdentity": [{"name": "Walker"}],
    "pages": [], "journals": [], "forgetJournal": ["/nowhere/.journal"], "startJournal": ["/nowhere/.journal", "codex"], "summary": [], "upstream": [], "upgrade": [], "stop": [],
    "extension": [], "tunnelLogin": [{"endpoint": "127.0.0.1:9", "username": "walker", "password": "a password"}],
    "tunnelLogout": [], "tunlerVersion": [], "updateTunler": [], "installTunler": ["127.0.0.1:9"], "tunnelAnswering": [],
    "tunnelDomains": [], "tunnelRelease": ["walk.127.0.0.1"], "tunnelReaddress": [], "tunnelCause": [], "restartTunnel": [], "connectPhone": [7], "disconnectPhone": [1], "allowPhonePasskey": [1], "refusePhonePasskey": [1],
    "shareLayout": ["a layout", {"panels": []}], "services": [], "serviceLog": ["sharing.server"], "setService": ["sharing.server", "up"],
    "pluginDashboard": [1, "main"], "pluginLog": ["works"], "onlineAgents": [], "agentControls": ["claude"], "agentHooks": ["claude"],
    "saveAgentHooks": ["claude", {}], "list": ["todo"], "all": ["todo"], "dashboard": [["todo", "plan"]], "show": ["todo", 1],
    "create": ["todo", {"title": "walked by the viewer"}], "fieldChoices": ["todo", 1], "installPlugin": ["/nowhere/plugin"],
    "upgradePlugin": [1, False], "planTimeline": [1], "hidePreview": ["doc", 1], "revision": [1, 1], "tasks": [AGENT_N],
    "board": [{}], "shift": [1, "Doing", {"why": "walked"}], "cancelWork": [1], "reviseWork": [1, "change one card", WALK],
    "followUpWork": [1, "and one more", WALK], "requestWork": [1, "a new card", WALK], "handWork": [1, "doc:1", "from this doc", WALK],
    "ticketBoard": [1], "dismissQuestion": [1, "not needed"], "noteSuggestionWindow": [1], "answerSuggestion": [1, "No, don't do this"],
    "reopenSuggestion": [1], "installSuggested": [1], "moveTicket": [1, "Doing"], "stopTicket": [1], "confirmTicket": [1],
    "updateTicket": [1, {"title": "renamed"}], "deleteTicket": [1, "not needed"], "acceptDependencies": [1], "declineDependencies": [1],
    "buildBoard": [1, "a board", "steer it"], "startBoard": [1], "retryBoard": [1], "archiveBoard": [1], "restoreBoard": [1],
    "addedToBoard": [1, [1]], "markStage": [1, "Done", "done"], "stopShare": [1], "approveShare": [1], "tunnelStatus": [], "tunnelRecheck": [],
    "shareReachable": [1], "shareOpens": ["doc:1"], "questionsLinkedTo": ["todo:1"], "planFromDoc": [1], "keepDoc": [1],
    "runCheck": [1], "setCheck": [1, "every", 5], "closeNotice": [1], "pinNotice": ["Pinned from a message", "message:1"], "editMessage": [1, "reworded"],
    "deleteTurn": ["message", 1], "touched": [1],
    "stopTask": [AGENT_N, "task-1", "a background run"], "updateComment": [1, "reworded"], "deleteComment": [1], "addToCollection": [1, ["todo:1"]],
    "setStartsOn": [1, "todo.created"], "setSteps": [1, ["one step"]], "pinRule": [1], "profiles": [], "profileCallings": [], "profileSamples": [], "profileNamings": [], "createProfile": [{"title": "walked", "brief": "x"}], "updateProfile": [1, {"brief": "y"}],
    "duplicateProfile": [1], "deleteProfile": [1], "configurePlugin": [1, "key", "value"],
    "clearPluginLog": [1], "removeEnvironment": [1, False], "sweepEnvironment": [1, False], "readAll": ["todo", [1]],
    "upload": ["todo", 1, {"file": "walked.txt"}], "events": [], "recentEvents": [10], "settings": [], "saveSettings": [{}],
    "saveMode": ["solo"], "search": ["walked"], "searchAttic": ["walked"], "unarchive": ["gone"],
    "createSecret": [{"title": "walked", "kind": "api key"}], "updateSecret": [1, {"brief": "y"}], "fillSecret": [1, "key", "walked-value"],
    "deleteSecret": [1], "restoreSecret": [1], "revokeSecretLogin": [1], "secretsFile": [], "files": [], "filesPage": [{"kind": "all", "search": "walked", "last": 5, "skip": 0}], "changes": [], "commit": ["HEAD"], "projectFile": ["README.md"],
    "fileDiff": ["README.md"], "previewPlugin": ["/nowhere/plugin"], "previewUpgrade": [1], "findFiles": ["read"], "projectFiles": [],
    "bar": [], "agents": [5], "launchAgent": [1, "claude"], "stopAgentIn": [1], "appoint": [SESSION],
    "controlAgent": [SESSION, "model", "opus"], "forceAgent": [SESSION], "pauseAgent": [SESSION], "resumeAgent": [SESSION],
    "permitAgent": [SESSION, True], "ticketTodos": [], "organization": [], "family": [], "agentScreen": [SESSION, 0],
    "agentKeys": [SESSION, "hello"], "runShell": [SESSION, "true"], "relaunchAgent": [SESSION, False],
    "transcript": [AGENT_N, SESSION, ""], "agentLinks": [AGENT_N, SESSION], "edits": [AGENT_N, 0, 25], "olderEdits": [AGENT_N, 0, 25],
    "editedFile": [AGENT_N, "c-1", "after"], "terminal": [AGENT_N, "commands"], "skills": [], "skill": ["journal"],
    "loadSkill": ["journal"], "alwaysSkill": ["journal", True], "skillKeywords": ["journal", "walk, walked"],
    "report": [{"kind": "threw", "message": "walked", "where": "/", "stack": ""}], "diagnostics": [], "clearDiagnostics": [],
    "integration": ["linear"], "integrationTeams": ["linear"], "integrationWebhook": ["linear"], "logInIntegration": ["linear"], "logOutIntegration": ["linear"], "checkIntegration": ["linear"],
}

WORLD = ("run", "install", "uninstall", "upgrade", "services", "archive_file", "pickup", "unarchive", "ask", "launch")
VALUES = {"title": "a row worth keeping", "text": "a line of words", "body": "the body", "why": "it stopped being true",
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
    if parameter.name in VALUES:
        return VALUES[parameter.name]
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
    unwalked = set(walked["methods"]) - set(CALLS) - BUILT - LOGIN_PAGE
    assert unwalked == set(), "every method of the viewer's API client is walked here, or named as one that only builds a url"
    broken = [f"{name}: {sent.get('error') or sent['method'] + ' ' + sent['url']} - {why}"
              for name, requests in walked["sent"].items()
              for sent in requests or [{"error": "sent nothing"}]
              for why in [sent.get("error") or unanswered(record, sent, name in REAL)] if why]
    assert broken == [], "every request the viewer sends reaches a route, binds its body to the method and never fails with a 500"


def get(record, path: str, **query):
    return dispatch("GET", path.format(env=record.env), record.root, query, {})


def test_every_read_the_viewer_polls_answers_with_the_keys_it_reads():
    features.load()
    record = fresh()
    Todos(record, actor=SYSTEM).create("a row to find")
    report(record, "working", "PreToolUse")
    code(record.root).mkdir(parents=True, exist_ok=True)
    (code(record.root) / "CHANGELOG.md").write_text("# changes\n")
    keys = {
        "/api/manifest": {"actions", "actors", "build", "chat_kinds", "environment", "features", "fields", "groups", "methods", "models", "priority", "project", "scopes", "searchable", "types", "version", "views"},
        "/api/summary": {"color", "environments", "helpers", "project", "root", "start", "started", "tickets", "version"},
        "/api/{env}/bar": {"queue"},
        "/api/{env}/family": {"links", "members"},
        "/api/agent-controls/claude": {"groups", "note", "provider"},
        "/api/{env}/agent": {"more", "rows"},
        "/api/{env}/agent/1/transcript": {"first", "total", "turns"},
        "/api/changelog": {"changed", "changelog", "checking", "latest", "newer", "repository", "updating", "version"},
        "/api/{env}/search": {"hits", "more"},
    }
    wrong = {path: sorted(keys[path] ^ set(reply.body)) for path in keys if (reply := get(record, path)).code != 200 or set(reply.body) != keys[path]}
    assert wrong == {}, "each object the viewer reads has the keys it reads, and nothing else"
    assert "`journal plan create`" in get(record, "/api/manifest").body["features"]["plans"]["help"], \
        "a feature's help reaches the viewer through the formatters, its commands set as code"
    lists = {"/api/pages": set(), "/api/services": set(), "/api/journals": {"current", "port", "project", "root", "running", "version"},
             "/api/{env}/events": {"action", "actor", "at", "data", "handled", "id", "n", "pid", "type"}}
    asked = {"/api/{env}/events": {"since": "0"}}
    bad = {}
    for path, shape in lists.items():
        reply = get(record, path, **asked.get(path, {}))
        if reply.code != 200 or not isinstance(reply.body, list) or any(not shape <= set(row) for row in reply.body) or (path in asked and not reply.body):
            bad[path] = (reply.code, reply.body)
    assert bad == {}, "each list the viewer reads is a list, and its rows have the keys it reads"
    found = get(record, "/api/{env}/search", q="row").body["hits"]
    assert found and all({"matches", "n", "ref", "title", "type"} <= set(hit) for hit in found), "each search hit has the keys the viewer reads"
    assert (reply := get(record, "/api/{env}/todo/1/choices")).code == 200 and isinstance(reply.body, dict), "a row's field choices are an object keyed by field"


def post(record, path: str, body: dict | None = None, **query):
    return dispatch("POST", path.format(env=record.env), record.root, query, body or {})


def titled(controller, word: str) -> bool:
    parameters = inspect.signature(controller.action(word)).parameters.values()
    return any(p.name == "title" and p.default is p.empty for p in parameters)


def run_route(record, *words, **query):
    return post(record, "/api/run", {"_raw": "\0".join(words).encode(), "_type": "text/plain"}, env=record.env, **query)


def row_of_reply(reply) -> dict:
    return json.loads(reply.body.split("---\n")[1])


def test_a_refusal_is_a_400_a_missing_row_a_404_and_nothing_is_ever_a_500_for_every_type():
    wrong = {}
    for type_, resource, record, controller in each_type():
        row = acting(type_, record, SYSTEM).create(f"a {type_} to answer for", **needed(type_))
        names = actions(type(controller))
        make, close = resource.command_names.get("create", "create"), controller.named("complete")
        path = f"/api/{{env}}/{type_}"
        facts = {
            "a missing row is a 404 to read": get(record, f"{path}/99").code == 404,
            "a missing row is a 404 to close": post(record, f"{path}/99/{close}", {"how": "x"}).code == 404,
            "an unknown action is a 400": post(record, f"{path}/{row.n}/bogus").code == 400,
            "an action that takes no row, posted to a row's route, is a 400": post(record, f"{path}/{row.n}/{make}").code == 400,
            "an action the row's state refuses is a 400": post(record, f"{path}/{row.n}/reopen", {"why": "back"}).code == 400,
        }
        refusal = run_route(record, type_, "read", "99")
        facts["a refusal over the run route is a 400 saying why, and a command that needs the user's own browser is a 409"] = \
            (refusal.code, refusal.body) == ((409, "browser is not a command the server runs") if type_ == "browser" else (400, f"! no {type_} 99\n"))
        if resource.required and type_ not in ("work", "board"):
            facts["creating without what the type needs is a 400"] = post(record, f"{path}/{make}").code == 400
        if "priority" in names:
            facts["a value the action refuses is a 400"] = post(record, f"{path}/{row.n}/priority", {"value": "urgentest"}).code == 400
        if "search" in names:
            facts["an action that takes no row, posted to a row's route, is a 400 that names its route"] = post(record, f"{path}/{row.n}/search", {"term": "x"}).code == 400
        if type_ != "browser":
            users, agents = run_route(record, type_, "read", str(row.n), actor=USER), run_route(record, type_, "read", str(row.n))
            facts["the actor is the one the query names, and the agent when it names none"] = (USER in row_of_reply(users)["seen"], AGENT in row_of_reply(agents)["seen"]) == (True, True)
        if titled(controller, make) and not resource.required and type_ not in ("work", "browser"):
            named, plugin = run_route(record, type_, make, "one"), run_route(record, type_, make, "two", plugin="clock")
            facts["a valid command is a 200"] = (named.code, plugin.code) == (200, 200)
            facts["the plugin the query names is the one the command runs as"] = row_of_reply(plugin)["data"].get("plugin") == "clock"
        reckon(wrong, type_, facts)
    assert wrong == {}, "every type answers a missing row with 404, a refusal with 400 in words, and never a 500"
    features.load()
    record = fresh()
    assert get(record, "/api/nowhere/todo").code == 404, "an environment that is not there is a 404"
    assert get(record, "/api/a\\b/todo").code == 404, "a name no environment folder could have is a 404"
    import cProfile
    from engine.timing import PROFILING
    PROFILING.raise_flag(record.root)
    assert get(record, "/api/{env}/todo").code == 200, "a request is answered while it is profiled"
    outer = cProfile.Profile()
    outer.enable()
    try:
        assert get(record, "/api/{env}/todo").code == 200, "a request that cannot be profiled while another profile runs is answered unprofiled"
    finally:
        outer.disable()
        PROFILING.lower_flag(record.root)
    assert post(record, "/api/{env}/nonsense/create").code == 404, "a type that is not there is a 404"
    assert post(record, "/api/{env}/work/start", {"title": "one"}).code == 201, "the first work starts"
    assert post(record, "/api/{env}/work/start", {"title": "two"}).code == 400, "an action the row's state refuses is a 400"


def test_the_command_line_refuses_in_words_and_exits_nonzero(monkeypatch):
    features.load()
    record = fresh()

    def ran(*argv: str) -> tuple[int, str]:
        err = io.StringIO()
        return run(["--root", str(record.root), "--env", record.env, *argv], out=io.StringIO(), err=err), err.getvalue()
    status, text = ran("todo", "all", "--force")
    assert {"exit": status, "names the reason": "takes the reason" in text} == {"exit": 1, "names the reason": True}, "--force without its reason exits 1 and says it takes one"
    status, text = ran("todo", "bogus")
    assert {"exit": status, "names the word": "invalid choice" in text or "bogus" in text} == {"exit": 2, "names the word": True}, "a word the noun does not have exits 2 and names it"
    status, text = ran("--as", "bogus", "todo", "all")
    assert {"exit": status, "names the actors": "choose from 'user', 'agent', 'system', 'plugin'" in text} == {"exit": 2, "names the actors": True}, \
        "an unknown actor exits 2 and names the actors there are"
    status, text = ran("--agent", "sub-1", "todo", "create", "a title")
    assert {"exit": status, "in words": text.startswith("! ")} == {"exit": 1, "in words": True}, f"a subagent that was never lent the environment is refused in words: {text}"
    assert CONTROLLERS["todo"](record, actor=SYSTEM).all() == [], "and nothing was written by the ran command"

    def answered(*argv: str) -> str:
        out = io.StringIO()
        run(["--root", str(record.root), "--env", record.env, *argv], out=out, err=io.StringIO())
        return out.getvalue()
    assert "in force" in answered("verify") and f"settings on {record.env}" in answered("settings"), "verify and settings answer without raising"
    assert "usage:" in answered("help") and "usage:" in answered("help", "todo") and "no command" in answered("help", "nonsense"), "help answers for the whole journal, for one noun and for a word it does not have"
    for noun, title in (("todo", "last line names it"), ("report", "a finding")):
        made = answered(noun, "create", title).strip().splitlines()
        assert made[-1] == f"{noun} {CONTROLLERS[noun](record, actor=SYSTEM).all()[-1].n}", f"creating a {noun} ends its output with one line naming what it made"
    assert answered("services", "list") != "", "services lists"
    assert ran("services", "bogus")[0] == 1, "a services word it does not know is refused in words"
    status, text = ran("secret", "run", "nosuch", "echo", "hi")
    assert {"exit": status, "in words": text.startswith("! ")} == {"exit": 1, "in words": True}, f"a word that takes a list of words reaches its controller and is refused in words, never a crash: {text}"
    from commands import queries
    from engine.services import Manager
    assert queries.attic_text(record, "never written anywhere").startswith("nothing in the removed environments mentions"), "an attic search with no hit says so"
    assert queries.transcript(record, "") == [], "a session never named has no transcript"
    monkeypatch.setattr(Manager, "tick", lambda self: (_ for _ in ()).throw(KeyboardInterrupt()))
    assert "the services are stopped" in answered("services", "up"), "services up keeps the plugins' services until Ctrl-C, then says they stopped"
    assert answered("browser", "driving").startswith("{"), "a word that answers with a mapping prints it whole"
    report(record, "working", "PreToolUse")
    assert "this session: working after PreToolUse" in answered("--session", "claude-1", "verify"), "verify names what the asking session last reported"
    Works(record, actor=AGENT).create("the work in hand")
    assert "the work in hand" in answered("open"), "open names the work in hand"
    plan = CONTROLLERS["plan"](record, actor=AGENT).create("a plan")
    CONTROLLERS["plan"](record, actor=AGENT).phase(plan.n, "first", when="it is done")
    assert ran("plan", "rephrase", str(plan.n), "1", "--checkpoint", "yes")[0] == 0 and CONTROLLERS["plan"](record, actor=AGENT).load(plan.n).phases[0]["checkpoint"], \
        "a yes-or-no option is read from the word"
    from commands.cli import captured
    helped, code = captured(["todo", "--help"], record.root)
    assert (code, "usage:" in helped) == (0, True), "help asked of the server's command line is printed and exits cleanly, never raising"


def test_no_command_argument_shares_a_name_with_a_global_option():
    features.load()
    top = parser()
    globals_ = {action.dest for action in top._actions if action.dest not in ("help", "_command")}
    clashes = [f"{group} {verb}: {action.dest}"
               for group, nouns in top._subparsers._group_actions[0].choices.items() if nouns._subparsers
               for verb, command in nouns._subparsers._group_actions[0].choices.items()
               for action in command._actions if action.dest in globals_]
    assert clashes == [], "a command's own argument never shares its name with a global option, which would swallow it"


BUDGET, PAGE, MANY = 50, 25, 150


def fastest(work, times: int = 3) -> float:
    took = []
    for _ in range(times):
        began = time.perf_counter()
        work()
        took.append((time.perf_counter() - began) * 1000)
    return min(took)


def test_every_listing_is_one_page_of_open_rows_inside_the_budget():
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
        ask = partial(get, record, f"/api/{{env}}/{type_}")
        got = ask().body
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
    CONTROLLERS["todo"](record, actor=USER).complete(3, "done")
    shut = dispatch("GET", f"/api/{record.env}/todo", record.root, {"last": "500", "closed": "1"}, {}).body
    assert 3 in [r["n"] for r in shut["rows"]] and all(r["completed"] for r in shut["rows"]), "a listing asked for closed rows returns only those, whatever else is open"


def test_a_row_is_changed_only_by_those_its_resource_names_for_its_author():
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
    assert guarded != [], "the agent answers what the user wrote and records what each part became"
    assert changed == [], "it never rewrites or deletes what the user wrote"


def test_project_rows_made_at_once_from_two_environments_never_share_a_number():
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
        for thread in runs:
            thread.start()
        for thread in runs:
            thread.join()
        assert len(made) == len(set(made)), f"{type_} rows made at once from two environments share a number: {sorted(made)}"
    first, second = Record(root, "east"), Record(root, "east")
    first.setting("boards", {}), second.setting("boards", {})
    first.change_setting("boards", {"orchestrating": True})
    second.change_setting("boards", {"columns": 3})
    assert Record(root, "east").setting("boards", {}) == {"orchestrating": True, "columns": 3}, \
        "two writers that each read a setting before the other wrote it both keep their change"


def test_every_type_with_its_own_word_for_create_is_created_over_http():
    features.load()
    record = fresh()
    renamed = [type_ for type_, resource in TYPES.items() if "create" in resource.command_names]
    answers = {type_: dispatch("POST", f"/api/{record.env}/{type_}", record.root, {}, {"title": f"a {type_} from the viewer", "brief": "why", **needed(type_)})
               for type_ in renamed}
    assert {type_: reply.code for type_, reply in answers.items()} == {type_: 400 if TYPES[type_].agent_only else 201 for type_ in renamed}, \
        "every type is created over http except those only the agent makes, which the server refuses"


def test_stopping_an_environment_asks_its_terminal_or_ends_the_process_that_holds_it():
    import sys
    from engine.seats import seat_file
    from engine.sessions import Sessions
    from engine.stop import session_flag
    from engine.stored import write_json
    record = fresh()
    places = Environments(record, actor=USER)
    sessions = Sessions(record.root)
    seated, outside, ghost = (places.create(name) for name in ("seated", "outside", "ghost"))
    sessions.write("in-a-terminal", environment="seated", provider="claude", pid=os.getpid())
    write_json(seat_file(record.root, "terminal-1"), {"at": time.time(), "report": {"title": "in-a-terminal"}})
    places.stop(seated.n)
    assert session_flag(record.root, "terminal-1").is_file(), "an agent in a journal terminal is asked to stop through it"
    child = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(30)"])
    try:
        sessions.write("on-its-own", environment="outside", provider="claude", pid=child.pid)
        places.stop(outside.n)
        assert child.wait(timeout=10) == -15, "an agent running on its own is ended through its process"
    finally:
        child.kill()
    from tests.kit import bound_to_this_run
    owner = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])
    bound = subprocess.Popen(bound_to_this_run([sys.executable, "-c", "import time; time.sleep(60)"], watched=owner.pid))
    try:
        owner.kill()
        owner.wait()
        assert bound.wait(timeout=15) is not None, "a server started for a test run ends once the run's process is gone, even when that process was killed"
    finally:
        bound.kill()
    sessions.write("unknown", environment="ghost", provider="claude", seen=time.time())
    assert "its process is not found" in refused(lambda: places.stop(ghost.n)), "an agent with no terminal and no process is left to end where it runs"
    from engine.seats import live, offline
    write_json(seat_file(record.root, "terminal-2"), {"at": time.time() - 100, "report": {"title": "gone-quiet"}})
    assert "last checked in 100s ago" in offline(record.root, "gone-quiet"), "a session whose terminal went quiet says how long ago it was heard"
    assert "gone-quiet" not in [agent.session for _, agent in live(record.root)], "and is not online"
    assert live(record.root, within=0.000001) == [], "a seat file older than the window is not read at all"


def test_an_update_check_asked_for_reads_the_newest_release_once_at_a_time(monkeypatch):
    from engine import runtime, upgrades
    record = fresh()
    monkeypatch.setattr(upgrades, "released", lambda repository=None: "v9.9.9")
    cache = runtime.upstream_cache(record.root)
    with upgrades.FETCHING:
        assert post(record, "/api/update/check").code == 200 and not cache.exists(), "a check asked for while another runs is not started twice"
    assert post(record, "/api/update/check").code == 200
    until = time.time() + 10
    while not cache.exists() and time.time() < until:
        time.sleep(0.05)
    with upgrades.FETCHING:
        assert cache.read_text() == "v9.9.9", "the check runs in the background and keeps the newest release it found"


def test_rows_and_help_shaped_for_the_viewer_are_kept_only_up_to_their_limit(monkeypatch):
    from features import format as formatting
    monkeypatch.setattr(formatting.SHAPED, "limit", 1)
    monkeypatch.setattr(formatting, "KEEP_CATALOGUES", 1)
    record, other = fresh(), fresh("other")
    for n in range(2):
        formatting.shaped(Todos(record, actor=SYSTEM).create(f"row {n}"), record)
    formatting.catalogue({}, record)
    formatting.catalogue({}, other)
    assert (len(formatting.SHAPED.held), len(formatting.CATALOGUES)) == (1, 1), "the oldest shapes give way, so memory never grows past the limit"


def test_a_listing_polled_since_a_moment_or_holding_a_damaged_row_still_answers():
    record = fresh()
    todos = Todos(record, actor=SYSTEM)
    kept, damaged = todos.create("kept"), todos.create("damaged")
    todos.path(damaged.n).write_text("not a row")
    listed = [row["n"] for row in get(record, "/api/{env}/todo").body["rows"]]
    since = [row["n"] for row in get(record, "/api/{env}/todo", since="1").body["rows"]]
    assert listed == since == [kept.n], "a row that no longer reads is left out of the listing, polled or not"


def test_no_environment_name_is_shadowed_by_a_global_route():
    features.load()
    fixed = {parts[2] for parts in (r.pattern.split("/") for r in ranked()) if parts[1] == "api" and len(parts) > 3 and not parts[2].startswith("{")}
    assert fixed <= ROUTED, f"environments named {sorted(fixed - ROUTED)} would be shadowed by a global route"


def test_an_action_is_marked_on_a_public_name_only():
    features.load()
    marked = {f"{type_} {name}" for type_, controller in CONTROLLERS.items()
              for name, fn in inspect.getmembers(controller, inspect.isfunction) if getattr(fn, "action", False) and name.startswith("_")}
    assert marked == set(), "an underscore name is a helper, never an action"


def test_unloading_the_features_empties_every_extension_point():
    features.load()
    try:
        features.unload()
        assert [extension for extension in EXTENSIONS if extension.entries] == [], "a feature leaves nothing behind once it is unloaded"
    finally:
        features.load()


def test_a_feature_row_marked_missing_is_found_again_and_a_switch_relayed_from_elsewhere_is_read():
    features.load()
    record = fresh()
    rows = CONTROLLERS["feature"](record, actor=SYSTEM)
    features.seat(record.root, environment_names(record.root))
    row = rows.rows.by_title("thinking")
    rows.update(row.n, missing=True)
    features.seat(record.root, environment_names(record.root))
    assert not rows.load(row.n).missing, "a feature that is there again is no longer marked missing"
    rows.update(row.n, enabled=False)
    features.passed(record.event_log.events()[-1], record)
    assert not features.FEATURES["thinking"].enabled(record), "a switch another process made is read when its event is relayed"
    from engine.reach import Unreached
    from features.base import Feature, FeatureDetails, Line
    from features.groups import Group

    class Careless(FeatureDetails):
        name, title, group = "careless", "Careless", Group.CHAT
        lines = (Line("A line", name="told", reach="main"),)
    with pytest.raises(Unreached):
        type("CarelessFeature", (Feature,), {"details": Careless})


def test_the_overview_counts_only_live_rows_and_splits_a_helper_environment_out():
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
    assert {"todos": counted["todos"], "messages": counted["messages"]} == {"todos": 1, "messages": 1}, \
        "an environment counts its open to-dos and its unread messages, never a closed or archived row"
    CONTROLLERS["question"](record, actor=AGENT).create("Which port should it use", options=[{"title": "8421"}, {"title": "8422"}], pick=1)
    assert environment(record)["attention"] == {"kind": "question", "text": "Which port should it use"}, "an open question asks for attention"
    CONTROLLERS["notice"](record, actor=SYSTEM).create("Allow Bash to remove the build folder", action="permission")
    assert environment(record)["attention"] == {"kind": "permission", "text": "Allow Bash to remove the build folder"}, "and a waiting permission prompt comes first"
    environments = Environments(record, actor=SYSTEM)
    environments.create("helped", owner="helper:1", kind=EnvironmentKind.HELPER)
    environments.create("plain")
    found = summarize(record.root)
    assert ([e["name"] for e in found["helpers"]], "helped" in [e["name"] for e in found["environments"]], "plain" in [e["name"] for e in found["environments"]]) == \
        (["helped"], False, True), "a helper's environment is listed with the helpers, not among the environments"


def riff(kind: bytes, body: bytes) -> bytes:
    return b"RIFF" + struct.pack("<I", 4 + 8 + len(body)) + b"WEBP" + kind + struct.pack("<I", len(body)) + body


def test_picture_dimensions_are_read_from_tiny_files(tmp_path):
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


def test_an_action_that_raises_restores_every_file_it_wrote_and_removes_every_file_it_made(tmp_path):
    kept, made = tmp_path / "kept.txt", tmp_path / "made.txt"
    kept.write_text("before")
    try:
        with undoable():
            for path in (kept, made):
                snapshot(path)
                path.write_text("during")
            raise RuntimeError("the action broke")
    except RuntimeError:
        pass
    assert (kept.read_text(), made.exists()) == ("before", False), "a failed action puts back the file it changed and removes the one it made"


def test_a_failed_attach_leaves_the_attached_file_and_its_description_as_they_were_for_every_type(tmp_path, monkeypatch):
    source = tmp_path / "note.txt"
    wrong = {}
    for type_, resource, record, controller in each_type():
        row = acting(type_, record, SYSTEM).create(f"a {type_} with a file", **needed(type_))
        write_text(source, "first")
        invoked(controller, "attach", (row.n, str(source), "the first"))
        write_text(source, "second")
        moves = []
        real = os.replace

        def failing(src, dst):
            moves.append(dst)
            if len(moves) == 2:
                raise OSError("the disk refused the move")
            real(src, dst)
        monkeypatch.setattr(files.os, "replace", failing)
        failure = refused(partial(controller.attach, row.n, str(source), "the second"))
        monkeypatch.undo()
        reckon(wrong, type_, {"the move fails": "the disk refused the move" in failure,
                              "the attached file and its description are as they were": ((controller.folder(row.n) / "note.txt").read_text(), controller.load(row.n).files) == ("first", {"note.txt": "the first"})})
    assert wrong == {}, "a failed move leaves the attached file and its description as they were"


def test_the_file_browser_and_its_search_leave_out_secrets_and_the_journal():
    repo = project_on("work")
    record, project = repo.record, repo.project
    (project / "src").mkdir()
    for name in ("src/app.py", "src/.env", ".env", "notes.txt"):
        (project / name).write_text("x")
    (record.root / "kept.txt").write_text("x")
    (project / "src" / "gone.py").symlink_to(project / "src" / "deleted.py")
    (project / "elsewhere").symlink_to(project.parent)
    names = [row["path"] for row in get(record, "/api/{env}/project-files").body]
    found = [row["path"] for q in (".env", "kept.txt", "app.py", "gone.py") for row in get(record, "/api/{env}/project-files/find", q=q).body]
    assert (sorted(names), found) == (["notes.txt", "shared.txt", "src"], ["src/app.py"]), "the listing and the search show project files, never a .env file, anything inside .journal, a broken link or a link out of the project"
    assert get(record, "/api/{env}/project-files", folder=".env").code == 400, "a secret cannot be opened by asking for it by name"
    from engine.paths import contained
    assert "leaves its folder" in refused(lambda: contained(project, "elsewhere")), "a name that links out of its folder is never followed"
    assert get(record, "/api/{env}/commit/" + "a" * 40).code == 404, "a commit the project does not hold is a 404"
    (project / "fresh.txt").write_text("new\n")
    assert "+new" in dispatch("GET", f"/api/{record.env}/diff", record.root, {"path": "fresh.txt"}, {}).body["diff"], "a file git does not track yet shows whole, as added"


def test_trimming_the_event_log_keeps_what_a_lagging_reader_has_not_yet_read():
    record = fresh()
    for n in range(10):
        CONTROLLERS["todo"](record, actor=SYSTEM).create(f"row {n}")
    ids = [event.id for event in record.event_log.events()]
    behind = ids[2]
    record.event_log.set_cursor_text("slow", str(behind))
    dropped = record.event_log.trim(keep=4, readers_since=0)
    assert (dropped, [e.id for e in record.event_log.events()]) == (ids.index(behind + 1), ids[ids.index(behind + 1):]), \
        "a reader's cursor holds the trim back, so every event after it survives"
    record.event_log.set_cursor_text("slow", "")
    record.event_log.trim(keep=4, readers_since=0)
    assert [e.id for e in record.event_log.events()] == ids[-4:], "with no reader behind, the log is cut to the number kept"


def test_the_event_log_reads_back_past_the_events_it_holds_in_memory(monkeypatch):
    import engine.event_log as event_log
    record = fresh()
    log = record.event_log
    assert (log.trim(keep=4, readers_since=0), log.events()) == (0, []), "a log with no file yet has nothing to trim or read"
    log.file.write_text("")
    assert log.back() == [], "an empty log reads back as nothing"
    for n in range(6):
        CONTROLLERS["todo"](record, actor=SYSTEM).create(f"row {n}")
    ids = [event.id for event in log.events()]
    monkeypatch.setattr(event_log, "KEPT_EVENTS", 3)
    event_log.RECENT.clear()
    assert [e.id for e in log.events(since=ids[0])] == ids[1:], "a reader behind the window held in memory reads the rest from the file"
    assert [e.id for e in log.events(since=ids[0], last=4)] == ids[-4:], "and reads no more of the latest than it asked for"


def each_type():
    features.load()
    for type_, resource in TYPES.items():
        record = fresh(type_[:2])
        yield type_, resource, record, CONTROLLERS[type_](record, actor=SYSTEM)


def acting(type_: str, record, actor: str):
    return CONTROLLERS[type_](record, actor=actor, force="a test makes many rows of a type that opens one at a time" if type_ == "work" else "")


def reckon(wrong: dict, type_: str, facts: dict) -> None:
    lapsed = [name for name, held in facts.items() if not held]
    if lapsed:
        wrong[type_] = lapsed


def test_a_row_of_every_type_moved_to_another_environment_keeps_its_words_and_file_and_leaves_an_archived_original(tmp_path):
    source = tmp_path / "note.txt"
    source.write_text("kept")
    wrong = {}
    for type_, resource, record, controller in each_type():
        if type(controller).move is not Controller.move:
            continue
        users = acting(type_, record, USER)
        row = acting(type_, record, SYSTEM if resource.agent_only else USER).create(f"a {type_} to carry", brief="the brief", **needed(type_))
        users.attach(row.n, str(source))
        moved = users.move(row.n, "west")
        there = CONTROLLERS[type_](Record(record.root, "west"), actor=USER)
        whys = [e.data["why"] for e in record.event_log.events() if e.type == type_ and e.action == "deleted" and e.n == row.n]
        reckon(wrong, type_, {
            "words": (there.load(moved.n).title, there.load(moved.n).brief) == (row.title, row.brief),
            "file": (there.folder(moved.n) / "note.txt").read_text() == "kept",
            "archived": (users.load(row.n).deleted > 0, whys) == (True, [f"moved to west as {type_} {moved.n}"]),
        })
    assert wrong == {}, "the moved row keeps its words and its file, and the original is archived with where it went"


def test_a_row_of_every_type_made_twice_in_ten_seconds_is_one_row_unless_the_words_author_or_target_differ_for_every_type_that_deduplicates():
    wrong = {}
    for type_, resource, record, controller in each_type():
        if not resource.deduplicates:
            continue
        users, agents = (acting(type_, record, who) for who in (USER, AGENT))
        first = users.create("same words", brief="same brief", **needed(type_))
        again = users.create("same words", brief="same brief", **needed(type_))
        facts = {
            "same words": again.n == first.n,
            "other author": agents.create("same words", brief="same brief", **needed(type_)).n != first.n,
            "other brief": users.create("same words", brief="other brief", **needed(type_)).n != first.n,
        }
        about = users.create("same note", about="todo:1", **needed(type_))
        facts["same target"] = users.create("same note", about="todo:1", **needed(type_)).n == about.n
        facts["other target"] = users.create("same note", about="todo:2", **needed(type_)).n != about.n
        facts["other author of the target"] = agents.create("same note", about="todo:1", **needed(type_)).n != about.n
        if "idempotency" in resource.fields:
            keyed = users.create("keyed", idempotency="a", **needed(type_))
            facts["same key"] = users.create("keyed", idempotency="a", **needed(type_)).n == keyed.n
            facts["other key"] = users.create("keyed", idempotency="b", **needed(type_)).n != keyed.n
        reckon(wrong, type_, facts)
    assert wrong == {}, "the same author and words are one row for a type that deduplicates, and another author, brief, target or key is a new one"


def other_than(field_, choices: dict):
    held = field_.default() if callable(field_.default) else field_.default
    if field_.name in choices:
        return next(choice for choice in choices[field_.name] if choice != held)
    if type(held) is int:
        return held + 1
    return {bool: not held, str: "todo.created", dict: {"a": 1}, list: ["a"], type(None): "set"}[type(held)]


def test_a_row_of_every_type_that_ships_with_the_journal_refuses_removal_and_new_words_but_keeps_its_progress_open():
    wrong = {}
    for type_, resource, record, controller in each_type():
        if "system" not in resource.fields:
            continue
        shipped = controller.create(f"a shipped {type_}", **needed(type_), system=True)
        users = CONTROLLERS[type_](record, actor=USER)
        facts = {f"refuses a change by {name}": "ships with the journal" in refused(change) for name, change in (
            ("delete", partial(users.delete, shipped.n)), ("complete", partial(users.complete, shipped.n, how="done")),
            ("title", partial(users.update, shipped.n, title="another")), ("brief", partial(users.update, shipped.n, brief="another")))}
        progress = {"kept": True, **{name: {"a": {}} for name in resource.progress}}
        users.stamp(shipped.n, **progress)
        facts["keeps its kept and progress fields changeable"] = {name: users.load(shipped.n).data[name] for name in progress} == progress
        for field_ in resource.data_fields:
            if field_.name not in (*progress, "system"):
                facts[f"refuses {field_.name}, a field outside progress"] = "ships with the journal" in refused(partial(users.stamp, shipped.n, **{field_.name: other_than(field_, resource.choices)}))
        reckon(wrong, type_, facts)
    assert wrong == {}, "a shipped row refuses a change by name, removal or closing, still lets kept and its progress change, and refuses any other field"


def test_closing_reopening_restoring_and_deleting_a_row_of_every_type_refuse_what_the_row_cannot_do():
    wrong = {}
    for type_, resource, record, controller in each_type():
        if type_ == "environment":
            continue
        row = acting(type_, record, SYSTEM).create(f"a {type_} to close", **needed(type_))
        controller.complete(row.n, how="done")
        twice = refused(partial(controller.complete, row.n, how="again"))
        facts = {"closing a closed row twice leaves it as it was": controller.load(row.n).outcome == "done",
                 "closing a closed row twice is refused": "already closed" in twice if type(controller).complete is Controller.complete else True}
        controller.delete(row.n, why="gone")
        facts["an archived row cannot be reopened"] = "archived" in refused(partial(controller.reopen, row.n, why="back"))
        controller.restore(row.n)
        facts["a restored row keeps its closed state, so it reopens once"] = refused(partial(controller.reopen, row.n, why="back")) == ""
        facts["and then refuses as not closed again"] = f"not {controller.named('complete')}" in refused(partial(controller.reopen, row.n, why="again"))
        open_row = acting(type_, record, SYSTEM).create(f"an open {type_}", **needed(type_))
        facts["an open row cannot be reopened"] = f"not {controller.named('complete')}" in refused(partial(controller.reopen, open_row.n, why="back"))
        if resource.lists_completed_unread:
            users = acting(type_, record, USER)
            unread = users.create(f"a {type_} the user wrote", brief="why", **needed(type_))
            facts["the user's own row is seen by the user"] = USER in users.load(unread.n).seen
            acting(type_, record, AGENT).complete(unread.n, how="closed by the agent")
            facts["a row listed as completed-unread loses the user's seen mark when the agent closes it"] = USER not in users.load(unread.n).seen
        reckon(wrong, type_, facts)
    assert wrong == {}, "closing twice, reopening an archived or open row and restoring each behave the same for every type"


def test_finding_a_row_of_every_type_by_title_takes_an_exact_title_or_number_and_refuses_a_shared_prefix():
    wrong = {}
    for type_, resource, record, controller in each_type():
        maker = acting(type_, record, SYSTEM)
        one, two = maker.create("tidy the shelves", **needed(type_)), maker.create("tidy the garden", **needed(type_))
        shared = commonprefix([one.title, two.title]).strip()
        reckon(wrong, type_, {
            "a title and a number each load their row": (controller.find(one.title).n, controller.find(str(two.n)).n) == (one.n, two.n),
            "a shared prefix refuses and asks for more": "say more of the title" in refused(partial(controller.find, shared)),
            "a title nothing has refuses in words": f"no {noun(0, type_)} match" in refused(partial(controller.find, "nothing like it")),
        })
    assert wrong == {}, "every type finds a row by its exact title or number, and refuses what it cannot tell apart"


def test_linking_twice_keeps_one_ref_unlinking_removes_it_and_superseding_closes_the_old_row_for_every_type():
    wrong = {}
    for type_, resource, record, controller in each_type():
        if type_ == "environment":
            continue
        maker = acting(type_, record, SYSTEM)
        one, two = maker.create("one", **needed(type_)), maker.create("two", **needed(type_))
        target, born = f"{type_}:{two.n}", controller.load(one.n).refs
        controller.link(one.n, target)
        controller.link(one.n, target)
        facts = {"linking twice keeps one ref, and the target finds its linker": (controller.load(one.n).refs, [r.n for r in controller.linked_to(target)]) == ([*born, target], [one.n])}
        controller.unlink(one.n, target)
        facts["unlinking removes the ref from the row and from linked_to"] = (controller.load(one.n).refs, controller.linked_to(target)) == (born, [])
        old = maker.create("the old row", **needed(type_))
        new = maker.create("the new row", supersedes=old.n, **needed(type_))
        facts["superseding closes the old row with where it went and links the new one to it"] = (
            controller.load(old.n).completed > 0, f"{type_}:{old.n}" in controller.load(new.n).refs, controller.load(old.n).outcome) == (True, True, f"superseded by {type_} {new.n}")
        facts["the second row keeps its number"] = two.n == one.n + 1
        if "supersede" in actions(type(controller)):
            older = maker.create("an older row", **needed(type_))
            newer = maker.create("a newer row", **needed(type_))
            controller.supersede(older.n, newer.n)
            facts["the supersede word closes the old row with where it went and links the new one to it"] = (
                controller.load(older.n).completed > 0, f"{type_}:{older.n}" in controller.load(newer.n).refs, controller.load(older.n).outcome) == (True, True, f"superseded by {type_} {newer.n}")
        reckon(wrong, type_, facts)
    assert wrong == {}, "links and supersession behave the same for every type"


def test_pruning_deletes_old_closed_rows_with_a_reason_and_placing_and_waiting_refuse_what_is_not_there_for_every_type_that_has_them():
    wrong = {}
    for type_, resource, record, controller in each_type():
        names = actions(type(controller))
        if "prune" not in names:
            continue
        old, recent, open_row = (controller.create(title, **needed(type_)) for title in ("old", "recent", "still open"))
        controller.complete(old.n, how="done")
        controller.complete(recent.n, how="done")
        stale = controller.load(old.n)
        stale.completed = time.time() - 40 * 86400
        controller.rows.persist(stale)
        facts = {"prune takes only the rows closed longer ago than the days": [r.n for r in controller.prune(days=30)] == [old.n]}
        reasons = [e.data["why"] for e in record.event_log.events() if e.type == type_ and e.action == "deleted"]
        facts["the pruned row is archived with a reason and the others stay"] = (reasons, [r.n for r in controller.all(completed=True)]) == (["pruned after 30 days"], [recent.n, open_row.n])
        if "place" in names:
            facts["placing before a closed row is refused"] = "not in the same column" in refused(partial(controller.place, open_row.n, recent.n))
            high = controller.create("high", **needed(type_))
            controller.priority(high.n, "high")
            controller.place(open_row.n, high.n)
            facts["placing before a row puts the row in that row's column"] = controller.load(open_row.n).priority == controller.load(high.n).priority
        if "after" in names:
            facts["waiting on a row that is not there is refused in words"] = f"no {type_} 99" in refused(partial(controller.after, open_row.n, "99"))
            facts["a row cannot wait on itself"] = "wait on itself" in refused(partial(controller.after, open_row.n, str(open_row.n)))
        reckon(wrong, type_, facts)
    assert wrong == {}, "pruning, placing and waiting behave as they say for every type that has them"


def test_a_field_given_the_wrong_type_is_refused_in_words_and_nothing_is_stored():
    features.load()
    wrong = {}
    for type_, resource in TYPES.items():
        record = fresh(type_[:2])
        controller = CONTROLLERS[type_](record, actor=SYSTEM)
        row = controller.create(f"a {type_} to change", **needed(type_))
        for name, spec in resource.fields.items():
            mistyped = "wrong" if isinstance(spec, dict) else {"wrong": "type"}
            refusal = refused(partial(controller.update, row.n, **{name: mistyped}))
            if not refusal or controller.load(row.n).data.get(name) == mistyped:
                wrong.setdefault(type_, []).append(name)
    assert wrong == {}, "every field of every type refuses a value of the wrong type, and stores nothing"
    assert "options.title is required" in refused(partial(normalize_options, [{"description": "no title"}])), "an option without a title is refused"
    assert normalize_options([{"label": "Yes", "value": "y"}, "plain"]) == [{"title": "Yes", "code": "y"}, "plain"], \
        "an option's label and value become its title and code, and a plain word stays"


def environment_rows(root, env: str) -> dict:
    there = Record(root, env)
    held = {controller.resource.type: [row["n"] for row in controller(there, actor=SYSTEM).rows.summaries()]
            for controller in CONTROLLERS.values() if controller.resource.scope == ENVIRONMENT}
    return {type_: numbers for type_, numbers in held.items() if numbers}


def test_renaming_an_environment_moves_the_rows_of_every_type_and_refuses_a_folder_that_holds_rows():
    features.load()
    record = fresh()
    environments = CONTROLLERS["environment"](record, actor=SYSTEM)
    old, other = environments.create("old"), environments.create("other")
    for type_, controller in CONTROLLERS.items():
        if controller.resource.scope == ENVIRONMENT and type_ != "environment":
            acting(type_, Record(record.root, "old"), SYSTEM).create(f"a {type_} that travels", **needed(type_))
    travelling = environment_rows(record.root, "old")
    seeded = record.root / "environments" / "new" / "feature"
    seeded.mkdir(parents=True)
    (seeded / "001.md").write_text("a seeded row")
    environments.rename(old.n, "new")
    assert environment_rows(record.root, "new") == travelling, "renaming onto a seeded folder moves the rows of every type over it"
    assert (not (record.root / "environments" / "old").exists(), len(list((record.root / "attic").glob("new-seed-*.tar.gz")))) == (True, 1), \
        "the old folder is gone and what the seeded folder held is packed in the attic"
    with tarfile.open(next((record.root / "attic").glob("new-seed-*.tar.gz"))) as packed:
        assert any(name.endswith("feature/001.md") for name in packed.getnames()), "the packed seed holds its row"
    CONTROLLERS["todo"](Record(record.root, "plain"), actor=SYSTEM).create("a row already here")
    assert "already holds rows" in refused(partial(environments.rename, other.n, "plain")), "a folder that holds real rows is never written over"
    assert "exists" in refused(partial(environments.rename, other.n, "new")), "a name another environment has is refused"


def test_sweeping_an_environment_packs_every_swept_row_of_every_type_into_the_attic_and_keeps_the_open_ones():
    features.load()
    record = fresh()
    environments = CONTROLLERS["environment"](record, actor=SYSTEM)
    env = environments.create("busy")
    there = Record(record.root, "busy")
    closed, open_rows = {}, {}
    for type_, controller in CONTROLLERS.items():
        if controller.resource.scope != ENVIRONMENT or type_ in KEPT:
            continue
        rows = acting(type_, there, SYSTEM)
        ended, left = rows.create(f"a closed {type_}", **needed(type_)), rows.create(f"an open {type_}", **needed(type_))
        rows.complete(ended.n, how="done")
        closed[type_], open_rows[type_] = ended.n, left.n
    held = environment_rows(record.root, "busy")
    assert "--yes sweeps" in environments.sweep(env.n), "without --yes a sweep only says what it would do"
    assert environment_rows(record.root, "busy") == held, "the sweep without --yes removes nothing"
    environments.sweep(env.n, yes=True)
    after = environment_rows(record.root, "busy")
    standing = {type_: [n] for type_, n in open_rows.items() if type_ not in SWEPT}
    assert {type_: [n for n in after.get(type_, []) if n in (open_rows[type_], closed[type_])] for type_ in open_rows} == {**{type_: [] for type_ in open_rows}, **standing}, \
        "the closed rows and every row of a swept type are swept and the open rows stay"
    with tarfile.open(next((record.root / "attic").glob("busy-swept-*.tar.gz"))) as packed:
        packed_types = sorted({name.split("/")[-2] for name in packed.getnames() if name.endswith(".md")})
    assert packed_types == sorted(closed), "every swept row is in the attic"
    assert "nothing to sweep" in environments.sweep(env.n, yes=True), "sweeping again finds nothing"


def written_elsewhere(controller, n: int, title: str) -> None:
    row = controller.load(controller.rows.numbers()[0])
    row.n, row.title = n, title
    write_text(controller.path(n), row.dump())


def listed(controller) -> dict:
    return {row.n: row.title for row in controller.all(last=0)}


def test_a_row_of_every_type_written_behind_the_stores_back_shows_up_in_lists_fresh_stale_or_in_bulk(monkeypatch):
    wrong = {}
    for type_, resource, record, controller in each_type():
        first = acting(type_, record, SYSTEM).create("the first row", **needed(type_))
        base = max(controller.rows.numbers()) + 1
        facts = {"the list is warm before another process writes": first.n in listed(controller)}
        written_elsewhere(controller, base, "written by another process")
        facts["a new row file shows up while the stamps are fresh"] = listed(controller).get(base) == "written by another process"
        written_elsewhere(controller, first.n, "edited by another process")
        monkeypatch.setattr(stored, "STAMPS_FRESH", 0.0)
        facts["an edited row file shows once the stamps are stale"] = listed(controller).get(first.n) == "edited by another process"
        monkeypatch.setattr(stored, "FLUSH_ROWS", 5)
        bulk = range(base + 1, base + 8)
        for n in bulk:
            written_elsewhere(controller, n, f"bulk row {n}")
        facts["a bulk of rows past the flush count all show up"] = {n: f"bulk row {n}" for n in bulk}.items() <= listed(controller).items()
        facts["a bulk past the flush count is written to the index"] = {first.n, base, *bulk} <= {int(n) for n in read_json(controller.rows.folder() / stored.INDEX, dict, {})}
        monkeypatch.undo()
        monkeypatch.setattr(stored, "STAMPS_RENEW", 0.0)
        listed(controller)
        written_elsewhere(controller, first.n, "edited once more")
        stored.renew_stamps()
        facts["an edit shows after the server renews the stamps, with no listing paying for it"] = listed(controller).get(first.n) == "edited once more"
        monkeypatch.undo()
        reckon(wrong, type_, facts)
    assert wrong == {}, "a row written by another process shows up in lists for every type"


def test_search_finds_a_row_of_every_type_by_its_words_and_sees_an_edit_that_kept_its_updated_stamp(monkeypatch):
    monkeypatch.setattr(stored, "STAMPS_FRESH", 0.0)
    wrong = {}
    for type_, resource, record, controller in each_type():
        row = acting(type_, record, SYSTEM).create("alpha", **needed(type_))
        found = [t.n for t in controller.search(row.title)]
        edited = controller.load(row.n)
        edited.title = "omega"
        write_text(controller.path(row.n), edited.dump())
        facts = {"search finds a row by its words": row.n in found,
                 "search finds the new words after an edit that kept the same updated stamp": row.n in [t.n for t in controller.search("omega")],
                 "and not the old": row.n not in [t.n for t in controller.search(row.title)]}
        reckon(wrong, type_, facts)
    assert wrong == {}, "search follows an edit even when the updated stamp did not move"


def multipart_files(*files: tuple[str, str]) -> dict:
    boundary = "walked"
    raw = "".join(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\n\r\n{text}\r\n' for name, text in files)
    return {"_raw": f"{raw}--{boundary}--\r\n".encode(), "_type": f"multipart/form-data; boundary={boundary}"}


def test_an_upload_and_the_file_route_stay_inside_the_rows_folder_for_every_type():
    wrong = {}
    for type_, resource, record, controller in each_type():
        row = acting(type_, record, SYSTEM).create(f"a {type_} with files", **needed(type_))
        base = f"/api/{{env}}/{type_}/{row.n}"
        uploaded = post(record, f"{base}/upload", multipart_files(("a.txt", "one"), ("b.txt", "two")))
        attached = sorted(controller.load(row.n).files)
        reckon(wrong, type_, {
            "a two-part upload answers both file names": (uploaded.code, uploaded.body["files"]) == (200, ["a.txt", "b.txt"]),
            "an attached file is served back": (get(record, f"{base}/files/b.txt").code, get(record, f"{base}/files/b.txt").body) == (200, b"two"),
            "a name that climbs out of the folder is refused": get(record, f"{base}/files/..%2Fx").code == 400,
            "detaching a name outside the folder is refused": post(record, f"{base}/detach", {"name": "../x"}).code == 400,
            "a refused call leaves the attached files as they were": sorted(controller.load(row.n).files) == attached == ["a.txt", "b.txt"],
        })
    assert wrong == {}, "an upload and the file route stay inside the row's folder for every type"


def test_no_chip_marker_is_kept_in_a_row_of_any_type_or_reaches_a_command_or_a_nudge():
    marked = "see [[chip todo:1|to-do 1]] and [[file src/a.py|a.py]]"
    leaked, record = {}, fresh("ch")
    features.load()
    for type_ in TYPES:
        controller = CONTROLLERS[type_](record, actor=SYSTEM)
        fields = {name: "a title" if name == "title" else marked for name in TYPES[type_].required}
        try:
            row = controller.create("a title", abstract=marked, brief=marked, **fields)
        except Refused:
            continue
        for step in (lambda: controller.section(row.n, "a part", marked), lambda: controller.complete(row.n, how=marked)):
            try:
                step()
            except Refused:
                pass
        shown = []
        for words in ([type_, "show", str(row.n)], [type_, "all"], ["carry"], ["status"], ["search", "see"]):
            out = io.StringIO()
            try:
                run(["--root", str(record.root), "--env", record.env, *words], out=out, err=io.StringIO())
            except SystemExit:
                pass
            shown.append(out.getvalue())
        shown += [(n.title or "") + (n.brief or "") for n in Nudges(record).all()]
        shown += [path.read_text() for path in record.home.rglob("*") if path.is_file() and path.suffix in (".json", ".md")]
        if any("[[" in text for text in shown):
            leaked[type_] = True
    assert leaked == {}, "a marker the viewer made is stripped where a row is saved, in every text field it has, so no agent ever reads one"
