import json
import mimetypes
import os
import tempfile
import threading
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
from surfaces.summary import lately_summarized
from engine.color import identity, set_color
from surfaces.updates import FETCHING, newer, upstream
from agents.control import force as force_session, pause as pause_session, resume as resume_session, options as control_options, permit, relaunch, request as control_session, shell
from features.family_tree.tree import family
from features.skill_loading.catalogue import SKILL, always, catalogue, set_keywords, skills
from features.skill_loading.required import load_now
from engine.files import found_files
from features.file_feed.feed import PAGE, NoSuchEdit, Side, edited_file, edits_before, edits_since, notes
from features.terminal.log import EVERYTHING, LEVELS as TERMINAL_LEVELS, lines as terminal_lines
from controllers.base import LAST, networked
from controllers.types import Agents, CONTROLLERS, Environments, Plugins
from features.browser_control.controller import Asks
from engine import bus, runtime, viewer
from surfaces.manifest import manifest
from engine.version import version
from engine.package import code
from engine.seats import terminal_of
from agents.terminal import screen_since, type_keys
from controllers.faults import broke, log_file
from runner.chat_mirror import displayed
from runner.hooks import answer
from engine.record import Record
from engine.transcript import page
from providers import PROVIDERS
from providers.base import Provider
from resources.base import OPENED, USER, Refused, titled
from resources.types import Ask
from engine.stored import read_json, last_lines
from features.plugins.dashboard import checked
from features.plugins.declared import called, declared
from features.plugins.paths import data
from engine.git_view import commit, file_diff
from engine.project_files import list_folder, matching, project_path, read_source
from engine.paths import contained
from commands.dispatch import JSON, Missing, PLAIN, Reply, Request, represented, route
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
class SkillsQuery(Loaded):
    agent: int = 0


@dataclass(frozen=True)
class Keywords(Loaded):
    keywords: object = None

    @property
    def words(self) -> list:
        if isinstance(self.keywords, list):
            return self.keywords
        return str(self.keywords).split(",") if self.keywords else []


@dataclass(frozen=True)
class TranscriptQuery(Loaded):
    since: int = 0
    before: int = 0
    last: int = TRANSCRIPT_PAGE


@dataclass(frozen=True)
class FindQuery(Loaded):
    q: str = ""


@dataclass(frozen=True)
class TerminalQuery(Loaded):
    level: str = EVERYTHING


@dataclass(frozen=True)
class EditsQuery(Loaded):
    since: float = 0.0
    last: int = PAGE


@dataclass(frozen=True)
class OlderEditsQuery(Loaded):
    before: float
    last: int = PAGE


@dataclass(frozen=True)
class EditedFileQuery(Loaded):
    id: str
    side: str = Side.AFTER


@dataclass(frozen=True)
class PluginSource(Loaded):
    source: str = ""
    ref: str = ""


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


@route("GET", "/api/changelog")
def get_changelog(req: Request) -> Reply:
    from features.auto_update.check import journal_repository
    log = code(req.root) / "CHANGELOG.md"
    if not log.is_file():
        return Reply(404, {"error": "this install carries no changelog"})
    cache = runtime.upstream_cache(req.root)
    latest = cache.read_text().strip() if cache.is_file() else ""
    return Reply(200, {"version": version(), "changelog": log.read_text(), "latest": latest, "newer": newer(latest, version()),
                       "checking": FETCHING.locked(), "updating": runtime.upgrade_mark(req.root).exists(),
                       "repository": journal_repository(req.root.parent)})


@route("POST", "/api/update/check")
def post_update_check(req: Request) -> Reply:
    from surfaces.updates import check_now
    check_now(req.root)
    return Reply(200, {"checking": True})


@route("POST", "/api/update")
def post_update(req: Request) -> Reply:
    from features.auto_update.check import installed, journal_repository
    if journal_repository(req.root.parent):
        raise Refused("this is the journal's own repository: it updates from its own code, not from a release")
    threading.Thread(target=installed, args=(req.root,), daemon=True).start()
    return Reply(200, {"updating": True})


@route("GET", "/api/identity")
def get_identity(req: Request) -> Reply:
    names = [row["title"] for row in Environments(Record(req.root, runtime.env(req.root)), actor=USER).summaries() if not row["deleted"]]
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


@route("POST", "/api/{env}/mode")
def post_mode(req: Request) -> Reply:
    from features.work_modes.modes import pick
    return Reply(200, {"mode": pick(Record(req.root, req.params["env"]), str(req.body.get("mode", "")), USER)})


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
    return Reply(200, {"sent": type_keys(req.root, terminal_or_missing(req), req.body_as(Keys).text)})


