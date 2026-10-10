import json
import mimetypes
import os
import tempfile
import time
from dataclasses import asdict, dataclass
from pathlib import Path

from resources.fields import Loaded
from queue import Empty, Queue
from typing import Iterator
from urllib.parse import quote

import features
from engine.multipart import uploads
from features.auto_update.countdown import remaining
from controllers.shared import row_shared
from surfaces.package import archive as extension_archive, info as extension_info
from engine.color import identity, set_color
from engine.upgrades import check_now
from agents.control import permit
from features.permission_prompts.skipping import Relaunch
from engine.files import found_files
from controllers.base import LAST, networked
from controllers.types import Agents, CONTROLLERS, Environments, Features
from engine.runtime import default_env
from engine import attic, bus, runtime, timing, viewer
from engine.package import CODE
from engine.version import version
from controllers.faults import broke, log_file
from runner.chat_mirror import displayed
from runner.hooks import answer
from engine.stepped import call_of
from runner.spool import replay
from runner.stepping import report_step
from engine.record import Record
from providers import DEFAULT_PROVIDER, PROVIDERS
from providers.payload import Hook
from resources.base import OPENED, PROJECT, USER, Refused, titled
from engine.stored import last_lines
from engine.git_view import commit, file_diff
from engine.project_files import list_folder, matching, project_path, read_source
from engine.paths import contained
from commands.dispatch import represented
from features.routing import rank_routes, route
from features.phone.places import place_at
from features.routing import JSON, PLAIN, Reply, Request
from resources.base import Missing

from controllers.invoke import invoked, takes_row
from features.open_viewer.attachments import FileKind
from features.format import VIEWER, carded, shaped
from features.open_viewer.transcripts import TRANSCRIPT_PAGE
from surfaces.everything import found
from surfaces.listing import Listing, dashboard, listing
from commands.dispatch import dispatch  # noqa: F401


RESTART_GRACE = 15
MISSES_TO_REPORT = 5


def unanswered(root: Path) -> None:
    f = runtime.hook_failures(root)
    try:
        logged = f.read_text(errors="replace")
    except FileNotFoundError:
        return
    started = runtime.STARTED[0]
    marked = runtime.restarting(root)
    since = min(started - RESTART_GRACE, float(marked.read_text() or started)) if marked.is_file() else started - RESTART_GRACE
    lines = [line for line in logged.splitlines() if len(line.split()) > 2 and not since <= float(line.split()[0]) <= started + RESTART_GRACE]
    f.unlink(missing_ok=True)
    by_env: dict[str, list[str]] = {}
    for line in lines:
        named = line.split()[3:4]
        by_env.setdefault(named[0] if named else runtime.env(root), []).append(line)
    for env, logged in by_env.items():
        if len(logged) < MISSES_TO_REPORT:
            continue
        codes = sorted({line.split()[1] for line in logged})
        load = logged[-1].split()[4:5]
        beside = f", machine load {load[0]} on {os.cpu_count()} cores" if load else ""
        trouble = "\n".join([*logged[-5:], f"the hook got no answer from the server {len(logged)} times (codes {', '.join(codes)}{beside})"])
        with log_file(root).open("a") as log:
            log.write(f"the hook\n{trouble}\n")
        broke(Record(root, env), trouble, where="the hook")


SHOWN_HITS = 30
STREAM_BEAT = 15.0
SPOOLED_AT_ONCE = 25

@dataclass(frozen=True)
class HookQuery(Loaded):
    root: str = ""
    env: str = ""
    inbox: str = ""
    pid: int = 0


@dataclass(frozen=True)
class StepQuery(Loaded):
    token: str = ""
    part: int = 0
    phase: str = ""
    status: int = 0


@dataclass(frozen=True)
class ConsoleFault(Loaded):
    message: str = ""
    where: str = ""
    stack: str = ""
    kind: str = "threw"


@dataclass(frozen=True)
class Appointed(Loaded):
    session: str = ""


@dataclass(frozen=True)
class ControlsQuery(Loaded):
    model: str = ""
    effort: str = ""


@dataclass(frozen=True)
class ShellLine(Loaded):
    command: str = ""
    now: bool = False


