"""Outside the default run, since it loads the saved full project: the commit gate runs it before each commit. Every route the server registers, each list with its list parameters, every hook kind as the agent orchestrates, the commands an agent runs on its plan and those it runs as its session starts, and a settings save of a whole group, are generated from the router, the hook kinds and the saved full project (tests/full_project.py) and answered in-process against it, counting points, not time: a row loaded, a write and a started kilobyte loaded are a point each, and any answer over its 30 points fails the run, whatever the machine is doing. An answer a live journal gives after the rows it reads were written is counted against a cold cache, as it is there: a hook, a list's change read, a read the viewer polls, a list it reads whole as a page opens and a command run as a session starts."""

import json
import math
import time
from dataclasses import replace
from pathlib import Path

import pytest

from journal.app import App
from journal.features.workers.workers_options import WorkersOptions
from journal.db.connection import Connection
from journal.features.faults.support.request_time_recorder import UNMEASURED_PATHS, RequestTimeRecorder
from journal.models.support.request_loads import RequestLoads
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.plans import Plans
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.load_tally import LoadTally
from journal.http.controllers.controller import Controller
from journal.http.router import Router
from journal.http.support.identity import Identity
from journal.http.support.json_out import JsonOut
from journal.http.support.request_reading import RequestReading
from journal.http.support.route import Route
from journal.support.actor import Actor
from journal.support.hook_type import HookType
from journal.support.response import Response
from tests.full_project import unpacked
from tests.user_settings import user_set
from tests.in_process import get_answer

MAIN = {"X-Journal-Env": "main"}
JSON, RAW = "application/json", "application/octet-stream"
HOOK_PATH = "/hooks/claude"
SPARE_ENVIRONMENT = 2
# routes that leave the process: they ask the team server, the tunnel program, the supervisor or the network, run a program, or never end; each is named here with why, and one no longer registered fails the run
LEFT_OUT = {
    "POST /hooks/{agent}": "timed once per hook kind instead",
    "GET /journal/entries/stream": "a stream that answers until the viewer leaves",
    "POST /shell/run": "runs a shell command",
    "POST /journal/updates": "fetches and installs an update",
    "POST /journal/phones/connect": "asks the team server",
    "POST /journal/environments/{id}/launch": "starts an agent through the supervisor",
    "POST /journal/environments/{id}/stop": "stops an agent through the supervisor",
    "POST /journal/agents/{id}/shell": "types into the agent's terminal through the supervisor",
    "POST /journal/agents/{id}/control": "types into the agent's terminal through the supervisor",
    "POST /journal/workers/{id}/send": "starts the worker's program",
    "POST /journal/workers/{id}/merge": "merges the worker's branch with git",
    "POST /journal/checks/{id}/run": "runs the check's command",
    "POST /journal/secrets/{id}/login": "opens a login window",
    "POST /journal/plugins/{id}/upgrade-preview": "fetches the plugin's source",
    "POST /journal/plugins/{id}/purge": "deletes the plugin's folders",
    "POST /journal/tunnel/check": "runs the tunnel program",
    "POST /journal/tunnel/restart": "runs the tunnel program",
    "POST /journal/tunnel/login": "runs the tunnel program",
    "POST /journal/tunnel/logout": "runs the tunnel program",
    "POST /journal/tunnel/install": "downloads the tunnel program",
    "POST /journal/tunnel/update": "downloads the tunnel program",
    "POST /journal/tunnel/release": "runs the tunnel program",
    "POST /journal/tunnel/readdress": "runs the tunnel program",
    "POST /journal/mcp/install": "installs an MCP server",
    "POST /journal/mcp/check": "starts an MCP server",
    "POST /journal/mcp/{name}/key": "writes an MCP server's configuration",
    "POST /journal/mcp/{name}/remove": "writes an MCP server's configuration",
    "POST /journal/mcp/{name}/sign-in": "signs in to an MCP server",
    "POST /journal/mcp/{name}/callback": "signs in to an MCP server",
}
PARAMETERS = {"id": "1", "table": "tasks", "name": "journal", "provider": "claude", "session": "s1", "key": "k", "job": "j"}
# the body a route needs to do its work, the shim's own words and environment for the command routes; every other write is sent an empty one
BODIES = {"/cli": (JSON, json.dumps({"argv": ["task", "list"], "env": "main", "session": None}).encode()), "/cli/run": (RAW, b"JOURNAL_ENV=main\0\0task\0list\0")}
EMPTY = (JSON, b"{}")
# a change read asks for the rows changed since the run began, as a poll right after the last read does
LIST_PARAMETERS = ("limit=50", "closed=1", "before=1000", "after=1", "since={since}", "ids=1,2,3")
# writes that take a row away run last, so every other route still finds the rows it names
LAST_ACTS = ("/delete", "/remove", "/purge", "/sign-out", "/disconnect")
GET_TRIES = 3
# a list's change read is sent when the timeline says a row of its table changed, so it always finds the table written since its last read
CHANGE_READ = "since="
# reads the viewer polls over rows written between two polls, counted against a cold cache, each with why
POLLED = {"GET /journal/bar": "polled every half second while the agent works, over the entries every hook writes"}
# lists the viewer reads whole when a page or the chat opens, seldom enough that the cache has long let their rows go, counted against a cold cache, each with why
OPENED = {"GET /journal/docs": "read when the library opens", "GET /journal/reports": "read when the reports open", "GET /journal/notices": "read when the chat opens, for the pins above it",
          "GET /journal/reactions": "read when the chat opens, for the emoji on its messages"}
