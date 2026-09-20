import json
import mimetypes
import os
import re
import subprocess
import tempfile
import time
from email import policy
from email.parser import BytesParser
from dataclasses import asdict, dataclass, field
from pathlib import Path
from queue import Empty, Queue
from typing import Callable, Iterator
from urllib.parse import quote, unquote
from urllib.request import urlopen

import features
from surfaces.appoint import appoint, online
from surfaces.package import archive as extension_archive, info as extension_info
from surfaces.summary import summarize
from surfaces.color import identity, set_color
from surfaces.updates import newer
from surfaces.control import force as force_session, options as control_options, request as control_session
from features.skills.catalogue import SKILL, always, catalogue, load_now, skills
from controllers.types import Agents, Asks, CONTROLLERS, Environments
from engine import bus, viewer
from engine.manifest import manifest
from engine.hooks import answer
from engine.record import Record
from engine.transcript import page
from providers import PROVIDERS
from features.format import formatted
from resources.base import shown as given, USER, Refused, titled
from resources.types import Ask
from engine.stored import write_json

WEB = Path(__file__).resolve().parents[1] / "web" / "dist"
SAID = ("brief",)
JSON = "application/json"
PLAIN = "text/plain; charset=utf-8"


def shaped(r, record=None) -> dict:
    row = given(r)
    return {**row, **{key: formatted(row.get(key), record) for key in SAID if row.get(key)}}


@dataclass
class Request:
    root: Path
    params: dict
    query: dict
    body: dict

    def record(self) -> Record:
        return Record(self.root, self.params["env"])

    def controller(self):
        type_ = self.params["type"]
        if type_ not in CONTROLLERS:
            raise Missing(f"no type {type_}")
        return CONTROLLERS[type_](self.record(), actor=self.body.pop("actor", USER))


@dataclass
class Reply:
    code: int = 200
    body: object = None
    kind: str = JSON
    chunks: Iterator[bytes] | None = None
    after: Callable[[], None] | None = None

    def bytes(self) -> bytes:
        if isinstance(self.body, bytes):
            return self.body
        return self.body.encode() if self.kind == PLAIN else json.dumps(self.body).encode()


class Missing(Exception):
    pass


@dataclass
class Route:
    method: str
    pattern: str
    handler: Callable[[Request], Reply]
    regex: re.Pattern = field(init=False)

    def __post_init__(self):
        self.regex = re.compile("^" + re.sub(r"{(\w+)}", r"(?P<\1>[^/]+)", self.pattern) + "$")


ROUTES: list[Route] = []


def route(method: str, pattern: str):
    def register(fn):
        ROUTES.append(Route(method, pattern, fn))
        return fn
    return register


def resolve(method: str, path: str) -> tuple[Route, dict] | None:
    for r in ROUTES:
        m = r.regex.match(path)
        if m and r.method == method:
            return r, {k: unquote(v) for k, v in m.groupdict().items()}
    return None


def dispatch(method: str, path: str, root: Path, query: dict, body: dict) -> Reply:
    found = resolve(method, path)
    if not found:
        return static(path) if method == "GET" else Reply(404, {"error": "no such route"})
    r, params = found
    try:
        return r.handler(Request(root, params, query, body))
    except Missing as e:
        return Reply(404, {"error": str(e)})
    except Refused as e:
        return Reply(400, {"error": str(e)})
    except (TypeError, AttributeError) as e:
        return Reply(400, {"error": f"not an action here: {e}"})


def represented(got, record=None):
    if got is None:
        return {"ok": True}
    if isinstance(got, list):
        return [shaped(item, record) if hasattr(item, "ref") else item for item in got]
    return shaped(got, record) if hasattr(got, "ref") else got


def settings(record: Record) -> dict:
    return {Record.features: {name: f.enabled(record) for name, f in features.FEATURES.items()},
            Record.triggers: record.triggers, Record.keep: record.keep,
            Record.answers: {"hold": features.FEATURES["answers"].held_for(record)}}