@dataclass
class ScreenQuery(Loaded):
    since: int = -1


@dataclass
class Keys(Loaded):
    text: str = ""


@dataclass(frozen=True)
class Control(Loaded):
    action: str = ""
    value: str = ""


@dataclass(frozen=True)
class EventsQuery(Loaded):
    since: int = 0
    last: int = LAST


@dataclass(frozen=True)
class Forgotten(Loaded):
    root: str = ""


@dataclass(frozen=True)
class StartedJournal(Loaded):
    root: str = ""
    agent: str = DEFAULT_PROVIDER


@dataclass(frozen=True)
class TranscriptQuery(Loaded):
    since: int = 0
    before: int = 0
    last: int = TRANSCRIPT_PAGE


@dataclass(frozen=True)
class FindQuery(Loaded):
    q: str = ""


@dataclass(frozen=True)
class ServiceWant(Loaded):
    want: str = ""


@dataclass(frozen=True)
class SlowQuery(Loaded):
    env: str = ""
    took: float = 0.0
    command: str = ""


@dataclass(frozen=True)
class FileQuery(Loaded):
    path: str = ""


@dataclass(frozen=True)
class DashboardQuery(Loaded):
    types: str = ""
    events: int = 0

@route("POST", "/api/slow-command")
def post_slow_command(req: Request) -> Reply:
    asked = req.query_as(SlowQuery)
    timing.reported(req.root, asked.env or default_env(req.root), asked.command[:80], asked.took)
    return Reply(200, {})


@route("POST", "/api/hook/{provider}")
def post_hook(req: Request) -> Reply:
    asked = req.query_as(HookQuery)
    if Path(asked.root).resolve() != req.root.resolve() or req.params["provider"] not in PROVIDERS:
        return Reply(409, {})
    provider = PROVIDERS[req.params["provider"]]()
    chunk = provider.display_chunk(req.body)
    if chunk is not None:
        return Reply(200, {}, after=lambda: (replay(req.root), displayed(req.root, chunk)), after_lane=chunk.session)
    replay(req.root, SPOOLED_AT_ONCE)
    hook = Hook.read({**req.body, "inbox": asked.inbox}, provider.tool_kinds)
    out = answer(provider, req.root, hook, asked.pid, asked.env)
    return Reply(403 if provider.refused(out) else 200, out, after_lane=hook.session)


@route("POST", "/api/step")
def post_step(req: Request) -> Reply:
    asked = req.query_as(StepQuery)
    call = call_of(req.root, asked.token)
    if call is None or not 1 <= asked.part <= len(call.parts):
        return Reply(404, {})
    return Reply(200, {}, after=lambda: report_step(req.root, call, asked.part, asked.phase, asked.status, asked.token))


@route("POST", "/api/{env}/console")
def post_console(req: Request) -> Reply:
    faults = features.FEATURES.get("dev_faults")
    fault = req.body_as(ConsoleFault)
    message, where, stack = fault.message[:200], fault.where[:200], fault.stack[:2000]
    report = (lambda: faults.reports.report_console(req.root, req.params["env"], message, where, stack, fault.kind)) if faults and message else None
    return Reply(200, {"queued": bool(report)}, after=report)


@route("GET", "/api/manifest")
def get_manifest(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Environments), "manifest"))


@route("POST", "/api/update/check")
def post_update_check(req: Request) -> Reply:
    check_now(req.root)
    return Reply(200, {"checking": True})


@route("GET", "/api/identity")
def get_identity(req: Request) -> Reply:
    names = [row["title"] for row in Environments(Record(req.root, runtime.env(req.root)), actor=USER).rows.summaries() if not row["deleted"]]
    return Reply(200, {**identity(req.root), "root": str(req.root), "version": version(), "build": CODE.name, "pid": os.getpid(), "environments": names})


@route("GET", "/api/{env}/health")
def get_health(req: Request) -> Reply:
    record = req.record()
    with record.locked(), record.locked(PROJECT):
        return Reply(200, {"locks": "taken"})