# a shell call as the agent makes them, and what one prints; the viewer polls the timeline every second, so a turn of a few calls lies between two polls
SHELL_CALL = {"tool_name": "Bash", "tool_input": {"command": "grep -rn parser src"}}
# the worktree folder of a worker of the full project whose work was merged
WORKTREE = "6-Worker-6"
SHELL_OUTPUT = "\n".join(f"src/parser.py:{line}: the parser reads the header row of the table and the footer" for line in range(40))
TURN_SHELL_CALLS = 3
# the plan the full project has started, its first task in the agent's hand
STARTED_PLAN = 1
# the hooks are answered as the agent orchestrates, the mode whose listeners read the most: its workers, its load, its suite runs and what it never acted on
ORCHESTRATOR = "orchestrator"
# a row loaded, a write and a started kilobyte loaded are a point each, whatever the machine is doing
POINTS_BUDGET = 30
# the answers that spent more than the budget when the gate was made, each with what it spent then: none may spend more,
# each is brought down to the budget; a run that finds no file writes it, so deleting it takes the new points once one has come down;
# each is kept three over what it spent, rounded up to five, since the bytes an answer loads vary by a few with the timings its entries record
BASELINE = Path(__file__).with_name("route_points_baseline.json")
MISSING = not BASELINE.is_file()


@pytest.fixture
def full_project(tmp_path: Path):
    app = unpacked(tmp_path)
    yield app
    app.runtime().stop()


def key(route: Route) -> str:
    return f"{route.method} {route.pattern}"


def is_left_out(route: Route) -> bool:
    return route.outward or key(route) in LEFT_OUT or route.pattern.startswith(UNMEASURED_PATHS) or RequestTimeRecorder.is_outward(route.pattern.replace("{id}", "{n}"))


def is_list(route: Route) -> bool:
    return getattr(route.handler, "__name__", "") == "index" and isinstance(getattr(route.handler, "__self__", None), Controller)


def path(route: Route) -> str:
    filled = route.pattern.replace("/environments/{id}", f"/environments/{SPARE_ENVIRONMENT}")
    for name, value in PARAMETERS.items():
        filled = filled.replace(f"{{{name}}}", value)
    return filled


def cases(app: App) -> list[tuple[str, str, tuple[str, bytes]]]:
    """Every route not left out, as the method, a path that names a row of the full project and a harmless body: each read and each list with its list parameters first, then each write, the ones that take a row away last."""
    timed = [route for route in app.container.get(Router).routes if not is_left_out(route)]
    reads = [("GET", path(route), EMPTY) for route in timed if route.method == "GET"]
    lists = [("GET", f"{path(route)}?{parameter.format(since=time.time())}", EMPTY) for route in timed if is_list(route) for parameter in LIST_PARAMETERS]
    writes = sorted((route for route in timed if route.method == "POST"), key=lambda route: route.pattern.endswith(LAST_ACTS))
    return [*reads, *lists, *(("POST", path(route), BODIES.get(route.pattern, EMPTY)) for route in writes)]


def hook_bodies() -> dict[HookType, dict]:
    call = {"tool_name": "Read", "tool_input": {"file_path": "src/parser.py"}}
    return {HookType.SESSION_START: {}, HookType.USER_PROMPT: {"prompt": "the footer next"}, HookType.PRE_TOOL_USE: call, HookType.POST_TOOL_USE: {**call, "tool_response": ""},
            HookType.POST_TOOL_USE_FAILURE: {**call, "error": "no such file"}, HookType.PRE_COMPACT: {}, HookType.STOP: {}, HookType.STOP_FAILURE: {"error": "rate_limit", "last_assistant_message": "limit reached"},
            HookType.SUBAGENT_START: {"agent_id": "a1", "agent_type": "Explore"}, HookType.SUBAGENT_STOP: {"agent_id": "a1", "agent_type": "Explore", "last_assistant_message": "found it"},
            HookType.MESSAGE_DISPLAY: {"message": "The parser is written."}, HookType.SESSION_END: {"reason": "other"}}


