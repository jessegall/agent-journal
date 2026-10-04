import json
import mimetypes
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Iterator
from urllib.parse import unquote
import features
from controllers.types import CONTROLLERS
from engine import bus, runtime
from engine.collecting import collecting
from engine.record import Record
from controllers.faults import threw
from features.shaping import shaped
from resources.base import USER, Refused
from engine.package import data
from engine.fields import Loaded
from engine.paths import contained, environment_path


WEB = data("web", "dist")

JSON = "application/json"

PLAIN = "text/plain; charset=utf-8"


@dataclass(frozen=True)
class Named(Loaded):
    env: str = ""


@dataclass
class Request:
    root: Path
    params: dict
    query: dict
    body: dict
    kept: Record | None = None

    def record(self) -> Record:
        if self.kept is None:
            self.kept = Record(self.root, self.params["env"], memo=True)
        return self.kept

    def query_as(self, kind):
        return kind.from_json(self.query)

    def body_as(self, kind):
        return kind.from_json(self.body)

    @property
    def env(self) -> str:
        named = Named.from_json(self.params).env or Named.from_json(self.query).env
        return named if named else runtime.env(self.root)

    def controller(self):
        type_ = self.params["type"]
        if type_ not in CONTROLLERS:
            raise Missing(f"no type {type_}")
        self.body.pop("actor", None)
        return CONTROLLERS[type_](self.record(), actor=USER)


@dataclass
class Reply:
    code: int = 200
    body: object = None
    kind: str = JSON
    chunks: Iterator[bytes] | None = None
    after: Callable[[], None] | None = None
    timed: bool = True
    named: str | None = None

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


def later(reply: Reply, then) -> Reply:
    earlier = reply.after

    def after() -> None:
        if earlier:
            earlier()
        then()
    reply.after = after
    return reply


def timed(reply: Reply, root: Path, env: str, method: str, path: str, began: tuple, profile=None) -> Reply:
    faults = features.FEATURES.get("dev_faults")
    if not faults or not reply.timed:
        return reply
    took = (time.perf_counter() - began[0]) * 1000
    working = (time.thread_time() - began[1]) * 1000
    garbage = (collecting() - began[2]) * 1000
    name = f"{method} {path}" if reply.named is None else f"{method} {path} ({reply.named})"
    return later(reply, lambda: faults.reports.spent(root, env, "hook" if "/hook/" in path else "request", name, took, working, profile, garbage))


def known_environment(root: Path, env: str) -> bool:
    try:
        return environment_path(Path(root) / "environments", env).is_dir()
    except Refused:
        return False


def dispatch(method: str, path: str, root: Path, query: dict, body: dict) -> Reply:
    found = resolve(method, path)
    if not found:
        if method != "GET":
            return Reply(404, {"error": "no such route"})
        try:
            return static(path)
        except Refused as error:
            return Reply(400, {"error": str(error)})
    r, params = found
    if method == "GET" and "env" in params and not known_environment(root, params["env"]):
        return Reply(404, {"error": f"no environment {params['env']}"})
    faults = features.FEATURES.get("dev_faults")
    profile = faults.reports.profiler(root) if faults else None
    began = (time.perf_counter(), time.thread_time(), collecting())
    req = Request(root, params, query, body)
    try:
        with bus.held() as queued:
            try:
                if profile:
                    profile.enable()
            except ValueError:
                profile = None
            try:
                reply = r.handler(req)
            finally:
                if profile:
                    profile.disable()
        return guarded(timed(later(reply, lambda: bus.release(queued)), root, params.get("env") or "main", method, path, began, profile),
                       root, req.env, f"after {method} {path}")
    except Missing as e:
        return Reply(404, {"error": str(e)})
    except Refused as e:
        return Reply(400, {"error": str(e)})
    except (TypeError, AttributeError) as e:
        threw(root, req.env, f"{method} {path}")
        return Reply(400, {"error": f"not an action here: {e}"})
    except Exception as e:
        threw(root, req.env, f"{method} {path}")
        return Reply(500, {"error": f"{type(e).__name__}: {e}"})


def guarded(reply: Reply, root: Path, env: str, where: str) -> Reply:
    after = reply.after
    if not after:
        return reply

    def run() -> None:
        try:
            after()
        except Exception:
            threw(root, env, where)
    reply.after = run
    return reply


def represented(got, record=None):
    return {"ok": True} if got is None else rendered(got, record)


def rendered(got, record):
    if hasattr(got, "ref"):
        return shaped(got, record)
    if isinstance(got, list):
        return [rendered(item, record) for item in got]
    if isinstance(got, dict):
        return {key: rendered(value, record) for key, value in got.items()}
    return got


def static(path: str) -> Reply:
    f = contained(WEB, path.lstrip("/") or "index.html", nested=True)
    if not f.is_file():
        f = WEB / "index.html"
    if not f.is_file():
        return Reply(404, {"error": "no web build; run npm run build in web"})
    return Reply(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")