@route("POST", "/api/identity")
def post_identity(req: Request) -> Reply:
    try:
        set_color(req.root, req.body.get("color"))
    except ValueError as error:
        raise Refused(str(error)) from error
    return get_identity(req)


@route("GET", "/api/summary")
def get_summary(req: Request) -> Reply:
    return Reply(200, {**invoked(req.as_user(Environments), "summary"), "updating": runtime.upgrading(req.root), "step": runtime.upgrade_step(req.root), "countdown": remaining(req.root)})


@route("GET", "/api/agents")
def get_agents(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "online"))


@route("POST", "/api/{env}/appoint")
def post_appoint(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "appoint", named={"session": req.body_as(Appointed).session}))


@route("GET", "/api/agent-controls/{provider}")
def get_agent_controls(req: Request) -> Reply:
    asked = req.query_as(ControlsQuery)
    return Reply(200, invoked(req.as_user(Agents), "options", named={"provider": req.params["provider"], "model": asked.model, "effort": asked.effort}))


@route("POST", "/api/{env}/agent/{session}/permit")
def post_agent_permit(req: Request) -> Reply:
    return Reply(200, permit(req.root, req.params["env"], req.params["session"], bool(req.body.get("allow"))))


@route("POST", "/api/{env}/agent/{session}/shell")
def post_agent_shell(req: Request) -> Reply:
    line = req.body_as(ShellLine)
    return Reply(200, invoked(req.as_user(Agents), "shell", named={"session": req.params["session"], "command": line.command, "now": line.now}))


@route("GET", "/api/{env}/agent/{session}/screen")
def get_agent_screen(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "screen", named={"session": req.params["session"], "since": req.query_as(ScreenQuery).since}))


@route("POST", "/api/{env}/agent/{session}/keys")
def post_agent_keys(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "keys", named={"session": req.params["session"], "text": req.body_as(Keys).text}))


@route("POST", "/api/{env}/agent/{session}/relaunch")
def post_agent_relaunch(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "relaunch", named={"session": req.params["session"], "skip": req.body_as(Relaunch).skip}))


@route("POST", "/api/{env}/agent/{session}/force")
def post_agent_force(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "force", named={"session": req.params["session"]}))


@route("POST", "/api/{env}/agent/{session}/pause")
def post_agent_pause(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "pause", named={"session": req.params["session"]}))


@route("POST", "/api/{env}/agent/{session}/resume")
def post_agent_resume(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "resume", named={"session": req.params["session"]}))


@route("POST", "/api/{env}/agent/{session}/control")
def post_agent_control(req: Request) -> Reply:
    asked = req.body_as(Control)
    return Reply(200, invoked(req.as_user(Agents), "control", named={"session": req.params["session"], "action": asked.action, "value": asked.value}))


@route("GET", "/api/agent-hooks/{provider}")
def get_agent_hooks(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "hooks", named={"provider": req.params["provider"]}))


@route("POST", "/api/agent-hooks/{provider}")
def post_agent_hooks(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "wire", named={"provider": req.params["provider"], "hooks": req.body.get("hooks", {})}))


@route("GET", "/api/extension")
def get_extension(req: Request) -> Reply:
    return Reply(200, extension_info())


@route("GET", "/extension.zip")
def get_extension_zip(req: Request) -> Reply:
    body = extension_archive()
    return Reply(200 if body else 404, body if body else {"error": "the extension is not in this package"}, "application/zip" if body else JSON)


@route("GET", "/api/{env}/events")
def get_events(req: Request) -> Reply:
    asked = req.query_as(EventsQuery)
    return Reply(200, invoked(req.as_user(Environments), "events", named={"since": asked.since, "last": asked.last}))


@route("GET", "/api/{env}/settings")
def get_settings(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Features), "settings"))


@route("POST", "/api/{env}/settings")
def post_settings(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Features), "save", named={"values": req.body}))


@route("POST", "/api/upgrade")
def post_upgrade(req: Request) -> Reply:
    from install import upgrade
    return Reply(200, {"lines": upgrade(req.root.parent, req.root)})


