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
from features.appointments.appoint import appoint, online
from features.extension.package import archive as extension_archive, info as extension_info
from features.hub.summary import summarize
from features.identity.color import identity, set_color
from features.sessioncontrol.control import options as control_options, request as control_session
from features.skills.catalogue import SKILL, always, catalogue, load_now, skills
from features.usage.usage import options as usage_options
from controllers.types import Agents, Asks, CONTROLLERS, Environments
from engine import bus, viewer
from engine.manifest import manifest
from engine.record import Record
from engine.transcript import page
from providers import PROVIDERS
from resources.base import USER, Refused
from resources.types import Ask

WEB = Path(__file__).resolve().parents[1] / "web" / "dist"
JSON = "application/json"


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

    def bytes(self) -> bytes:
        return self.body if isinstance(self.body, bytes) else json.dumps(self.body).encode()


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


def shaped(r) -> dict:
    return {**asdict(r), "type": r.type, "ref": r.ref}


def represented(got):
    if got is None:
        return {"ok": True}
    if isinstance(got, list):
        return [shaped(item) if hasattr(item, "ref") else item for item in got]
    return shaped(got) if hasattr(got, "ref") else got


def settings(record: Record) -> dict:
    return {Record.features: {name: f.enabled(record) for name, f in features.FEATURES.items()},
            Record.triggers: record.triggers, Record.keep: record.keep}


def static(path: str) -> Reply:
    f = WEB / (path.strip("/") or "index.html")
    if not f.is_file():
        f = WEB / "index.html"
    if not f.is_file():
        return Reply(404, {"error": "no web build; run npm run build in web"})
    return Reply(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")


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


@route("POST", "/api/{env}/agent/{session}/control")
def post_agent_control(req: Request) -> Reply:
    return Reply(200, control_session(req.root, req.params["env"], req.params["session"],
                                      str(req.body.get("action") or ""), str(req.body.get("value") or "")))


@route("GET", "/api/agent-usage/{provider}")
def get_agent_usage(req: Request) -> Reply:
    return Reply(200, usage_options(req.params["provider"]))


@route("POST", "/api/shown")
def post_shown(req: Request) -> Reply:
    target = req.root / "runtime" / "shown.log"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a") as out:
        out.write(f"{time.time():.3f}\t{json.dumps(req.body.get('shown') or [])}\t{req.body.get('command')!r}\n")
    return Reply(200, {"ok": True})


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


def newer(a: str, b: str) -> bool:
    key = lambda v: tuple(int(x) if x.isdigit() else 0 for x in v.split("."))
    return bool(a and b) and key(a) > key(b)


@route("GET", "/api/upstream")
def get_upstream(req: Request) -> Reply:
    installed = manifest(req.root)["version"]
    latest = upstream(req.root)
    return Reply(200, {"installed": installed, "latest": latest, "newer": newer(latest, installed)})


@route("POST", "/api/upgrade")
def post_upgrade(req: Request) -> Reply:
    from install import upgrade
    return Reply(200, {"lines": upgrade(req.root.parent, req.root)})


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
    f = driver_file(req.root, req.params["env"])
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps({"on": bool(req.body.get("on")), "url": req.body.get("url", ""), "title": req.body.get("title", ""), "at": time.time()}))
    return Reply(200, {"ok": True})


@route("POST", "/api/{env}/browser/pending")
def post_pending(req: Request) -> Reply:
    asks = Asks(req.record(), actor=USER).pending()
    return Reply(200, {"data": [{"n": a.n, Ask.op: a.op, Ask.args: a.args} for a in asks]})


@route("POST", "/api/{env}/browser/{n}/result")
def post_result(req: Request) -> Reply:
    got = Asks(req.record(), actor=USER).answer(int(req.params["n"]), req.body.get("text", ""), ok=bool(req.body.get("ok", True)), files=req.body.get("files") or [])
    return Reply(200, shaped(got))


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


@route("GET", "/api/{env}/project-files")
def get_project_files(req: Request) -> Reply:
    project = req.root.parent.resolve()
    out = []
    for folder, dirs, names in os.walk(project):
        dirs[:] = [name for name in dirs if not name.startswith(".") and name != "__pycache__" and name != "node_modules"]
        for name in names:
            path = Path(folder) / name
            if not path.is_file():
                continue
            relative = path.relative_to(project)
            kind = mimetypes.guess_type(path.name)[0] or ""
            out.append({"path": str(relative), "size": path.stat().st_size, "kind": kind})
    return Reply(200, sorted(out, key=lambda x: x["path"].lower()))


@route("GET", "/api/{env}/agent/{n}/transcript")
def get_transcript(req: Request) -> Reply:
    row = Agents(req.record(), actor=USER).load(int(req.params["n"]))
    provider = PROVIDERS.get(row.provider)
    turns = provider().transcript(Path(row.transcript)) if provider and row.transcript else []
    return Reply(200, page(turns, int(req.query.get("since") or 0), int(req.query.get("before") or 0), int(req.query.get("last") or 300)))


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
            out.append({**shaped(r), "matches": matches})
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
    return Reply(200, [shaped(r) for r in req.controller().all()])


@route("POST", "/api/{env}/{type}")
def post_create(req: Request) -> Reply:
    return Reply(201, shaped(req.controller().create(**req.body)))


@route("GET", "/api/{env}/{type}/{n}")
def get_one(req: Request) -> Reply:
    try:
        return Reply(200, shaped(req.controller().show(int(req.params["n"]))))
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
    return Reply(200, represented(controller.read_all(req.body.get("numbers", []))))


@route("POST", "/api/{env}/{type}/{action}")
def post_action_bare(req: Request) -> Reply:
    return Reply(201, represented(req.controller().method(req.params["action"])(**req.body)))


@route("POST", "/api/{env}/{type}/{n}/{action}")
def post_action(req: Request) -> Reply:
    got = req.controller().method(req.params["action"])(int(req.params["n"]), **req.body)
    return Reply(200, represented(got))
