import json
import mimetypes
import os
import tempfile
import time
from email import policy
from email.parser import BytesParser
from dataclasses import asdict, dataclass
from pathlib import Path

from engine.fields import Loaded
from queue import Empty, Queue
from typing import Iterator
from urllib.parse import quote

import features
from surfaces.appoint import appoint, online
from surfaces.package import archive as extension_archive, info as extension_info
from overview.summary import lately_summarized
from engine.color import identity, set_color
from engine.upgrades import check_now
from agents.control import force as force_session, pause as pause_session, resume as resume_session, options as control_options, permit, relaunch, request as control_session, shell
from features.permission_prompts.skipping import set_skipped
from engine.files import found_files
from controllers.base import LAST, networked
from controllers.types import Agents, CONTROLLERS, Environments
from engine import bus, runtime, typist, viewer
from surfaces.manifest import manifest
from engine.version import version
from engine.seats import terminal_of
from agents.screen import screen_since
from controllers.faults import broke, log_file
from runner.chat_mirror import displayed
from runner.hooks import answer
from engine.record import Record
from engine.transcript import page
from providers import PROVIDERS
from providers.base import Provider
from resources.base import OPENED, USER, Refused, titled
from engine.stored import last_lines
from engine.git_view import commit, file_diff
from engine.project_files import list_folder, matching, project_path, read_source
from engine.paths import contained
from commands.dispatch import rank_routes, represented, route
from features.routing import JSON, PLAIN, Reply, Request
from resources.base import Missing

from commands.invoke import invoked
from features.format import VIEWER, formatted, shaped
from surfaces.attachments import attachments, listed_types
from surfaces.listing import Listing, counted, listing
from surfaces.settings import apply, settings
from commands.dispatch import dispatch  # noqa: F401


RESTART_GRACE = 15


def unanswered(root: Path) -> None:
    f = runtime.hook_failures(root)
    try:
        logged = f.read_text(errors="replace")
    except FileNotFoundError:
        return
    started = runtime.STARTED[0]
    marked = runtime.restarting(root)
    since = min(started - RESTART_GRACE, float(marked.read_text() or started)) if marked.is_file() else started - RESTART_GRACE
    lines = [line for line in logged.splitlines() if len(line.split()) > 2 and not since <= float(line.split()[0]) <= started]
    f.unlink(missing_ok=True)
    by_env: dict[str, list[str]] = {}
    for line in lines:
        named = line.split()[3:4]
        by_env.setdefault(named[0] if named else runtime.env(root), []).append(line)
    for env, logged in by_env.items():
        codes = sorted({line.split()[1] for line in logged})
        trouble = "\n".join([*logged[-5:], f"the hook got no answer from the server {len(logged)} times (codes {', '.join(codes)})"])
        with log_file(root).open("a") as log:
            log.write(f"the hook\n{trouble}\n")
        broke(Record(root, env), trouble, where="the hook")


TRANSCRIPT_PAGE = 300

@dataclass(frozen=True)
class HookQuery(Loaded):
    root: str = ""
    env: str = ""
    inbox: str = ""
    pid: int = 0


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
class FileQuery(Loaded):
    path: str = ""


@dataclass(frozen=True)
class DashboardQuery(Loaded):
    types: str = ""
    events: int = 0

@route("POST", "/api/hook/{provider}")
def post_hook(req: Request) -> Reply:
    asked = req.query_as(HookQuery)
    if Path(asked.root).resolve() != req.root.resolve() or req.params["provider"] not in PROVIDERS:
        return Reply(409, {})
    provider = PROVIDERS[req.params["provider"]]()
    chunk = provider.display_chunk(req.body)
    if chunk is not None:
        return Reply(200, {}, after=lambda: displayed(req.root, chunk))
    out = answer(provider, req.root, {**req.body, "inbox": asked.inbox}, asked.pid, asked.env)
    return Reply(403 if provider.refused(out) else 200, out)