@route("POST", "/api/run")
def post_run(req: Request) -> Reply:
    from commands.cli import captured
    raw = req.body.get("_raw") or b""
    args = [a for a in raw.decode().split("\0") if a]
    for flag, given in (("--as", req.query.get("actor")), ("--default-env", req.query.get("env")), ("--cwd", req.query.get("cwd")), ("--plugin", req.query.get("plugin")), ("--session", req.query.get("session"))):
        if given and flag not in args:
            args = [flag, given, *args]
    output, code = captured(args, req.root)
    timed = not any(networked(a, b) for a, b in zip(args, args[1:]))
    if code is None:
        return Reply(409, output, kind=PLAIN, timed=timed, named=command_of(args))
    return Reply(200 if not code else 400, output, kind=PLAIN, timed=timed, named=command_of(args))


def command_of(args: list[str]) -> str:
    words = [a for before, a in zip(["", *args], args) if not a.startswith("-") and not (before.startswith("--") and "=" not in before)]
    return " ".join(words[:2])


@route("POST", "/api/stop")
def post_stop(req: Request) -> Reply:
    from engine.stop import ask
    ask(req.root)
    return Reply(200, {"stopping": True})


@route("GET", "/api/journals")
def get_journals(req: Request) -> Reply:
    found = [{"port": port, "project": got.project, "version": got.version, "root": got.root, "current": got.root == str(req.root), "running": True}
             for port, got in viewer.running_journals()]
    up = {str(req.root.resolve()), *(str(Path(j["root"]).resolve()) for j in found)}
    for j in viewer.known():
        if j.root not in up and Path(j.root).is_dir():
            found.append({"port": 0, "project": j.project, "version": "", "root": j.root, "current": False, "running": False, "at": j.at})
    return Reply(200, found)


@route("POST", "/api/journals/start")
def post_journal_start(req: Request) -> Reply:
    body = req.body_as(StartedJournal)
    place = place_at(req.root, body.root)
    place.start(place.start_environment, body.agent)
    return Reply(200, {"ok": True})


@route("POST", "/api/journals/forget")
def post_forget(req: Request) -> Reply:
    viewer.forget(req.body_as(Forgotten).root)
    return Reply(200, {"ok": True})


@route("GET", "/api/{env}/files")
def get_files(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Environments), "attachments"))


@dataclass(frozen=True)
class FilesQuery(Loaded):
    kind: FileKind = FileKind.ALL
    shelf: str | None = None
    search: str = ""
    last: int = 60
    skip: int = 0


@route("GET", "/api/{env}/files/page")
def get_files_page(req: Request) -> Reply:
    asked = req.query_as(FilesQuery)
    return Reply(200, invoked(req.as_user(Environments), "attached", named={"kind": asked.kind, "shelf": asked.shelf, "search": asked.search, "last": asked.last, "skip": asked.skip}))


@route("GET", "/api/{env}/project-files")
def get_project_files(req: Request) -> Reply:
    return Reply(200, list_folder(req.checkout, req.query.get("folder", "")))


@route("GET", "/api/{env}/project-files/find")
def get_project_files_found(req: Request) -> Reply:
    project = req.checkout
    asked = req.query_as(FindQuery).q
    files = []
    for found in found_files(project, asked):
        try:
            project_path(project, found.path)
        except Refused:
            continue
        files.append(asdict(found))
    return Reply(200, files)


def transcript_of(req: Request, subagent: str) -> Reply:
    asked = req.query_as(TranscriptQuery)
    return Reply(200, invoked(req.as_user(Agents), "transcript", (int(req.params["n"]),),
                              {"subagent": subagent, "since": asked.since, "before": asked.before, "last": asked.last}))


@route("GET", "/api/{env}/helper/{n}/transcript")
def get_helper_transcript(req: Request) -> Reply:
    asked = req.query_as(TranscriptQuery)
    return Reply(200, invoked(req.as_user(CONTROLLERS["helper"]), "transcript", (int(req.params["n"]),), {"since": asked.since, "before": asked.before, "last": asked.last}))


@route("GET", "/api/{env}/doc/locate")
def get_doc_locate(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(CONTROLLERS["doc"]), "locate", (), {"words": req.query.get("words", "")}))