@route("POST", "/api/{env}/agent/{session}/relaunch")
def post_agent_relaunch(req: Request) -> Reply:
    return Reply(200, relaunch(req.root, req.params["env"], req.params["session"], bool(req.body.get("skip"))))


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


@route("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = version()
    latest = upstream(req.root)
    installs = features.FEATURES["auto_update"].on(Record(req.root, runtime.env(req.root))) if "auto_update" in features.FEATURES else False
    return Reply(200, {"installed": installed, "latest": latest, "newer": newer(latest, installed), "installs": installs})


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


@route("GET", "/api/{env}/changes")
def get_changes(req: Request) -> Reply:
    return Reply(200, {"changes": [asdict(note) for note in reversed(notes(req.record()))]})


@route("GET", "/api/{env}/bar")
def get_bar(req: Request) -> Reply:
    from features.status_bar.bar import current
    return Reply(200, current(req.record()))


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


@route("POST", "/api/{env}/browser/driver")
def post_driver(req: Request) -> Reply:
    Asks(req.record(), actor=USER)._drive(req.body.get("on"), req.body.get("url", ""), req.body.get("title", ""))
    return Reply(200, {"ok": True})


@route("POST", "/api/{env}/browser/pending")
def post_pending(req: Request) -> Reply:
    asks = Asks(req.record(), actor=USER).pending()
    return Reply(200, {"data": [{"n": a.n, Ask.op: a.op, Ask.args: a.args} for a in asks]})


@route("POST", "/api/{env}/browser/{n}/result")
def post_result(req: Request) -> Reply:
    got = Asks(req.record(), actor=USER).answer(int(req.params["n"]), req.body.get("text", ""), ok=bool(req.body.get("ok", True)), files=req.body.get("files") or [])
    return Reply(200, shaped(got, req.record(), VIEWER))


@route("GET", "/api/{env}/skills")
def get_skills(req: Request) -> Reply:
    return Reply(200, skills(req.record(), req.query_as(SkillsQuery).agent))


@route("GET", "/api/{env}/skills/{name}")
def get_skill(req: Request) -> Reply:
    root = req.record().root.parent
    hit = next((s for s in catalogue(root) if s[SKILL.name] == req.params["name"]), None)
    if not hit:
        return Reply(404, {"error": f"no skill {req.params['name']}"})
    return Reply(200, {**hit, "text": (root / hit[SKILL.path]).read_text(errors="replace")})


@route("POST", "/api/{env}/skills/{name}/load")
def post_skill_load(req: Request) -> Reply:
    return Reply(200, {"notice": load_now(req.record(), req.params["name"])})


@route("POST", "/api/{env}/skills/{name}/always")
def post_skill_always(req: Request) -> Reply:
    record = req.record()
    return Reply(200, {"skills": always(record, req.params["name"], bool(req.body.get("on")))})


@route("POST", "/api/{env}/skills/{name}/keywords")
def post_skill_keywords(req: Request) -> Reply:
    words = req.body_as(Keywords).words
    return Reply(200, {"keywords": set_keywords(req.record(), req.params["name"], [w.strip() for w in words if w.strip()])})


@route("GET", "/api/{env}/files")
def get_files(req: Request) -> Reply:
    return Reply(200, attachments(req.record()))


@route("GET", "/api/{env}/plugin/{n}/dashboard/{name}")
def get_plugin_dashboard(req: Request) -> Reply:
    row = Plugins(req.record(), actor=USER).load(req.params["n"])
    board = next((b for b in declared(row).dashboards if b.name == req.params["name"]), None)
    if board is None:
        raise Missing(f"{called(row)} declares no dashboard {req.params['name']}")
    found = read_json(data(req.record().root, called(row)) / "dashboards" / f"{board.name}.json", dict, None)
    if found is None:
        return Reply(200, {"title": board.title, "missing": f"{called(row)} has not written its {board.title} dashboard yet"})
    try:
        return Reply(200, {"title": board.title, **checked(found)})
    except Refused as broken:
        return Reply(200, {"title": board.title, "broken": str(broken)})


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
        return self.provider.transcript(self.path)

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


@route("GET", "/api/{env}/family")
def get_family(req: Request) -> Reply:
    return Reply(200, family(req.record()))


@route("GET", "/api/{env}/agent/{n}/transcript")
def get_transcript(req: Request) -> Reply:
    return transcript_of(req)


@route("GET", "/api/{env}/agent/{n}/edits")
def get_edits(req: Request) -> Reply:
    asked = req.query_as(EditsQuery)
    return Reply(200, asdict(edits_since(req.record(), int(req.params["n"]), asked.since, asked.last)))


@route("GET", "/api/{env}/agent/{n}/edits/older")
def get_older_edits(req: Request) -> Reply:
    asked = req.query_as(OlderEditsQuery)
    return Reply(200, asdict(edits_before(req.record(), int(req.params["n"]), asked.before, asked.last)))


@route("GET", "/api/{env}/agent/{n}/edits/file")
def get_edited_file(req: Request) -> Reply:
    asked = req.query_as(EditedFileQuery)
    if asked.side not in Side:
        raise Refused(f"side is {Side.BEFORE} or {Side.AFTER}")
    try:
        return Reply(200, asdict(edited_file(req.record(), int(req.params["n"]), asked.id, Side(asked.side))))
    except NoSuchEdit as error:
        raise Missing(str(error)) from error


@route("GET", "/api/{env}/agent/{n}/terminal")
def get_terminal(req: Request) -> Reply:
    level = req.query_as(TerminalQuery).level
    if level not in TERMINAL_LEVELS:
        raise Refused(f"level is one of {', '.join(TERMINAL_LEVELS)}")
    record = req.record()
    return Reply(200, {"lines": terminal_lines(record, Agents(record, actor=USER).load(req.params["n"]).title, level)})


@route("GET", "/api/{env}/agent/{n}/subagent/{session}/transcript")
def get_subagent_transcript(req: Request) -> Reply:
    return transcript_of(req, req.params["session"])


@route("GET", "/api/pages")
def get_pages(req: Request) -> Reply:
    from engine.services import specs, status
    from features.plugins.declared import called, declared
    from features.plugins.services import plugin_services, plugins as installed
    where = {spec.id: spec for spec in specs(req.root, (plugin_services,))}
    out = []
    for row in installed(req.root):
        plugin = called(row)
        for page in declared(row).pages:
            sid = f"{plugin}.{page.service}"
            spec, state = where.get(sid), status(req.root, sid)
            path = page.path if page.path else "/"
            out.append({"plugin": plugin, "name": page.name, "title": page.title, "icon": page.icon if page.icon else "plug",
                        "service": sid, "state": state.state if state.state else "not running", "path": path,
                        "url": (spec.url if spec and spec.url else state.url) + path, "status": page.status})
    return Reply(200, out)


@route("GET", "/api/services")
def get_services(req: Request) -> Reply:
    from engine.services import listed
    from features.plugins.services import plugin_services
    return Reply(200, listed(req.root, (plugin_services,)))


def asked_lines(req: Request) -> int:
    return int(req.query.get("lines") or 200)


@route("GET", "/api/services/{id}/log")
def get_service_log(req: Request) -> Reply:
    from engine.services import log_file
    return Reply(200, {"id": req.params["id"], "log": last_lines(log_file(req.root, req.params["id"]), asked_lines(req))})


@route("POST", "/api/{env}/plugins/preview")
def post_plugins_preview(req: Request) -> Reply:
    from features.plugins.commands import VERSION
    from features.plugins.lifecycle import drop
    from features.plugins.preview import previewed
    from features.plugins.staging import staged
    asked = req.body_as(PluginSource)
    source = asked.source
    where, manifest, commit, linked = staged(req.root, source, asked.ref, VERSION)
    try:
        return Reply(200, previewed(manifest, source, commit), timed=False)
    finally:
        drop(where, linked)


@route("POST", "/api/{env}/plugins/{n}/upgrade-preview")
def post_plugin_upgrade_preview(req: Request) -> Reply:
    from controllers.types import Plugins
    from features.plugins.commands import VERSION
    from features.plugins.declared import Manifest
    from features.plugins.lifecycle import changed, drop
    from features.plugins.preview import previewed
    from features.plugins.staging import staged
    row = Plugins(req.record(), actor=USER).load(req.params["n"])
    where, manifest, commit, linked = staged(req.root, row.source, row.revision, VERSION)
    try:
        return Reply(200, {**previewed(manifest, row.source, commit), "current": commit == row.commit, "changes": changed(Manifest.of(row.manifest), manifest)}, timed=False)
    finally:
        drop(where, linked)


@route("GET", "/api/plugins/{name}/log")
def get_plugin_log(req: Request) -> Reply:
    from features.plugins.paths import log
    return Reply(200, {"name": req.params["name"], "log": last_lines(log(req.root, req.params["name"]), asked_lines(req))})


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
    created = invoked(req.controller(), "create", named={**req.body, "title": req.body.get("title") or titled(req.body.get("brief", ""))})
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