@route("POST", "/api/{env}/console")
def post_console(req: Request) -> Reply:
    faults = features.FEATURES.get("dev_faults")
    fault = req.body_as(ConsoleFault)
    message, where, stack = fault.message[:200], fault.where[:200], fault.stack[:2000]
    report = (lambda: faults.reports.report_console(req.root, req.params["env"], message, where, stack, fault.kind)) if faults and message else None
    return Reply(200, {"queued": bool(report)}, after=report)


@route("GET", "/api/manifest")
def get_manifest(req: Request) -> Reply:
    return Reply(200, manifest(req.root))


@route("POST", "/api/update/check")
def post_update_check(req: Request) -> Reply:
    check_now(req.root)
    return Reply(200, {"checking": True})


@route("GET", "/api/identity")
def get_identity(req: Request) -> Reply:
    names = [row["title"] for row in Environments(Record(req.root, runtime.env(req.root)), actor=USER).rows.summaries() if not row["deleted"]]
    return Reply(200, {**identity(req.root), "root": str(req.root), "version": version(), "pid": os.getpid(), "environments": names})


@route("POST", "/api/identity")
def post_identity(req: Request) -> Reply:
    try:
        set_color(req.root, req.body.get("color"))
    except ValueError as error:
        raise Refused(str(error)) from error
    return get_identity(req)


@route("GET", "/api/summary")
def get_summary(req: Request) -> Reply:
    return Reply(200, lately_summarized(req.root))


@route("GET", "/api/agents")
def get_agents(req: Request) -> Reply:
    return Reply(200, online(req.root))


@route("POST", "/api/{env}/appoint")
def post_appoint(req: Request) -> Reply:
    return Reply(200, appoint(req.root, req.params["env"], req.body_as(Appointed).session))


@route("GET", "/api/agent-controls/{provider}")
def get_agent_controls(req: Request) -> Reply:
    asked = req.query_as(ControlsQuery)
    return Reply(200, control_options(req.params["provider"], asked.model, asked.effort))


@route("POST", "/api/{env}/agent/{session}/permit")
def post_agent_permit(req: Request) -> Reply:
    return Reply(200, permit(req.root, req.params["env"], req.params["session"], bool(req.body.get("allow"))))


@route("POST", "/api/{env}/agent/{session}/shell")
def post_agent_shell(req: Request) -> Reply:
    line = req.body_as(ShellLine)
    return Reply(200, shell(req.root, req.params["env"], req.params["session"], line.command, line.now))


def terminal_or_missing(req: Request) -> str:
    terminal = terminal_of(req.root, req.params["session"])
    if not terminal:
        raise Missing(f"no session {req.params['session']}")
    return terminal


@route("GET", "/api/{env}/agent/{session}/screen")
def get_agent_screen(req: Request) -> Reply:
    return Reply(200, asdict(screen_since(req.root, terminal_or_missing(req), req.query_as(ScreenQuery).since)))


@route("POST", "/api/{env}/agent/{session}/keys")
def post_agent_keys(req: Request) -> Reply:
    return Reply(200, {"sent": typist.send(req.root, terminal_or_missing(req), req.body_as(Keys).text.encode())})


@route("POST", "/api/{env}/agent/{session}/relaunch")
def post_agent_relaunch(req: Request) -> Reply:
    skip = bool(req.body.get("skip"))
    set_skipped(req.record(), skip)
    return Reply(200, {**relaunch(req.root, req.params["env"], req.params["session"]), "skip": skip})


@route("POST", "/api/{env}/agent/{session}/force")
def post_agent_force(req: Request) -> Reply:
    return Reply(200, force_session(req.root, req.params["env"], req.params["session"]))


@route("POST", "/api/{env}/agent/{session}/pause")
def post_agent_pause(req: Request) -> Reply:
    return Reply(200, pause_session(req.root, req.params["env"], req.params["session"]))


@route("POST", "/api/{env}/agent/{session}/resume")
def post_agent_resume(req: Request) -> Reply:
    return Reply(200, resume_session(req.root, req.params["env"], req.params["session"]))


@route("POST", "/api/{env}/agent/{session}/control")
def post_agent_control(req: Request) -> Reply:
    asked = req.body_as(Control)
    return Reply(200, control_session(req.root, req.params["env"], req.params["session"], asked.action, asked.value))


