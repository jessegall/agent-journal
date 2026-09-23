from concurrent.futures import ThreadPoolExecutor
import json
import mimetypes
import os
import re
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
from surfaces.summary import summarize
from surfaces.color import identity, set_color
from surfaces.updates import newer, upstream
from surfaces.control import force as force_session, options as control_options, permit, relaunch, request as control_session, shell
from features.skill_loading.catalogue import SKILL, always, catalogue, set_keywords, skills
from features.skill_loading.required import load_now
from controllers.base import LAST, networked
from controllers.types import Agents, CONTROLLERS, Environments, Features, Nudges
from features.browser_control.controller import Asks
from engine import bus, runtime, viewer
from engine.manifest import manifest
from engine.version import version
from engine.watch import broke, log_file
from engine.hooks import answer, displayed
from providers.payload import DISPLAYED
from engine.record import Record
from engine.transcript import page
from providers import PROVIDERS
from resources.base import AGENT, OPENED, USER, Refused, titled
from resources.types import Ask
from engine.stored import write_text, last_lines
from engine.proc import git, ran
from engine.project_files import UNLISTED, matching
from commands.dispatch import JSON, KEEP_SHAPED, Missing, PLAIN, Reply, Request, represented, route, settled, shaped
from features.format import VIEWER
from commands.dispatch import dispatch  # noqa: F401


def renamed() -> dict:
    return {(alias if isinstance(alias, str) else alias[0]):
            (name if isinstance(alias, str) else f"{name}.{alias[1]}")
            for name, f in features.FEATURES.items() for alias in f.aliases}


def switches(record: Record) -> dict:
    out = {}
    for name, f in features.FEATURES.items():
        out[name] = f.enabled(record)
        for key in f.behaviours:
            out[f.keyed(key)] = f.chosen(record, key)
    return {**out, **{was: out[now] for was, now in renamed().items() if now in out}}


def settings(record: Record) -> dict:
    return {Record.features: switches(record),
            Record.triggers: record.triggers, Record.keep: record.keep, Record.delivery: record.delivery, Record.viewer: record.viewer,
            **{name: view for name, f in features.FEATURES.items() if (view := f.settings_view(record)) is not None}}


RESTART_GRACE = 15


def unanswered(root: Path, env: str) -> None:
    f = runtime.folder(root) / "hook-failures.log"
    if not f.is_file():
        return
    started = runtime.STARTED[0]
    lines = [line for line in f.read_text(errors="replace").splitlines()
             if len(line.split()) > 2 and not started - RESTART_GRACE <= float(line.split()[0]) <= started]
    f.unlink(missing_ok=True)
    if not lines:
        return
    codes = sorted({line.split()[1] for line in lines})
    trouble = "\n".join([*lines[-5:], f"the hook got no answer from the server {len(lines)} times (codes {', '.join(codes)})"])
    with log_file(root).open("a") as log:
        log.write(f"the hook\n{trouble}\n")
    broke(Record(root, env or runtime.env(root)), trouble, where="the hook")



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
        return self.keywords if isinstance(self.keywords, list) else str(self.keywords).split(",") if self.keywords else []


@dataclass(frozen=True)
class TranscriptQuery(Loaded):
    since: int = 0
    before: int = 0
    last: int = TRANSCRIPT_PAGE


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
    if req.body.get("hook_event_name") == DISPLAYED:
        return Reply(200, {}, after=lambda: displayed(req.root, req.body))
    unanswered(req.root, asked.env)
    provider = PROVIDERS[req.params["provider"]]()
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
    from engine.version import version
    from install import code
    log = code(req.root) / "CHANGELOG.md"
    return Reply(200, {"version": version(), "changelog": log.read_text()}) if log.is_file() else Reply(404, {"error": "this install carries no changelog"})


@route("GET", "/api/identity")
def get_identity(req: Request) -> Reply:
    names = [row["title"] for row in Environments(Record(req.root, runtime.env(req.root)), actor=USER).summaries() if not row["deleted"]]
    return Reply(200, {**identity(req.root), "root": str(req.root), "version": version(), "environments": names})


@route("POST", "/api/identity")
def post_identity(req: Request) -> Reply:
    try:
        set_color(req.root, req.body.get("color"))
    except ValueError as e:
        return Reply(400, {"error": str(e)})
    return get_identity(req)