def answer_loads(app: App, method: str, target: str, body: tuple[str, bytes]) -> RequestLoads:
    """The rows, bytes and writes the journal's own router spends answering, the answer written as the server writes it; the deferred listeners then run uncounted, so each request starts with the worker thread idle."""
    type_name, raw = body
    request = RequestReading.read(RequestReading.head(method, target, {**MAIN, "Content-Type": type_name}), raw if method == "POST" else b"", app.container.get(Identity))
    LoadTally.begin()
    answer = app.container.get(Router).route(request)
    if isinstance(answer, Response):
        JsonOut.encoded(answer.body)
    loads = LoadTally.ended()
    app.runtime().deferred.drain()
    return loads


def cold_loads(app: App, method: str, target: str, body: tuple[str, bytes]) -> RequestLoads:
    """The same against a cold cache, as an answer finds it once the rows it reads were written."""
    app.container.get(Connection).cache.cleared()
    return answer_loads(app, method, target, body)


def is_cold(method: str, target: str) -> bool:
    return CHANGE_READ in target or f"{method} {target}" in POLLED or f"{method} {target}" in OPENED


def least_loads(app: App, method: str, target: str, body: tuple[str, bytes]) -> RequestLoads:
    """A read's least of its tries after the first, which loads a cold cache, each try cold for a read a live journal answers after a write; a write once, since a second would change what it finds."""
    if method == "POST":
        return answer_loads(app, method, target, body)
    tried = cold_loads if is_cold(method, target) else answer_loads
    answer_loads(app, method, target, body)
    return min((tried(app, method, target, body) for _ in range(GET_TRIES)), key=RequestLoads.points)


def allowed(name: str) -> int:
    return max(POINTS_BUDGET, json.loads(BASELINE.read_text()).get(name, 0)) if BASELINE.is_file() else POINTS_BUDGET


def spent(name: str, loads: RequestLoads) -> str:
    return f"{name} spent {loads.points()} points, over its {allowed(name)}: {loads.line()}"


def recorded(spending: dict[str, RequestLoads]) -> dict[str, RequestLoads]:
    if MISSING:
        kept = json.loads(BASELINE.read_text()) if BASELINE.is_file() else {}
        BASELINE.write_text(json.dumps(dict(sorted({**kept, **{name: math.ceil((loads.points() + 3) / 5) * 5 for name, loads in spending.items() if loads.points() > POINTS_BUDGET}}.items())), indent=1) + "\n")
    return spending


def over(spending: dict[str, RequestLoads]) -> list[str]:
    return [spent(name, loads) for name, loads in spending.items() if loads.points() > allowed(name)]


def measured_loads(app: App, measured: list[tuple[str, str, tuple[str, bytes]]]) -> dict[str, RequestLoads]:
    return {f"{method} {target}": least_loads(app, method, target, body) for method, target, body in measured}


def over_budget(app: App, measured: list[tuple[str, str, tuple[str, bytes]]]) -> list[str]:
    return over(measured_loads(app, measured))


def test_every_route_is_timed_or_left_out_by_name_and_every_hook_kind_has_a_body(full_project: App):
    routes = full_project.container.get(Router).routes
    assert sorted(set(LEFT_OUT) - {key(route) for route in routes}) == [], "a route left out by name is one the server registers"
    assert sorted({*POLLED, *OPENED} - {key(route) for route in routes}) == [], "a read counted cold by name is one the server registers"
    timed = {(method, target.split("?")[0]) for method, target, _ in cases(full_project)}
    assert [key(route) for route in routes if not is_left_out(route) and (route.method, path(route)) not in timed] == [], "every route not left out is timed"
    assert set(hook_bodies()) == set(HookType), "every hook kind is timed"
    assert len(timed) > 200 and any("?closed=1" in target for _, target, _ in cases(full_project)), "the lists are timed with their list parameters"


def test_every_route_answers_within_its_budget_on_a_full_project(full_project: App):
    routes = over(recorded(measured_loads(full_project, cases(full_project))))
    assert not routes, "\n".join(routes)


def orchestrating(app: App) -> None:
    user_set(app, WorkersOptions.MODE.key, ORCHESTRATOR)


def hook_cases(app: App) -> dict[str, tuple[HookType, dict]]:
    """Every hook kind with its body, and after the tool call a shell call, since the agent's calls are mostly shell lines and a shell call reads what the earlier ones ran, and an edit in a worker's worktree, which asks whose worktree it is."""
    edit = {"tool_name": "Edit", "tool_input": {"file_path": str(app.config.home / "worktrees" / WORKTREE / "src" / "parser.py"), "old_string": "a", "new_string": "b"}}
    followers = {"hook PreToolUse shell": (HookType.PRE_TOOL_USE, SHELL_CALL), "hook PreToolUse worktree edit": (HookType.PRE_TOOL_USE, edit)}
    return {name: case for type_name, body in hook_bodies().items() for name, case in {f"hook {type_name.value}": (type_name, body), **(followers if type_name == HookType.PRE_TOOL_USE else {})}.items()}