def provider_of(req: Request):
    if req.params["provider"] not in PROVIDERS:
        raise Missing(f"no provider {req.params['provider']}")
    return PROVIDERS[req.params["provider"]]()


@route("GET", "/api/agent-hooks/{provider}")
def get_agent_hooks(req: Request) -> Reply:
    provider = provider_of(req)
    return Reply(200, {"path": str(provider.config(req.root.parent).relative_to(req.root.parent)), "hooks": provider.hooks(req.root.parent),
                       "elsewhere": provider.hooks_elsewhere(req.root.parent)})


@route("POST", "/api/agent-hooks/{provider}")
def post_agent_hooks(req: Request) -> Reply:
    provider = provider_of(req)
    try:
        return Reply(200, {"hooks": provider.set_hooks(req.root.parent, req.body.get("hooks") or {})})
    except ValueError as error:
        raise Refused(str(error)) from error


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
    return Reply(200, [e.to_json() for e in req.record().event_log.events(asked.since, asked.last)])


@route("GET", "/api/{env}/settings")
def get_settings(req: Request) -> Reply:
    return Reply(200, settings(req.record()))


@route("POST", "/api/{env}/settings")
def post_settings(req: Request) -> Reply:
    return Reply(200, apply(req.record(), req.body, USER))


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


@route("POST", "/api/journals/forget")
def post_forget(req: Request) -> Reply:
    viewer.forget(req.body_as(Forgotten).root)
    return Reply(200, {"ok": True})


@route("GET", "/api/{env}/files")
def get_files(req: Request) -> Reply:
    return Reply(200, attachments(req.record()))


@route("GET", "/api/{env}/project-files")
def get_project_files(req: Request) -> Reply:
    return Reply(200, list_folder(req.root.parent.resolve(), req.query.get("folder", "")))


@route("GET", "/api/{env}/project-files/find")
def get_project_files_found(req: Request) -> Reply:
    project = req.root.parent.resolve()
    asked = req.query_as(FindQuery).q
    files = []
    for found in found_files(project, asked):
        try:
            project_path(project, found.path)
        except Refused:
            continue
        files.append(asdict(found))
    return Reply(200, files)


@dataclass(frozen=True)
class Transcript:
    provider: Provider
    path: Path

    def turns(self) -> list:
        return self.provider.turns(self.path)

    def links(self) -> list:
        return self.provider.work_links(self.path)


class NoTranscript:
    def turns(self) -> list:
        return []

    def links(self) -> list:
        return []


def transcript_at(req: Request, session: str | None) -> Transcript | NoTranscript:
    row = Agents(req.record(), actor=USER).load(req.params["n"])
    kept = row.provider in PROVIDERS and row.transcript
    if session is None:
        return Transcript(PROVIDERS[row.provider](), Path(row.transcript)) if kept else NoTranscript()
    known = kept and any(r.get("session") == session for r in row.subagent_rows)
    path = PROVIDERS[row.provider]().subagent_transcript(Path(row.transcript), session) if known else None
    if not path:
        raise Missing("no such subagent session")
    return Transcript(PROVIDERS[row.provider](), path)


SPOKEN = ("agent", "human", "injected")


def transcript_of(req: Request, session: str | None = None) -> Reply:
    found = transcript_at(req, session)
    turns = found.turns()
    asked = req.query_as(TranscriptQuery)
    got = page(turns, asked.since, asked.before, asked.last)
    record = req.record()
    got["turns"] = [{**t, "said": formatted(t["text"], record, VIEWER)} if t["kind"] in SPOKEN and t["text"] else t for t in got["turns"]]
    return Reply(200, got)


@route("GET", "/api/{env}/agent/{n}/links")
def get_agent_links(req: Request) -> Reply:
    found = transcript_at(req, None)
    return Reply(200, {"links": found.links()})


@route("GET", "/api/{env}/agent/{n}/subagent/{session}/links")
def get_subagent_links(req: Request) -> Reply:
    found = transcript_at(req, req.params["session"])
    return Reply(200, {"links": found.links()})


