import mimetypes
import time
from pathlib import Path
from engine import bus
from engine.record import Record
from engine.timing import EVENT, Sampler, Stopwatch, profiler
from controllers.faults import threw
from engine.disk import DiskFull
from resources.base import Missing, Refused
from engine.package import data
from features.phone.allow_list import PhoneVisit, Reach, reached
from features.format import rendered
from features.routing import Reply, Request, resolve
from engine.paths import contained, known_environment


WEB = data("web", "dist")
HOOK_PATH = "/api/hook/"

def reached_by_phone(root: Path, method: str, path: str, query: dict, body: dict, visit: PhoneVisit) -> Reach:
    found = resolve(method, path)
    return Reach.CLOSED if found is None else reached(root, *found, query, body, visit)


def later(reply: Reply, then) -> Reply:
    earlier = reply.after

    def after() -> None:
        if earlier:
            earlier()
        then()
    reply.after = after
    return reply


def hook_path(path: str) -> bool:
    return path.startswith(HOOK_PATH)


def timed(reply: Reply, root: Path, env: str, method: str, path: str, began: Stopwatch, profile=None, stacks: str = "") -> Reply:
    if not reply.timed:
        return reply
    name = f"{method} {path}" if reply.named is None else f"{method} {path} ({reply.named})"
    answered = began.lap()
    kind = "hook" if hook_path(path) else "request"
    earlier = reply.after

    def after() -> None:
        started = time.perf_counter()
        if earlier:
            earlier()
        began.announce(Record(root, env), kind, name, profile, answered, stacks, (time.perf_counter() - started) * 1000)
    reply.after = after
    return reply


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
    sampler = Sampler()
    if bus.heard(EVENT):
        sampler.start()
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
                stacks = sampler.stop()
        return guarded(timed(later(reply, lambda: bus.release(queued)), root, params.get("env") or "main", method, path, began, profile, stacks),
                       root, req.env, f"after {method} {path}")
    except Missing as e:
        return Reply(404, {"error": str(e)})
    except Refused as e:
        return Reply(400, {"error": str(e)})
    except DiskFull as e:
        return Reply(507, {"error": str(e)})
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


def represented(got, record):
    return {"ok": True} if got is None else rendered(got, record)


def static(path: str) -> Reply:
    f = contained(WEB, path.lstrip("/") or "index.html", nested=True)
    if not f.is_file():
        f = WEB / "index.html"
    if not f.is_file():
        return Reply(404, {"error": "no web build; run npm run build in web"})
    return Reply(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")