def hook_body(type_name: HookType, body: dict, try_name: str) -> tuple[str, bytes]:
    return JSON, json.dumps({"hook_event_name": type_name.value, "session_id": "s1", "tool_use_id": f"{try_name}-{type_name.value}", **body}).encode()


def test_every_hook_kind_answers_within_its_budget_on_a_full_project_whose_agent_orchestrates(full_project: App):
    orchestrating(full_project)
    cases = hook_cases(full_project)
    for name, (type_name, body) in cases.items():
        answer_loads(full_project, "POST", HOOK_PATH, hook_body(type_name, body, f"warm {name}"))
    hooks = over(recorded({name: cold_loads(full_project, "POST", HOOK_PATH, hook_body(type_name, body, f"counted {name}")) for name, (type_name, body) in cases.items()}))
    assert not hooks, "\n".join(hooks)


def test_the_timeline_poll_after_a_turn_of_shell_calls_answers_within_its_budget(full_project: App):
    orchestrating(full_project)
    full_project.runtime().deferred.drain()
    with full_project.container.get(Scope).environment(full_project.container.get(Environments).existing("main").row_id):
        polled_to = full_project.container.get(Entries).last_id()
    for n in range(TURN_SHELL_CALLS):
        for type_name, body in ((HookType.PRE_TOOL_USE, SHELL_CALL), (HookType.POST_TOOL_USE, {**SHELL_CALL, "tool_response": {"stdout": SHELL_OUTPUT, "stderr": ""}})):
            answer_loads(full_project, "POST", HOOK_PATH, hook_body(type_name, body, f"turn {n}"))
    polled = over(recorded({"GET /journal/entries after a turn": cold_loads(full_project, "GET", f"/journal/entries?since={polled_to}", EMPTY)}))
    assert not polled, "\n".join(polled)


def in_hand(app: App) -> int:
    with app.container.get(Scope).environment(app.container.get(Environments).existing("main").row_id):
        plans = app.container.get(Plans)
        return plans.started_task(plans.find(STARTED_PLAN)).id


def command(app: App, *argv: str) -> RequestLoads:
    return answer_loads(app, "POST", "/cli", command_body(argv))


def cold_command(app: App, *argv: str) -> RequestLoads:
    return cold_loads(app, "POST", "/cli", command_body(argv))


def command_body(argv: tuple[str, ...]) -> tuple[str, bytes]:
    return JSON, json.dumps({"argv": list(argv), "env": "main", "session": "s1"}).encode()


def test_the_commands_an_agent_runs_on_its_started_plan_answer_within_their_budget(full_project: App):
    first = in_hand(full_project)
    spending = {"POST /cli/task complete": command(full_project, "task", "complete", str(first), "--how", "the parser is written")}
    following = in_hand(full_project)
    assert following != first, "the plan took its next task in hand"
    spending["POST /cli/task block"] = command(full_project, "task", "block", str(following), "the footer first")
    spending["POST /cli/task start"] = command(full_project, "task", "start", str(following))
    spending["POST /cli/output list"] = command(full_project, "output", "list")
    commands = over(recorded(spending))
    assert not commands, "\n".join(commands)


def test_the_commands_an_agent_runs_as_its_session_starts_answer_within_their_budget_against_a_cold_cache(full_project: App):
    spending = {f"POST /cli/{' '.join(argv)}": cold_command(full_project, *argv) for argv in (("check", "list"),)}
    commands = over(recorded(spending))
    assert not commands, "\n".join(commands)


def test_a_settings_save_of_a_whole_group_with_the_mode_changed_answers_within_its_budget(full_project: App):
    group = {**get_answer(full_project, "/journal/settings", MAIN)[1]["workers"], "mode": ORCHESTRATOR}
    saved = over(recorded({"POST /journal/settings a group": answer_loads(full_project, "POST", "/journal/settings", (JSON, json.dumps({"workers": group}).encode()))}))
    assert not saved, "\n".join(saved)


def test_a_route_made_heavy_on_purpose_is_reported_over_its_budget(full_project: App):
    router = full_project.container.get(Router)
    place, route = next((place, route) for place, route in enumerate(router.routes) if key(route) == "GET /journal/tasks")

    def heavy(request):
        for _ in range(POINTS_BUDGET * 2):
            LoadTally.counted("tasks", ("a row",))
        return route.handler(request)

    router.routes[place] = replace(route, handler=heavy)
    reported = over_budget(full_project, [("GET", "/journal/tasks", EMPTY)])
    assert len(reported) == 1 and reported[0].startswith("GET /journal/tasks spent") and "tasks" in reported[0], reported