@route("GET", "/api/{env}/agent/{n}/links")
def get_agent_links(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "links", (int(req.params["n"]),)))


@route("GET", "/api/{env}/agent/{n}/subagent/{session}/links")
def get_subagent_links(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "links", (int(req.params["n"]),), {"subagent": req.params["session"]}))


@route("GET", "/api/{env}/agent/{n}/transcript")
def get_transcript(req: Request) -> Reply:
    return transcript_of(req, "")


@route("GET", "/api/{env}/agent/{n}/subagent/{session}/transcript")
def get_subagent_transcript(req: Request) -> Reply:
    return transcript_of(req, req.params["session"])


@route("GET", "/api/services/{id}/log")
def get_service_log(req: Request) -> Reply:
    from engine.services import log_file
    return Reply(200, {"id": req.params["id"], "log": last_lines(log_file(req.root, req.params["id"]), req.asked_lines())})


@route("POST", "/api/services/{id}")
def post_service(req: Request) -> Reply:
    from engine.services import DOWN, UP, want
    asked = req.body_as(ServiceWant).want.lower()
    if asked not in (UP, DOWN, "restart"):
        raise Missing("a service is asked to be up, down or restart")
    wanted = want(req.root, req.params["id"], DOWN if asked == DOWN else UP, nonce=time.time() if asked == "restart" else 0.0)
    return Reply(200, {"id": req.params["id"], **wanted})


@route("GET", "/api/{env}/commit/{sha}")
def get_commit(req: Request) -> Reply:
    return Reply(200, commit(req.checkout, req.params["sha"]))


@route("GET", "/api/{env}/file")
def get_file_text(req: Request) -> Reply:
    project = req.checkout
    asked = req.query_as(FileQuery).path
    if asked and not Path(asked).is_absolute() and not (project / asked).is_file():
        matches = matching(project, asked)
        if len(matches) > 1:
            return Reply(200, {"matches": matches})
    return Reply(200, asdict(read_source(project, asked)))


@route("GET", "/api/{env}/diff")
def get_file_diff(req: Request) -> Reply:
    return Reply(200, file_diff(req.checkout, req.query_as(FileQuery).path))


@route("GET", "/api/{env}/search")
def get_search(req: Request) -> Reply:
    term = req.query.get("q", "")
    if not term:
        return Reply(200, {"hits": [], "more": 0})
    record = req.record()
    hits = sorted((hit for hit in found(record, USER, term, req.query.get("archived") == "true", tuple(filter(None, req.query.get("resources", "").split(",")))) if row_shared(hit.type, vars(hit.row))),
                  key=lambda hit: hit.row.updated, reverse=True)
    shown = [{**carded(hit.row, record, VIEWER), "matches": [{"name": name, "tags": tags, "url": f"/api/{record.env}/{hit.type}/{hit.row.n}/files/{quote(name, safe='')}"}
                                                            for name, tags in hit.files]}
             for hit in hits[:SHOWN_HITS]]
    return Reply(200, {"hits": shown, "more": len(hits) - len(shown)})


@route("GET", "/api/{env}/search/attic")
def get_search_attic(req: Request) -> Reply:
    term = req.query.get("q", "")
    return Reply(200, [asdict(hit) for hit in attic.searched(req.root, term)] if term else [])


@route("GET", "/api/{env}/stream")
def get_stream(req: Request) -> Reply:
    env = req.params["env"]
    queue: Queue = Queue()
    off = bus.watch(lambda e, r: queue.put(e) if r is not None and r.env == env and e.id else None)

    def chunks() -> Iterator[bytes]:
        try:
            yield b": open\n\n"
            while True:
                try:
                    e = queue.get(timeout=STREAM_BEAT)
                    yield f"id: {e.id}\ndata: {json.dumps(e.to_json())}\n\n".encode()
                except Empty:
                    yield b"event: beat\ndata: keep\n\n"
        finally:
            off()
    return Reply(200, kind="text/event-stream", chunks=chunks())