@route("GET", "/api/summary")
def get_summary(req: Request) -> Reply:
    return Reply(200, summarize(req.root))


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
    return Reply(200, shell(req.root, req.params["env"], req.params["session"], req.body_as(ShellLine).command))


@route("POST", "/api/{env}/agent/{session}/relaunch")
def post_agent_relaunch(req: Request) -> Reply:
    return Reply(200, relaunch(req.root, req.params["env"], req.params["session"], bool(req.body.get("skip"))))


@route("POST", "/api/{env}/agent/{session}/force")
def post_agent_force(req: Request) -> Reply:
    return Reply(200, force_session(req.root, req.params["env"], req.params["session"]))


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
    except ValueError as e:
        return Reply(400, {"error": str(e)})


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
    return Reply(200, [asdict(e) for e in req.record().events(asked.since, asked.last)])


@route("GET", "/api/{env}/settings")
def get_settings(req: Request) -> Reply:
    return Reply(200, settings(req.record()))


@route("POST", "/api/{env}/settings")
def post_settings(req: Request) -> Reply:
    record = req.record()
    before = switches(record)
    for key, value in req.body.items():
        if key == Record.features and isinstance(value, dict):
            moved, rows = renamed(), Features(record, actor=USER)
            asked = {**{moved[name]: on for name, on in value.items() if name in moved}, **{name: on for name, on in value.items() if name not in moved}}
            for name in (name for name in asked if "." not in name):
                rows.switch(name, asked[name])
            record.set_setting(key, {**{n: o for n, o in record.features.items() if "." in n},
                                     **{n: o for n, o in asked.items() if "." in n}})
            continue
        record.set_setting(key, value)
    after = switches(record)
    aliases = renamed()
    turned = [f"{name} {'on' if on else 'off'}" for name, on in after.items() if name not in aliases and before.get(name) != on]
    if turned:
        Nudges(record, actor=USER)._to_primary(f"the user turned {', '.join(turned)}", "journal settings shows every switch")
    return Reply(200, settings(record))


