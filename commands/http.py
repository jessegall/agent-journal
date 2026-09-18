import json
import mimetypes
import re
import tempfile
from email import policy
from email.parser import BytesParser
from dataclasses import asdict, dataclass, field
from pathlib import Path
from queue import Empty, Queue
from typing import Callable, Iterator
from urllib.parse import unquote

import features
from controllers.types import CONTROLLERS
from engine import bus
from engine.manifest import manifest
from engine.record import Record
from resources.base import USER, Refused

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


def settings(record: Record) -> dict:
    return {"features": {name: f.enabled(record) for name, f in features.FEATURES.items()},
            "triggers": record.setting("triggers", {}), "keep": record.setting("keep", {})}


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
    names = [e.title for e in CONTROLLERS["environment"](Record(req.root, m["environment"]), actor=USER).all()]
    return Reply(200, {"project": m["project"], "root": str(req.root), "version": m["version"], "environments": names})


@route("GET", "/api/{env}/events")
def get_events(req: Request) -> Reply:
    return Reply(200, [asdict(e) for e in req.record().events(int(req.query.get("since") or 0))])


@route("GET", "/api/{env}/settings")
def get_settings(req: Request) -> Reply:
    return Reply(200, settings(req.record()))


@route("POST", "/api/{env}/settings")
def post_settings(req: Request) -> Reply:
    record = req.record()
    for key, value in req.body.items():
        record.set_setting(key, value)
    return Reply(200, settings(record))


@route("GET", "/api/{env}/files")
def get_files(req: Request) -> Reply:
    record = req.record()
    out = []
    for type_ in CONTROLLERS:
        c = CONTROLLERS[type_](record, actor=USER)
        for r in c.all():
            for name in r.data.get("files") or {}:
                f = c.folder(r.n) / name
                if f.is_file():
                    out.append({"type": type_, "n": r.n, "title": r.title, "name": name, "what": (r.data.get("files") or {}).get(name, ""), "size": f.stat().st_size,
                                "at": f.stat().st_mtime, "image": (mimetypes.guess_type(name)[0] or "").startswith("image/"),
                                "url": f"/api/{record.env}/{type_}/{r.n}/files/{name}"})
    return Reply(200, sorted(out, key=lambda x: -x["at"]))


@route("GET", "/api/{env}/search")
def get_search(req: Request) -> Reply:
    term = req.query.get("q", "")
    record = req.record()
    return Reply(200, [shaped(r) for type_ in CONTROLLERS for r in CONTROLLERS[type_](record, actor=USER).search(term)] if term else [])


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


@route("POST", "/api/{env}/{type}/{action}")
def post_action_bare(req: Request) -> Reply:
    return Reply(201, shaped(req.controller().method(req.params["action"])(**req.body)))


@route("POST", "/api/{env}/{type}/{n}/{action}")
def post_action(req: Request) -> Reply:
    got = req.controller().method(req.params["action"])(int(req.params["n"]), **req.body)
    return Reply(200, shaped(got) if got is not None else {"ok": True})
