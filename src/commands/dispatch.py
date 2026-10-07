import mimetypes
from pathlib import Path
from urllib.parse import unquote
from engine import bus
from engine.record import Record
from engine.timing import Stopwatch, profiler
from controllers.faults import threw
from features.format import shaped
from resources.base import Missing, Refused
from engine.package import data
from engine.memo import Memo
from features.phone.allow_list import reached
from features.routing import FEATURE_ROUTES, Reply, Request, Route
from engine.paths import contained, environment_home


WEB = data("web", "dist")

ROUTES: list[Route] = []
RANKED = Memo()

def route(method: str, pattern: str):
    def register(fn):
        ROUTES.append(Route(method, pattern, fn))
        return fn
    return register


def rank_routes() -> None:
    ROUTES.sort(key=lambda r: r.rank)


def ranked() -> list[Route]:
    return RANKED.get("routes", (len(ROUTES), FEATURE_ROUTES.version), lambda: sorted([*ROUTES, *FEATURE_ROUTES.each()], key=lambda r: r.rank))


def resolve(method: str, path: str) -> tuple[Route, dict] | None:
    for r in ranked():
        m = r.regex.match(path)
        if m and r.method == method:
            return r, {k: unquote(v) for k, v in m.groupdict().items()}
    return None


def reached_by_phone(method: str, path: str, query: dict, body: dict, environment: str) -> bool:
    found = resolve(method, path)
    return found is not None and reached(*found, query, body, environment)


def later(reply: Reply, then) -> Reply:
    earlier = reply.after

    def after() -> None:
        if earlier:
            earlier()
        then()
    reply.after = after
    return reply


def sooner(reply: Reply, first) -> Reply:
    rest = reply.after

    def after() -> None:
        first()
        if rest:
            rest()
    reply.after = after
    return reply


def timed(reply: Reply, root: Path, env: str, method: str, path: str, began: Stopwatch, profile=None) -> Reply:
    if not reply.timed:
        return reply
    name = f"{method} {path}" if reply.named is None else f"{method} {path} ({reply.named})"
    answered = []
    kind = "hook" if "/hook/" in path else "request"
    later(reply, lambda: began.announce(Record(root, env), kind, name, profile, answered[0] if answered else None))
    return sooner(reply, lambda: answered.append(began.lap()))


def known_environment(root: Path, env: str) -> bool:
    try:
        return environment_home(root, env).is_dir()
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
    profile = profiler(root)
    began = Stopwatch()
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
