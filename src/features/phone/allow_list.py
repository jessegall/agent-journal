from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path

from controllers.base import Arguments
from controllers.features import writes_what_runs
from controllers.types import CONTROLLERS
from engine.fields import Loaded
from engine.paths import known_environment
from engine.record import Record
from features.permission_prompts.skipping import Relaunch
from features.phone.members import rights_of
from features.routing import Named, Reply, Route
from resources.base import SYSTEM



class Reach(Enum):
    """How far a phone gets with one request: through, through once it unlocks, or nowhere."""

    OPEN = 200
    LOCKED = 428
    CLOSED = 403

    def refusal(self) -> Reply:
        return Reply(self.value, {Reach.LOCKED: {"error": "Running a command from the phone needs Face ID or the phone's passcode first", "unlock": True},
                                  Reach.CLOSED: {"error": "a phone reaches only the pages its app uses, in its own environment"}}[self])


@dataclass(frozen=True)
class Page:
    """A desktop page of its own, named by its route's method and pattern."""

    method: str
    pattern: str

    def asks_to_run(self, record: Record, arguments: Arguments, body: dict) -> bool:
        return self in ASKS_TO_RUN and ASKS_TO_RUN[self](record, body)


@dataclass(frozen=True)
class Action:
    """A controller action, named by its type and word."""

    type: str
    word: str

    def asks_to_run(self, record: Record, arguments: Arguments, body: dict) -> bool:
        return CONTROLLERS[self.type](record, actor=SYSTEM)._runs_commands(self.word, arguments)


@dataclass(frozen=True)
class SettingsWrite(Loaded):
    """What a settings write sets among the viewer's own settings."""

    viewer: dict = field(default_factory=dict)

    def changes_only(self, stored: dict, named: frozenset[str]) -> bool:
        return {key for key, value in self.viewer.items() if stored.get(key) != value} <= named


@dataclass(frozen=True)
class GenericPath(Loaded):
    """What a generic page's path names: the type, and in two of its shapes the action."""

    type: str = ""
    action: str = ""


def get(pattern: str) -> Page:
    return Page("GET", pattern)


def post(pattern: str) -> Page:
    return Page("POST", pattern)


def actions(type_: str, words: str) -> tuple[Action, ...]:
    return tuple(Action(type_, word) for word in words.split())


GENERIC = {
    get("/api/{env}/{type}"): "all", get("/api/{env}/{type}/{n}"): "show", get("/api/{env}/{type}/{n}/choices"): "choices",
    get("/api/{env}/{type}/{n}/markdown"): "markdown", get("/api/{env}/{type}/{n}/files/{name}"): "files",
    post("/api/{env}/{type}"): "create", post("/api/{env}/{type}/read-all"): "read_all", post("/api/{env}/{type}/{n}/upload"): "attach",
    post("/api/{env}/{type}/{action}"): "", post("/api/{env}/{type}/{n}/{action}"): "",
}

