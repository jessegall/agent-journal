import json
import mimetypes
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Iterator
from urllib.parse import unquote
import features
from features.base import generation
from controllers.types import CONTROLLERS
from engine import bus, runtime
from engine.markers import plain
from engine.record import Record
from engine.watch import threw
from features.format import formatted
from resources.base import as_dict, USER, Refused
from engine.package import data


WEB = data("web", "dist")

SAID = ("title", "abstract", "brief", "outcome")
PLAIN_FIELDS = ("title", "abstract")

JSON = "application/json"

PLAIN = "text/plain; charset=utf-8"

SHAPED: dict = {}

KEEP_SHAPED = 5000

def settled(record) -> tuple:
    try:
        stamp = (record.home / "settings.json").stat().st_mtime_ns
    except OSError:
        stamp = 0
    return stamp, generation()


def shaped(r, record=None, surface: str = "") -> dict:
    key = (str(record.home), r.type, r.n, r.updated, surface, settled(record)) if record is not None and hasattr(r, "updated") else None
    if key in SHAPED:
        return SHAPED[key]
    out = shaping(r, record, surface)
    if key:
        if len(SHAPED) >= KEEP_SHAPED:
            SHAPED.clear()
        SHAPED[key] = out
    return out


def shaping(r, record=None, surface: str = "") -> dict:
    row = as_dict(r)
    fields = {key: formatted(row.get(key), record, surface) for key in SAID if row.get(key)}
    fields = {**fields, **{key: plain(fields[key]) for key in PLAIN_FIELDS if key in fields}}
    parts = [{**s, "body": formatted(s.get("body"), record, surface)} for s in row.get("sections") or []]
    data = {key: [{**item, **{sub: formatted(item.get(sub), record, surface) for sub in subs if item.get(sub)}} for item in row["data"].get(key) or []]
            for key, subs in getattr(r, "formatted_data", {}).items() if row.get("data", {}).get(key)}
    return {**row, **fields, **({"sections": parts} if parts else {}), **({"data": {**row["data"], **data}} if data else {})}


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
    timed: bool = True

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
    return later(reply, lambda: faults.reports.spent(root, env, "hook" if "/hook/" in path else "request", f"{method} {path}", took, working, profile))


def dispatch(method: str, path: str, root: Path, query: dict, body: dict) -> Reply:
    found = resolve(method, path)
    if not found:
        return static(path) if method == "GET" else Reply(404, {"error": "no such route"})
    r, params = found
    faults = features.FEATURES.get("dev_faults")
    profile = faults.reports.profiler(root) if faults else None
    began = (time.perf_counter(), time.thread_time())
    try:
        with bus.held() as queued:
            try:
                if profile:
                    profile.enable()
            except ValueError:
                profile = None
            try:
                reply = r.handler(Request(root, params, query, body))
            finally:
                if profile:
                    profile.disable()
        return guarded(timed(later(reply, lambda: bus.release(queued)), root, params.get("env") or "main", method, path, began, profile),
                       root, env_of(root, params, query), f"after {method} {path}")
    except Missing as e:
        return Reply(404, {"error": str(e)})
    except Refused as e:
        return Reply(400, {"error": str(e)})
    except (TypeError, AttributeError) as e:
        threw(root, env_of(root, params, query), f"{method} {path}")
        return Reply(400, {"error": f"not an action here: {e}"})
    except Exception as e:
        threw(root, env_of(root, params, query), f"{method} {path}")
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


def env_of(root: Path, params: dict, query: dict) -> str:
    return params.get("env") or query.get("env") or runtime.env(root)


def represented(got, record=None):
    if got is None:
        return {"ok": True}
    if isinstance(got, list):
        return [shaped(item, record) if hasattr(item, "ref") else item for item in got]
    return shaped(got, record) if hasattr(got, "ref") else got


def static(path: str) -> Reply:
    f = WEB / (path.strip("/") or "index.html")
    if not f.is_file():
        f = WEB / "index.html"
    if not f.is_file():
        return Reply(404, {"error": "no web build; run npm run build in web"})
    return Reply(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")