def static(path: str) -> Reply:
    f = WEB / (path.strip("/") or "index.html")
    if not f.is_file():
        f = WEB / "index.html"
    if not f.is_file():
        return Reply(404, {"error": "no web build; run npm run build in web"})
    return Reply(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")


@route("POST", "/api/hook/{provider}")
def post_hook(req: Request) -> Reply:
    if Path(req.query.get("root") or "").resolve() != req.root.resolve() or req.params["provider"] not in PROVIDERS:
        return Reply(409, {})
    provider = PROVIDERS[req.params["provider"]]()
    with bus.held() as heard:
        out = answer(provider, req.root, req.body, int(req.query.get("pid") or 0), req.query.get("env") or "")
    return Reply(403 if provider.refused(out) else 200, out, after=lambda: bus.release(heard))


@route("GET", "/api/manifest")
def get_manifest(req: Request) -> Reply:
    return Reply(200, manifest(req.root))


@route("GET", "/api/identity")
def get_identity(req: Request) -> Reply:
    m = manifest(req.root)
    names = [e.title for e in Environments(Record(req.root, m["environment"]), actor=USER).all()]
    return Reply(200, {**identity(req.root), "root": str(req.root), "version": m["version"], "environments": names})


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
    return Reply(200, appoint(req.root, req.params["env"], str(req.body.get("session") or "")))


@route("GET", "/api/agent-controls/{provider}")
def get_agent_controls(req: Request) -> Reply:
    return Reply(200, control_options(req.params["provider"], str(req.query.get("model") or "")))


@route("POST", "/api/{env}/agent/{session}/force")
def post_agent_force(req: Request) -> Reply:
    return Reply(200, force_session(req.root, req.params["env"], req.params["session"]))


@route("POST", "/api/{env}/agent/{session}/control")
def post_agent_control(req: Request) -> Reply:
    return Reply(200, control_session(req.root, req.params["env"], req.params["session"],
                                      str(req.body.get("action") or ""), str(req.body.get("value") or "")))


def provider_of(req: Request):
    if req.params["provider"] not in PROVIDERS:
        raise Missing(f"no provider {req.params['provider']}")
    return PROVIDERS[req.params["provider"]]()


@route("GET", "/api/agent-hooks/{provider}")
def get_agent_hooks(req: Request) -> Reply:
    provider = provider_of(req)
    return Reply(200, {"path": str(provider.config(req.root.parent).relative_to(req.root.parent)), "hooks": provider.hooks(req.root.parent)})


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
    return Reply(200, [asdict(e) for e in req.record().events(int(req.query.get("since") or 0), int(req.query.get("last") or 0))])


@route("GET", "/api/{env}/settings")
def get_settings(req: Request) -> Reply:
    return Reply(200, settings(req.record()))


@route("POST", "/api/{env}/settings")
def post_settings(req: Request) -> Reply:
    record = req.record()
    for key, value in req.body.items():
        record.set_setting(key, value)
    return Reply(200, settings(record))


UPSTREAM = "https://raw.githubusercontent.com/jessegall/agent-journal/main/VERSION"


def upstream(root: Path) -> str:
    cache = root / "runtime" / "upstream.cache"
    try:
        if cache.is_file() and time.time() - cache.stat().st_mtime < 900:
            return cache.read_text().strip()
        with urlopen(UPSTREAM, timeout=3) as r:
            latest = r.read().decode().strip()
    except OSError:
        return cache.read_text().strip() if cache.is_file() else ""
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_text(latest)
    return latest


@route("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = manifest(req.root)["version"]
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
    for flag, given in (("--as", req.query.get("actor")), ("--env", req.query.get("env"))):
        if given and flag not in args:
            args = [flag, given, *args]
    said, code = captured(args, req.root)
    if code is None:
        return Reply(409, said, kind=PLAIN)
    return Reply(200 if not code else 400, said, kind=PLAIN)


@route("GET", "/api/{env}/changes")
def get_changes(req: Request) -> Reply:
    from features.work.tracker import changes
    return Reply(200, {"changes": list(reversed(changes(req.record())))})


@route("GET", "/api/{env}/bar")
def get_bar(req: Request) -> Reply:
    from features.statusline.feature import bar
    rows = [r for r in Agents(req.record(), actor=USER).all() if not r.parent]
    newest = max(rows, key=lambda r: float(r.at or 0)) if rows else None
    return Reply(200, bar(newest, time.time()) if newest else {"queue": []})


@route("POST", "/api/stop")
def post_stop(req: Request) -> Reply:
    from engine.stop import ask
    ask(req.root)
    return Reply(200, {"stopping": True})


@route("GET", "/api/journals")
def get_journals(req: Request) -> Reply:
    found = []
    for port in viewer.PORTS:
        try:
            with urlopen(f"http://127.0.0.1:{port}/api/identity", timeout=0.25) as r:
                got = json.loads(r.read())
        except (OSError, ValueError):
            continue
        found.append({"port": port, "project": got.get("project", ""), "version": got.get("version", ""), "root": got.get("root", ""), "current": got.get("root") == str(req.root), "running": True})
    up = {str(req.root.resolve()), *(str(Path(j["root"]).resolve()) for j in found)}
    for j in viewer.known():
        if j["root"] not in up and Path(j["root"]).is_dir():
            found.append({"port": 0, "project": j["project"], "version": "", "root": j["root"], "current": False, "running": False, "at": j["at"]})
    return Reply(200, found)


@route("POST", "/api/journals/forget")
def post_forget(req: Request) -> Reply:
    viewer.forget(str(req.body.get("root") or ""))
    return Reply(200, {"ok": True})


@route("POST", "/api/{env}/browser/driver")
def post_driver(req: Request) -> Reply:
    from controllers.types import driver_file
    write_json(driver_file(req.root, req.params["env"]), {"on": bool(req.body.get("on")), "url": req.body.get("url", ""), "title": req.body.get("title", ""), "at": time.time()})
    return Reply(200, {"ok": True})


@route("POST", "/api/{env}/browser/pending")
def post_pending(req: Request) -> Reply:
    asks = Asks(req.record(), actor=USER).pending()
    return Reply(200, {"data": [{"n": a.n, Ask.op: a.op, Ask.args: a.args} for a in asks]})


@route("POST", "/api/{env}/browser/{n}/result")
def post_result(req: Request) -> Reply:
    got = Asks(req.record(), actor=USER).answer(int(req.params["n"]), req.body.get("text", ""), ok=bool(req.body.get("ok", True)), files=req.body.get("files") or [])
    return Reply(200, shaped(got, req.record()))


@route("GET", "/api/{env}/skills")
def get_skills(req: Request) -> Reply:
    return Reply(200, skills(req.record(), int(req.query.get("agent") or 0)))


@route("GET", "/api/{env}/skills/{name}")
def get_skill(req: Request) -> Reply:
    root = req.record().root.parent
    hit = next((s for s in catalogue(root) if s[SKILL.name] == req.params["name"]), None)
    if not hit:
        return Reply(404, {"error": f"no skill {req.params['name']}"})
    return Reply(200, {**hit, "text": (root / hit[SKILL.path]).read_text(errors="replace")})


@route("POST", "/api/{env}/skills/{name}/load")
def post_skill_load(req: Request) -> Reply:
    return Reply(200, {"said": load_now(req.record(), req.params["name"])})


@route("POST", "/api/{env}/skills/{name}/always")
def post_skill_always(req: Request) -> Reply:
    record = req.record()
    got = always(record, req.params["name"], bool(req.body.get("on")))
    features.FEATURES["start"].write(None, record)
    return Reply(200, {"skills": got})


@route("GET", "/api/{env}/files")
def get_files(req: Request) -> Reply:
    record = req.record()
    out = []
    for type_ in CONTROLLERS:
        c = CONTROLLERS[type_](record, actor=USER)
        for r in c.all():
            for name in r.files:
                f = c.folder(r.n) / name
                if f.is_file():
                    out.append({"type": type_, "n": r.n, "title": r.title, "name": name, "what": r.files.get(name, ""), "size": f.stat().st_size,
                                "at": f.stat().st_mtime, "image": (mimetypes.guess_type(name)[0] or "").startswith("image/"),
                                "url": f"/api/{record.env}/{type_}/{r.n}/files/{name}"})
    return Reply(200, sorted(out, key=lambda x: -x["at"]))


def project_paths(project: Path) -> list[Path]:
    found = []
    for folder, dirs, names in os.walk(project):
        dirs[:] = [name for name in dirs if not name.startswith(".") and name != "__pycache__" and name != "node_modules"]
        found.extend(path for path in (Path(folder) / name for name in names) if path.is_file())
    return found


@route("GET", "/api/{env}/project-files")
def get_project_files(req: Request) -> Reply:
    project = req.root.parent.resolve()
    out = [{"path": str(path.relative_to(project)), "size": path.stat().st_size, "kind": mimetypes.guess_type(path.name)[0] or ""} for path in project_paths(project)]
    return Reply(200, sorted(out, key=lambda x: x["path"].lower()))


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
    return Reply(200, page(turns, int(req.query.get("since") or 0), int(req.query.get("before") or 0), int(req.query.get("last") or 300)))


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
    where = {spec["id"]: spec for spec in specs(req.root)}
    out = []
    for row in installed(req.root):
        plugin = str(row.manifest.get("name") or "")
        for page in row.manifest.get("pages") or []:
            sid = f"{plugin}.{page['service']}"
            spec, said = where.get(sid, {}), status(req.root, sid)
            out.append({"plugin": plugin, "name": page["name"], "title": page["title"], "icon": page.get("icon") or "plug",
                        "service": sid, "state": said.get("state") or "not running", "path": page.get("path") or "/",
                        "url": (spec.get("url") or said.get("url") or "") + (page.get("path") or "/"), "status": page.get("status") or ""})
    return Reply(200, out)


@route("GET", "/api/services")
def get_services(req: Request) -> Reply:
    from engine.services import specs, states
    known = {spec["id"]: spec for spec in specs(req.root)}
    said = states(req.root)
    out = []
    for sid in sorted({*known, *said}):
        spec, state = known.get(sid, {}), said.get(sid, {})
        out.append({"id": sid, "plugin": spec.get("plugin") or sid.split(".")[0], "service": spec.get("service") or sid.split(".", 1)[-1],
                    "state": state.get("state") or "not running", "why": state.get("why") or "", "url": spec.get("url") or state.get("url") or "",
                    "port": spec.get("port") or state.get("port") or 0, "since": state.get("started") or 0, "declared": sid in known})
    return Reply(200, out)


def tailed(path: Path, lines: int) -> str:
    try:
        text = path.read_text(errors="replace")
    except OSError:
        return ""
    return "\n".join(text.splitlines()[-lines:])


def asked_lines(req: Request) -> int:
    return int(req.query.get("lines") or 200)


@route("GET", "/api/services/{id}/log")
def get_service_log(req: Request) -> Reply:
    from engine.services import log_file
    return Reply(200, {"id": req.params["id"], "log": tailed(log_file(req.root, req.params["id"]), asked_lines(req))})


@route("GET", "/api/plugins/{name}/log")
def get_plugin_log(req: Request) -> Reply:
    from features.plugins.source import log
    return Reply(200, {"name": req.params["name"], "log": tailed(log(req.root, req.params["name"]), asked_lines(req))})


@route("POST", "/api/services/{id}")
def post_service(req: Request) -> Reply:
    from engine.services import DOWN, UP, want
    asked = str(req.body.get("want") or "").lower()
    if asked not in (UP, DOWN, "restart"):
        raise Missing("a service is asked to be up, down or restart")
    said = want(req.root, req.params["id"], DOWN if asked == DOWN else UP, nonce=time.time() if asked == "restart" else 0.0)
    return Reply(200, {"id": req.params["id"], **said})


@route("GET", "/api/{env}/commit/{sha}")
def get_commit(req: Request) -> Reply:
    sha = req.params["sha"]
    if not re.fullmatch(r"[0-9a-f]{7,40}", sha):
        raise Missing("not a commit")
    try:
        head = subprocess.run(["git", "show", "-s", "--format=%H%x1f%an%x1f%at%x1f%s%x1f%b", sha], cwd=req.root.parent, capture_output=True, text=True, timeout=5)
        stat = subprocess.run(["git", "show", "--stat=120", "--format=", sha], cwd=req.root.parent, capture_output=True, text=True, timeout=5).stdout
        diff = subprocess.run(["git", "show", "--format=", "--no-color", sha], cwd=req.root.parent, capture_output=True, text=True, timeout=10).stdout
    except (OSError, subprocess.SubprocessError):
        raise Missing("git did not answer")
    if head.returncode:
        raise Missing(f"no commit {sha}")
    full, author, at, subject, body = (head.stdout.rstrip("\n").split("\x1f", 4) + ["", "", "", ""])[:5]
    return Reply(200, {"sha": full, "author": author, "at": float(at or 0), "subject": subject, "body": body, "stat": stat, "diff": diff[:200000]})


@route("GET", "/api/{env}/file")
def get_file_text(req: Request) -> Reply:
    project = req.root.parent.resolve()
    asked = str(req.query.get("path") or "")
    candidate = Path(asked).expanduser() if Path(asked).is_absolute() else project / asked
    target = candidate.resolve()
    if asked and not Path(asked).is_absolute() and not target.is_file():
        tail = f"/{asked.lstrip('./')}"
        matches = sorted(str(path.relative_to(project)) for path in project_paths(project) if f"/{path.relative_to(project)}".endswith(tail))
        if len(matches) > 1:
            return Reply(200, {"matches": matches})
        target = project / matches[0] if matches else target
    if not asked or project not in target.parents or not target.is_file():
        raise Missing(f"no file {asked} in the project")
    raw = target.read_bytes()[:400000]
    kind = mimetypes.guess_type(target.name)[0] or ""
    text = "" if kind.startswith("image/") else raw.decode("utf-8", errors="replace")
    return Reply(200, {"path": str(target.relative_to(project)), "size": target.stat().st_size, "kind": kind, "text": text, "lines": len(text.splitlines())})


@route("GET", "/api/{env}/search")
def get_search(req: Request) -> Reply:
    term = req.query.get("q", "")
    if not term:
        return Reply(200, [])
    record = req.record()
    want = term.lower()
    out = []
    for type_ in CONTROLLERS:
        for r in CONTROLLERS[type_](record, actor=USER).search(term):
            matches = [{"name": name, "tags": tags, "url": f"/api/{record.env}/{type_}/{r.n}/files/{quote(name)}"}
                       for name, tags in r.files.items() if want in name.lower() or want in str(tags).lower()]
            out.append({**shaped(r, req.record()), "matches": matches})
    return Reply(200, out)


@route("GET", "/api/{env}/stream")
def get_stream(req: Request) -> Reply:
    env = req.params["env"]
    queue: Queue = Queue()
    off = bus.on(bus.ANY, lambda e, r: queue.put(e) if r is not None and r.env == env else None)

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


@route("GET", "/api/{env}/{type}")
def get_all(req: Request) -> Reply:
    controller = req.controller()
    last = int(req.query.get("last") or 0)
    if not last:
        return Reply(200, [shaped(r, req.record()) for r in controller.all()])
    rows = [row for row in controller.summaries() if not row["deleted"]]
    kept = [row for row in rows[:-last] if not row["completed"]] + rows[-last:]
    return Reply(200, {"rows": [shaped(controller.load(row["n"]), req.record()) for row in kept], "more": len(rows) > last})


@route("POST", "/api/{env}/{type}")
def post_create(req: Request) -> Reply:
    controller = req.controller()
    return Reply(201, shaped(controller.create(**{**req.body, "title": req.body.get("title") or titled(req.body.get("brief", ""))}), req.record()))


@route("GET", "/api/{env}/{type}/{n}")
def get_one(req: Request) -> Reply:
    try:
        return Reply(200, shaped(req.controller().show(int(req.params["n"])), req.record()))
    except Refused as e:
        raise Missing(str(e))


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
    return Reply(201, represented(req.controller().method(req.params["action"])(**req.body), req.record()))


@route("POST", "/api/{env}/{type}/{n}/{action}")
def post_action(req: Request) -> Reply:
    got = req.controller().method(req.params["action"])(int(req.params["n"]), **req.body)
    return Reply(200, represented(got, req.record()))