@route("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = version()
    latest = upstream(req.root)
    return Reply(200, {"installed": installed, "latest": latest, "newer": newer(latest, installed)})


@route("POST", "/api/upgrade")
def post_upgrade(req: Request) -> Reply:
    from install import upgrade
    return Reply(200, {"lines": upgrade(req.root.parent, req.root)})


@route("POST", "/api/run")
def post_run(req: Request) -> Reply:
    from commands.cli import captured
    raw = req.body.get("_raw") or b""
    args = [a for a in raw.decode().split("\0") if a]
    for flag, given in (("--as", req.query.get("actor")), ("--default-env", req.query.get("env")), ("--cwd", req.query.get("cwd")), ("--plugin", req.query.get("plugin"))):
        if given and flag not in args:
            args = [flag, given, *args]
    output, code = captured(args, req.root)
    timed = not any(networked(a, b) for a, b in zip(args, args[1:]))
    if code is None:
        return Reply(409, output, kind=PLAIN, timed=timed)
    return Reply(200 if not code else 400, output, kind=PLAIN, timed=timed)


@route("GET", "/api/{env}/changes")
def get_changes(req: Request) -> Reply:
    from features.work_tracking.tracker import changes
    return Reply(200, {"changes": list(reversed(changes(req.record())))})


@route("GET", "/api/{env}/bar")
def get_bar(req: Request) -> Reply:
    from features.status_bar.bar import current
    return Reply(200, current(req.record()))


@route("POST", "/api/stop")
def post_stop(req: Request) -> Reply:
    from engine.stop import ask
    ask(req.root)
    return Reply(200, {"stopping": True})


PROBED: list = [0.0, []]
PROBE_FOR = 3.0
PROBE_WAIT = 0.25


def identity_at(port: int):
    return viewer.identity(f"http://127.0.0.1:{port}/", PROBE_WAIT)


def probe() -> None:
    with ThreadPoolExecutor(len(viewer.PORTS)) as pool:
        PROBED[:] = [time.time(), [(port, got) for port, got in zip(viewer.PORTS, pool.map(identity_at, viewer.PORTS)) if got]]


@route("GET", "/api/journals")
def get_journals(req: Request) -> Reply:
    if not PROBED[0]:
        probe()
    elif time.time() - PROBED[0] >= PROBE_FOR:
        PROBED[0] = time.time()
        threading.Thread(target=probe, daemon=True).start()
    found = [{"port": port, "project": got.project, "version": got.version, "root": got.root, "current": got.root == str(req.root), "running": True}
             for port, got in PROBED[1]]
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


def listed_types() -> list[str]:
    return [t for t, c in CONTROLLERS.items() if tuple(c.resource.notified) != (AGENT,)]


def attached_file(record, type_: str, r, name: str, f: Path) -> dict:
    return {"type": type_, "n": r.n, "title": r.title, "name": name, "description": r.files.get(name, ""), "size": f.stat().st_size,
            "at": f.stat().st_mtime, "image": (mimetypes.guess_type(name)[0] or "").startswith("image/"),
            "url": f"/api/{record.env}/{type_}/{r.n}/files/{name}"}


@route("GET", "/api/{env}/files")
def get_files(req: Request) -> Reply:
    record = req.record()
    out = []
    for type_ in listed_types():
        c = CONTROLLERS[type_](record, actor=USER)
        out += [attached_file(record, type_, r, name, c.folder(r.n) / name) for r in c._attached() for name in r.files if (c.folder(r.n) / name).is_file()]
    return Reply(200, sorted(out, key=lambda x: -x["at"]))


@route("GET", "/api/{env}/project-files")
def get_project_files(req: Request) -> Reply:
    project = req.root.parent.resolve()
    folder = (project / req.query.get("folder", "")).resolve()
    if not folder.is_dir() or (folder != project and project not in folder.parents):
        raise Missing(f"no folder {req.query.get('folder', '')} in the project")
    out = []
    for entry in os.scandir(folder):
        if entry.name.startswith(".") or entry.name in UNLISTED:
            continue
        inside = entry.is_dir()
        out.append({"path": str(Path(entry.path).relative_to(project)), "name": entry.name, "folder": inside,
                    **({} if inside else {"size": entry.stat().st_size, "kind": mimetypes.guess_type(entry.name)[0] or ""})})
    return Reply(200, sorted(out, key=lambda x: (not x["folder"], x["name"].lower())))


def transcript_of(req: Request, session: str = "") -> Reply:
    row = Agents(req.record(), actor=USER).load(int(req.params["n"]))
    provider = PROVIDERS[row.provider]() if row.provider in PROVIDERS and row.transcript else None
    path = Path(row.transcript) if provider else None
    if session:
        known = any(r.get("session") == session for r in row.subagent_rows)
        path = provider.subagent_transcript(path, session) if provider and known else None
        if not path:
            raise Missing("no such subagent session")
    turns = provider.transcript(path) if path else []
    asked = req.query_as(TranscriptQuery)
    return Reply(200, page(turns, asked.since, asked.before, asked.last))


@route("GET", "/api/{env}/agent/{n}/transcript")
def get_transcript(req: Request) -> Reply:
    return transcript_of(req)


@route("GET", "/api/{env}/agent/{n}/subagent/{session}/transcript")
def get_subagent_transcript(req: Request) -> Reply:
    return transcript_of(req, req.params["session"])


@route("GET", "/api/pages")
def get_pages(req: Request) -> Reply:
    from engine.services import specs, status
    from engine.services import plugins as installed
    from features.plugins.declared import declared
    from features.plugins.lifecycle import called
    where = {spec.id: spec for spec in specs(req.root)}
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
    return Reply(200, listed(req.root))


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
    from features.plugins.source import previewed, staged
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
    from features.plugins.source import previewed, staged
    row = Plugins(req.record(), actor=USER).load(int(req.params["n"]))
    where, manifest, commit, linked = staged(req.root, row.source, row.revision, VERSION)
    try:
        return Reply(200, {**previewed(manifest, row.source, commit), "current": commit == row.commit, "changes": changed(Manifest.of(row.manifest), manifest)}, timed=False)
    finally:
        drop(where, linked)


@route("GET", "/api/plugins/{name}/log")
def get_plugin_log(req: Request) -> Reply:
    from features.plugins.source import log
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
    sha = req.params["sha"]
    if not re.fullmatch(r"[0-9a-f]{7,40}", sha):
        raise Missing("not a commit")
    head = ran(["git", "show", "-s", "--format=%H%x1f%an%x1f%at%x1f%s%x1f%b", sha], req.root.parent)
    if head is None:
        raise Missing("git did not answer")
    stat = git(["show", "--stat=120", "--format=", sha], req.root.parent)
    diff = git(["show", "--format=", "--no-color", sha], req.root.parent, timeout=10)
    if head.returncode:
        raise Missing(f"no commit {sha}")
    full, author, at, subject, body = (head.stdout.rstrip("\n").split("\x1f", 4) + ["", "", "", ""])[:5]
    return Reply(200, {"sha": full, "author": author, "at": float(at) if at else 0.0, "subject": subject, "body": body, "stat": stat, "diff": diff[:200000]})


@route("GET", "/api/{env}/file")
def get_file_text(req: Request) -> Reply:
    project = req.root.parent.resolve()
    asked = req.query_as(FileQuery).path
    candidate = Path(asked).expanduser() if Path(asked).is_absolute() else project / asked
    target = candidate.resolve()
    if asked and not Path(asked).is_absolute() and not target.is_file():
        matches = matching(project, asked)
        if len(matches) > 1:
            return Reply(200, {"matches": matches})
        target = project / matches[0] if matches else target
    home = project if project in target.parents else other_project(target)
    if not asked or not home or not target.is_file():
        raise Missing(f"no file {asked} in the project")
    raw = target.read_bytes()[:400000]
    kind = mimetypes.guess_type(target.name)[0] or ""
    text = "" if kind.startswith("image/") else raw.decode("utf-8", errors="replace")
    elsewhere = {} if home == project else {"project": home.name, "root": str(home)}
    return Reply(200, {"path": str(target.relative_to(home)), "size": target.stat().st_size, "kind": kind, "text": text, "lines": len(text.splitlines()), **elsewhere})


def other_project(target: Path) -> Path | None:
    home = next((folder for folder in target.parents if (folder / ".git").exists()), None)
    if not home or any(part.startswith(".") for part in target.relative_to(home).parts):
        return None
    return home


@route("GET", "/api/{env}/diff")
def get_file_diff(req: Request) -> Reply:
    project = req.root.parent.resolve()
    asked = req.query_as(FileQuery).path
    target = (project / asked).resolve()
    if not asked or project not in target.parents:
        raise Missing(f"no file {asked} in the project")
    relative = str(target.relative_to(project))
    diff = git(["diff", "--no-color", "HEAD", "--", relative], project, timeout=10)
    if not diff and target.is_file() and not git(["ls-files", "--", relative], project):
        diff = git(["diff", "--no-color", "--no-index", "--", "/dev/null", relative], project, timeout=10)
    return Reply(200, {"path": relative, "diff": diff[:200000]})


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
            matches = [{"name": name, "tags": tags, "url": f"/api/{record.env}/{type_}/{r.n}/files/{quote(name)}"}
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
                    yield f"id: {e.id}\ndata: {json.dumps(asdict(e))}\n\n".encode()
                except Empty:
                    yield b": keep\n\n"
        finally:
            off()
    return Reply(200, kind="text/event-stream", chunks=chunks())


@dataclass(frozen=True)
class ListingQuery(Loaded):
    n: str = ""
    last: int = LAST
    completed: str = ""
    before: int = 0
    since: float = 0.0
    by: str = ""


@dataclass(frozen=True)
class Listing:
    only: frozenset
    last: int
    completed: bool
    before: int
    since: float
    by_updated: bool

    @classmethod
    def from_query(cls, query: dict) -> "Listing":
        asked = ListingQuery.from_json(query)
        only = frozenset(int(n) for n in asked.n.split(",") if n)
        return cls(only=only, last=0 if only else asked.last, completed=asked.completed in ("1", "true"), before=asked.before,
                   since=asked.since, by_updated=asked.by == "updated")


def listing(controller, record, wanted: Listing) -> dict:
    since, only, last = wanted.since, wanted.only, wanted.last
    rows = [row for row in controller.summaries() if (since or only or not row["deleted"]) and (wanted.completed or not row["completed"])
            and (not wanted.before or row["n"] < wanted.before) and row["updated"] > since and (not only or row["n"] in only)]
    if wanted.by_updated:
        rows.sort(key=lambda row: row["updated"])
    kept = rows[-last:] if last else rows
    if wanted.completed and last:
        standing = [row for row in rows if not row["completed"]][None if controller.resource.listed_open else -last:]
        kept = sorted({row["n"]: row for row in (*standing, *kept)}.values(), key=lambda row: row["n"])
    stamp = settled(record)
    return {"rows": [view for row in kept if (view := readable(controller, record, row["n"], row.get("stamp"), stamp))], "more": len(rows) > len(kept)}


def readable(controller, record, n: int, row_stamp, settings: tuple) -> dict | None:
    try:
        return viewed(controller, record, n, row_stamp, settings)
    except Refused:
        return None


VIEWED: dict[tuple, tuple] = {}


def viewed(controller, record, n: int, row_stamp, settings: tuple) -> dict:
    key = (str(record.home), controller.type, n)
    stamp = (row_stamp, settings)
    held = VIEWED.get(key)
    if not row_stamp or not held or held[0] != stamp:
        if len(VIEWED) >= KEEP_SHAPED:
            VIEWED.clear()
        held = VIEWED[key] = (stamp, shaped(controller.load(n), record, VIEWER))
    return held[1]


def counted(record, types) -> dict:
    out = {}
    for type_, controller in ((t, CONTROLLERS[t]) for t in types):
        tally = {"all": 0, "open": 0, "unread": 0}
        for row in controller(record, actor=USER).summaries():
            if row["deleted"] or row.get("hidden"):
                continue
            tally["all"] += 1
            if not row["completed"]:
                tally["open"] += 1
                tally["unread"] += USER not in (row.get("seen") or [])
        out[type_] = tally
    return out


@route("GET", "/api/{env}/dashboard")
def get_dashboard(req: Request) -> Reply:
    record = req.record()
    asked = req.query_as(DashboardQuery)
    wanted = [t for t in asked.types.split(",") if t in CONTROLLERS]
    lists = {t: listing(CONTROLLERS[t](record, actor=USER), record, Listing.from_query(req.query)) for t in wanted}
    whole = "events" in req.query
    return Reply(200, {"rows": lists, "counts": counted(record, [t for t, c in CONTROLLERS.items() if c.resource.in_sidebar or c.resource.needs_attention or t in wanted] if whole else wanted), **({"events": [asdict(e) for e in record.events(0, asked.events)],
                                           "settings": settings(record)} if whole else {})})


@route("GET", "/api/{env}/{type}")
def get_all(req: Request) -> Reply:
    return Reply(200, listing(req.controller(), req.record(), Listing.from_query(req.query)))


@route("POST", "/api/{env}/{type}")
def post_create(req: Request) -> Reply:
    controller = req.controller()
    return Reply(201, shaped(controller.create(**{**req.body, "title": req.body.get("title") or titled(req.body.get("brief", ""))}), req.record(), VIEWER))


@route("GET", "/api/{env}/{type}/{n}")
def get_one(req: Request) -> Reply:
    try:
        controller = req.controller()
        n = int(req.params["n"])
        return Reply(200, shaped(controller.show(n) if controller.resource.cleared_by == OPENED else controller.load(n), req.record(), VIEWER))
    except Refused as e:
        raise Missing(str(e))


@route("GET", "/api/{env}/{type}/{n}/markdown")
def get_markdown(req: Request) -> Reply:
    from features.format import markdown
    return Reply(200, markdown(req.controller().load(int(req.params["n"])), req.record()).encode(), "text/markdown; charset=utf-8")


@route("GET", "/api/{env}/{type}/{n}/files/{name}")
def get_file(req: Request) -> Reply:
    f = req.controller().folder(int(req.params["n"])) / req.params["name"]
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
            f = Path(folder) / Path(name).name
            f.write_bytes(part.get_payload(decode=True))
            controller.attach(n, str(f))
            names.append(f.name)
    return Reply(200, {"files": names})


@route("POST", "/api/{env}/{type}/read-all")
def post_read_all(req: Request) -> Reply:
    controller = req.controller()
    return Reply(200, represented(controller.read_all(req.body.get("numbers", [])), req.record()))


@route("POST", "/api/{env}/{type}/{action}")
def post_action_bare(req: Request) -> Reply:
    return Reply(201, represented(req.controller().method(req.params["action"])(**req.body), req.record()), timed=not networked(req.params["type"], req.params["action"]))


@route("POST", "/api/{env}/{type}/{n}/{action}")
def post_action(req: Request) -> Reply:
    got = req.controller().method(req.params["action"])(int(req.params["n"]), **req.body)
    return Reply(200, represented(got, req.record()), timed=not networked(req.params["type"], req.params["action"]))