@route("GET", "/api/{env}/agent/{n}/transcript")
def get_transcript(req: Request) -> Reply:
    return transcript_of(req)


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
    return Reply(200, commit(req.root.parent.resolve(), req.params["sha"]))


@route("GET", "/api/{env}/file")
def get_file_text(req: Request) -> Reply:
    project = req.root.parent.resolve()
    asked = req.query_as(FileQuery).path
    if asked and not Path(asked).is_absolute() and not (project / asked).is_file():
        matches = matching(project, asked)
        if len(matches) > 1:
            return Reply(200, {"matches": matches})
    return Reply(200, asdict(read_source(project, asked)))


@route("GET", "/api/{env}/diff")
def get_file_diff(req: Request) -> Reply:
    return Reply(200, file_diff(req.root.parent.resolve(), req.query_as(FileQuery).path))


@route("GET", "/api/{env}/search")
def get_search(req: Request) -> Reply:
    term = req.query.get("q", "")
    if not term:
        return Reply(200, [])
    record = req.record()
    want = term.lower()
    out = []
    for type_ in listed_types():
        for r in CONTROLLERS[type_](record, actor=USER).search(term):
            matches = [{"name": name, "tags": tags, "url": f"/api/{record.env}/{type_}/{r.n}/files/{quote(name, safe='')}"}
                       for name, tags in r.files.items() if want in name.lower() or want in str(tags).lower()]
            out.append({**shaped(r, req.record(), VIEWER), "matches": matches})
    return Reply(200, out)


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
                    e = queue.get(timeout=15)
                    yield f"id: {e.id}\ndata: {json.dumps(e.to_json())}\n\n".encode()
                except Empty:
                    yield b": keep\n\n"
        finally:
            off()
    return Reply(200, kind="text/event-stream", chunks=chunks())


@route("GET", "/api/{env}/dashboard")
def get_dashboard(req: Request) -> Reply:
    record = req.record()
    asked = req.query_as(DashboardQuery)
    wanted = [t for t in asked.types.split(",") if t in CONTROLLERS]
    lists = {t: listing(CONTROLLERS[t](record, actor=USER), record, Listing.from_query(req.query)) for t in wanted}
    whole = "events" in req.query
    body = {"rows": lists, "counts": counted(record, [t for t, c in CONTROLLERS.items() if c.resource.in_sidebar or c.resource.needs_attention or t in wanted] if whole else wanted)}
    if whole:
        body.update(events=[e.to_json() for e in record.event_log.events(0, asked.events)], settings=settings(record))
    return Reply(200, body)


@route("GET", "/api/{env}/{type}")
def get_all(req: Request) -> Reply:
    return Reply(200, listing(req.controller(), req.record(), Listing.from_query(req.query)))


@route("POST", "/api/{env}/{type}")
def post_create(req: Request) -> Reply:
    controller = req.controller()
    created = invoked(controller, controller.named("create"), named={**req.body, "title": req.body.get("title") or titled(req.body.get("brief", ""))})
    return Reply(201, shaped(created, req.record(), VIEWER))


@route("GET", "/api/{env}/{type}/{n}")
def get_one(req: Request) -> Reply:
    controller = req.controller()
    n = int(req.params["n"])
    return Reply(200, shaped(controller.show(n) if controller.resource.cleared_by == OPENED else controller.load(n), req.record(), VIEWER))


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
    message = BytesParser(policy=policy.default).parsebytes(b"Content-Type: " + req.body["_type"].encode() + b"\r\n\r\n" + req.body["_raw"])
    controller = req.controller()
    n = int(req.params["n"])
    names = []
    with tempfile.TemporaryDirectory() as folder:
        for part in message.iter_parts():
            name = part.get_filename()
            if not name:
                continue
            f = contained(Path(folder), name)
            f.write_bytes(part.get_payload(decode=True))
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
    got = invoked(req.controller(), req.params["action"], (int(req.params["n"]),), req.body)
    return Reply(200, represented(got, req.record()), timed=not networked(req.params["type"], req.params["action"]))


rank_routes()