@route("GET", "/api/{env}/dashboard")
def get_dashboard(req: Request) -> Reply:
    record = req.record()
    asked = req.query_as(DashboardQuery)
    wanted = [t for t in asked.types.split(",") if t in CONTROLLERS]
    whole = "events" in req.query
    tallied = [t for t, c in CONTROLLERS.items() if c.resource.in_sidebar or c.resource.needs_attention or t in wanted] if whole else wanted
    lists, tallies = dashboard(record, wanted, tallied, {key: value for key, value in req.query.items() if key != "events"})
    body = b'{"rows": ' + lists + b', "counts": ' + tallies
    if whole:
        events, settings = invoked(req.as_user(Environments), "events", named={"last": asked.events}), invoked(req.as_user(Features), "settings")
        body += b', "events": ' + json.dumps(events).encode() + b', "settings": ' + json.dumps(settings).encode()
    return Reply(200, body + b"}")


@route("GET", "/api/{env}/{type}")
def get_all(req: Request) -> Reply:
    listed = listing(req.controller(), req.record(), Listing.from_query(req.query))
    return Reply(200, {**listed, "rows": [row for row in listed["rows"] if row_shared(req.params["type"], row)]})


@route("POST", "/api/{env}/{type}")
def post_create(req: Request) -> Reply:
    controller = req.controller()
    created = invoked(controller, controller.named("create"), named={**req.body, "title": req.body.get("title") or titled(req.body.get("brief", ""))})
    return Reply(201, shaped(created, req.record(), VIEWER))


@route("GET", "/api/{env}/{type}/{n}")
def get_one(req: Request) -> Reply:
    controller = req.controller()
    n = int(req.params["n"])
    view = shaped(controller.show(n) if controller.resource.cleared_by == OPENED else controller.load(n), req.record(), VIEWER)
    if not row_shared(req.params["type"], view):
        return Reply(404, {"error": f"no {req.params['type']} {n}"})
    return Reply(200, view)


@route("GET", "/api/{env}/{type}/{n}/choices")
def get_choices(req: Request) -> Reply:
    controller = req.controller()
    return Reply(200, controller._field_choices(controller.load(req.params["n"])))


@route("GET", "/api/{env}/{type}/{n}/markdown")
def get_markdown(req: Request) -> Reply:
    from features.format import markdown
    return Reply(200, markdown(req.controller().load(req.params["n"]), req.record()).encode(), "text/markdown; charset=utf-8")


@route("GET", "/api/{env}/{type}/{n}/files/{name}")
def get_file(req: Request) -> Reply:
    f = contained(req.controller().folder(int(req.params["n"])), req.params["name"])
    if not f.is_file():
        raise Missing(f"no file {req.params['name']}")
    return Reply(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")


@route("POST", "/api/{env}/{type}/{n}/upload")
def post_upload(req: Request) -> Reply:
    controller = req.controller()
    n = int(req.params["n"])
    names = []
    with tempfile.TemporaryDirectory() as folder:
        for sent in uploads(req.body["_type"], req.body["_raw"]):
            f = contained(Path(folder), sent.name)
            f.write_bytes(sent.data)
            controller.attach(n, str(f))
            names.append(f.name)
    return Reply(200, {"files": names})


@route("POST", "/api/{env}/{type}/read-all")
def post_read_all(req: Request) -> Reply:
    return Reply(200, represented(invoked(req.controller(), "read_all", (req.body.get("numbers", []),)), req.record()))


@route("POST", "/api/{env}/{type}/{action}")
def post_action_bare(req: Request) -> Reply:
    got = invoked(req.controller(), req.params["action"], named=req.body)
    return Reply(201, represented(got, req.record()), timed=not networked(req.params["type"], req.params["action"]))


@route("POST", "/api/{env}/{type}/{n}/{action}")
def post_action(req: Request) -> Reply:
    controller, action = req.controller(), req.params["action"]
    if not takes_row(controller.method(action)):
        raise Refused(f"{controller.type} {action} takes no row number: POST /api/{controller.record.env}/{controller.type}/{action}")
    got = invoked(controller, action, (int(req.params["n"]),), req.body)
    return Reply(200, represented(got, req.record()), timed=not networked(req.params["type"], req.params["action"]))


rank_routes()