ALLOWED = (
    get("/api/agent-controls/{provider}"), get("/api/agents"), get("/api/changelog"), get("/api/releases"), get("/api/extension"), get("/api/identity"),
    get("/api/manifest"), get("/api/pages"), get("/api/{env}/agent/{n}/terminal"), get("/api/{env}/commit/{sha}"),
    get("/api/{env}/events"), get("/api/plugins/{name}/log"), get("/api/services"), get("/api/services/{id}/log"),
    get("/api/{env}/dashboard"), get("/api/{env}/diagnostics"), get("/api/{env}/diff"), get("/api/{env}/family"), get("/api/{env}/file"),
    get("/api/{env}/files"), get("/api/{env}/plugin/{n}/dashboard/{name}"), get("/api/{env}/project-files"),
    get("/api/{env}/project-files/find"), get("/api/{env}/search"), get("/api/{env}/settings"), get("/api/{env}/skills"),
    get("/api/{env}/skills/{name}"),
    post("/api/identity"), post("/api/journals/forget"), post("/api/update/check"), post("/api/{env}/agent/{session}/relaunch"),
    post("/api/{env}/skills/{name}/always"), post("/api/{env}/skills/{name}/keywords"), post("/api/{env}/skills/{name}/load"),
    post("/api/{env}/agent/{session}/control"), post("/api/{env}/appoint"),
    *actions("agent", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("board", "all attach cancel comment complete create delete detach discard follow_up keep link move pause read_all reopen request resume retry revise show start unlink update"),
    *actions("browser", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("check", "all attach comment delete detach link move read_all reopen retire show unlink update"),
    *actions("collection", "add all attach close comment create delete detach link move read_all remove reopen show unlink update"),
    *actions("comment", "all attach delete detach done link move read_all reopen reply show unlink update"),
    *actions("critique", "all attach comment delete detach finish link move read_all reopen show unlink update"),
    *actions("doc", "all attach comment create delete detach draft final hide keep link move read_all reopen revision show supersede unhide unlink update"),
    *actions("dump", "all attach choose close comment create decline delete detach direct dismiss link move read_all remove reopen show stop unlink update"),
    *actions("environment", "all attach claim comment create delete detach launch link move read_all remove rename reopen show stop sweep unlink update"),
    *actions("fact", "all attach comment create delete detach link move promote read_all reopen show strike unlink update"),
    *actions("feature", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("helper", "all attach comment delete detach finish link move read_all reopen show stop unlink update"),
    *actions("message", "all archive attach comment create delete detach edit link move processed read_all reopen show unlink update"),
    *actions("notice", "all attach close comment create delete detach link move read_all reopen show unlink update"),
    *actions("notification", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("nudge", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("output", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("phone", "disconnect"),
    *actions("plan", "abandon all attach comment continue create delete detach dismiss finish from_doc link move park read_all reopen show start timeline unlink update"),
    *actions("plugin", "all attach clear_log comment configure delete detach disable link move purge read_all remove reopen show unlink update"),
    *actions("profile", "all attach callings comment create delete detach duplicate link move read_all reopen retire samples show unlink update"),
    *actions("question", "all answer attach comment delete detach dismiss link move read_all reopen set show unlink update"),
    *actions("reaction", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("record", "all attach comment complete delete detach link move read_all reopen show unlink update"),
    *actions("reminder", "all attach comment create delete detach link move read_all reopen retire show unlink update"),
    *actions("report", "all archive attach comment delete detach dismiss doc link move read_all reopen show unlink update"),
    *actions("rule", "all attach comment create delete detach inject link move pin read_all reopen show strike uninject unlink update"),
    *actions("sequence", "abandon all attach comment create delete detach link move read_all reopen retire show steps unlink update"),
    *actions("share", "all allow approve attach check_tunnel comment delete detach domains link logout move read_all release reopen show stop tunnel unlink update version"),
    *actions("suggestion", "all attach comment decide detach link move note_window read_all reopen set show unlink update withdraw"),
    *actions("template", "all attach comment create delete detach link move read_all reopen retire show unlink update"),
    *actions("ticket", "accept_dependencies all approve_plan attach comment complete confirm continue_plan create decline_dependencies delete depend detach link merge move organization priority queue_before read_all reopen send_back show stop tell unlink update"),
    *actions("todo", "after all assign attach block board comment create delete detach done link move priority read_all reopen shift show start strike touched unassign unblock unlink update"),
    *actions("tool", "all attach comment complete create delete detach link move read_all reopen show unlink update"),
    *actions("trigger", "all attach comment create delete detach link move read_all reopen retire show unlink update"),
    *actions("work", "all attach comment delete detach end link move read_all reopen resume show unlink update"),
    *actions("worktree", "all attach comment delete detach drop link move read_all reopen show unlink update"),
)

TO_WEIGH = (*actions("board", "build"), *actions("ticket", "start"), *actions("worktree", "take"), post("/api/{env}/settings"))

RUNS = (
    post("/api/{env}/agent/{session}/keys"), post("/api/{env}/agent/{session}/shell"), post("/api/{env}/plugins/preview"),
    post("/api/{env}/plugins/{n}/upgrade-preview"), post("/api/services/{id}"), post("/api/stop"), post("/api/update"), post("/api/upgrade"),
    *actions("check", "run"), *actions("tool", "run"), *actions("sequence", "run"), *actions("plugin", "enable install upgrade"),
    *actions("suggestion", "install"), *actions("share", "install_tunler login readdress update_tunler"),
)

# The viewer settings a phone writes; none of them sets a command.
VIEWER_SETTINGS = frozenset(("away", "chat_hidden", "color_scheme", "tour_seen"))

ASKS_TO_RUN = {
    post("/api/{env}/settings"): lambda record, body: writes_what_runs(record, body)
    or not SettingsWrite.from_json(body).changes_only(record.viewer, VIEWER_SETTINGS),
    post("/api/{env}/agent/{session}/relaunch"): lambda record, body: Relaunch.from_json(body).skip,
}

NAMED = frozenset((*ALLOWED, *TO_WEIGH, *RUNS))


def reach(route: Route, path: GenericPath) -> Page | Action:
    """The action a generic page calls, whichever of its URL shapes names it, or else the page itself."""
    page = Page(route.method, route.pattern)
    if page not in GENERIC:
        return page
    return Action(path.type, path.action or GENERIC[page])


def allowed(root: Path, environment: str, route: Route, params: dict, body: dict, unlocked: bool, member: str) -> Reach:
    """A named page or action is open, and one that runs a command only right after the phone unlocked; anything unnamed is closed, and a phone gets only what its person's rights grant."""
    reached = reach(route, GenericPath.from_json(params))
    home = Record(root, environment)
    if reached not in NAMED or not rights_of(home).may_reach(home, member, reached):
        return Reach.CLOSED
    if unlocked or not (reached in RUNS or reached.asks_to_run(Record(root, environment), Arguments.given(body, params), body)):
        return Reach.OPEN
    return Reach.LOCKED


def reached(root: Path, route: Route, params: dict, query: dict, body: dict, environment: str, unlocked: bool, member: str) -> Reach:
    """How far a phone in this environment gets with the page."""
    here = {Named.from_json(given).env for given in (params, query)} - {""}
    target = Named.from_json(body).env
    if not here <= {environment} or (target and not known_environment(root, target)):
        return Reach.CLOSED
    return allowed(root, environment, route, params, body, unlocked, member)
