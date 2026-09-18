"""A local web viewer over the journal: a thin JSON API in front of `views.py`, one
static page, and a Vue app (loaded from a CDN) doing the rendering in the browser.

STDLIB ONLY, ON THE PYTHON SIDE, AND THAT IS DELIBERATE. This project has no dependency
mechanism at all — no `pyproject.toml`, no `requirements.txt`; `install.py` ships a
consumer's copy by copying `.py` files. Vue does not change that: it is loaded by the
BROWSER, from a CDN `<script>` tag, with no npm install and no build step on this side —
the Python process never imports it and never needs to. The MVP server itself is still a
dozen GET routes with no forms, no sessions and no auth: exactly what `http.server` is
for, whatever renders the JSON it returns.

ONE RESPONSE, RENDERED TWICE. `views.py` already reads the journal once, the same way for
everyone; this module's only job is to hand that response back as JSON instead of
choosing how it looks. The choosing happens in the browser now, not here — see
`static/app.js`. (Whether the CLI's own text rendering should be rewritten to consume the
same response objects is a separate, larger question — see doc 4, to-do 11 — and this
module does not attempt it.)

LOCALHOST ONLY. `http.server` is not hardened for anything public, so it binds 127.0.0.1.
The writes — a message into the inbox, an answer to a question — are POST with a JSON body
and refused from another origin: a page elsewhere cannot send `application/json` here
without a preflight this server never answers.

THE ROUTE TABLE IS FRAMEWORK-AGNOSTIC ON PURPOSE: a route is a compiled pattern and a
function `(root, project, match) -> (status, content_type, bytes)`, nothing about
`BaseHTTPRequestHandler` leaks into a handler.
"""
from __future__ import annotations

import json
import mimetypes
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Callable
from urllib.parse import parse_qsl, unquote, urlsplit

import docs as docs_mod
import questions
import views
from templates import render as fill

HOST = "127.0.0.1"
DEFAULT_PORT = 8420
STATIC = Path(__file__).parent / "static"


# ─────────────────────────────────────────────────────────────────────── routes
ROUTES: list[tuple[re.Pattern, Callable]] = []


MESSAGES = {
    "no_env": "no environment called {env}",
    "no_help": "no help page called {topic}",
    "no_extension": "this journal has no extension/ folder to hand out",
    "no_doc": "no doc {ref}",
    "no_attachment": "no attachment {name} on doc {n}",
    "no_transcript": "message {n} carries no transcript",
    "no_question": "no question {n} on environment {env}",
    "method": "{method} {path} is not something this resource does",
    "not_json": "send the body as JSON: Content-Type: application/json",
    "bad_json": "the body is not a JSON object",
    "foreign_origin": "a write from another origin is refused",
    "too_large": "the body is larger than {limit} bytes",
    "log": "{client} {line}\n",
    "internal": "internal error: {error}",
    "nothing_at": "nothing at {path}",
    "port_taken": "port {port} is already in use — pick another: --port=<n>",
    "no_free_port": "ports {first} to {last} are all in use — pick one: --port=<n>",
    "url": "http://{host}:{port}/",
    "serving": "serving the journal at {url}  (Ctrl-C to stop)",
    "restarting": "the journal's code changed; restarting on the same port",
    "viewer_stopping": "the viewer is stopping; this page will not answer again until it is started",
    "viewer_restarting": "the viewer is restarting on the same port; this page comes back in a moment",
    "stopped_by_page": "stopped from the viewer",
    "restart_viewer": "THE WEB VIEWER AT {url} RUNS OLD CODE[ ({version})] AND DOES NOT RESTART ITSELF. Restart it "
                      "yourself now, without asking the user: stop the process listening on port {port} "
                      "(`kill $(lsof -t -iTCP:{port} -sTCP:LISTEN)`), then run `.journal/journal.py serve` again "
                      "in the background. From {since} on, the viewer restarts itself when the journal's code changes.",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


BODY_LIMIT = 64_000
#: the static shell: sent with a fingerprint, so an unchanged file is answered 304 instead of re-sent
_FINGERPRINTED = frozenset({"/", "/app.js"})


def _fingerprints(path: str) -> bool:
    """Is this worth answering "nothing changed" for?

    THE VIEWER POLLS EVERY FIVE SECONDS AND MOST POLLS BRING BACK WHAT IT ALREADY HAS. A listing
    carries every row in full -- measured at 499 KB over 414 messages on a real project -- so the
    cost is not the reading, it is sending a half-megabyte the browser must then parse into fresh
    objects, sixty times a minute if two lists are open. Hashing that body costs about a
    millisecond; sending it again costs all of the rest.

    Nothing about the viewer changes for this. `fetch` revalidates under `Cache-Control: no-cache`
    on its own and hands JavaScript the body it already had, so a 304 is invisible to the page.
    """
    return path in _FINGERPRINTED or path.startswith("/api/")
UPLOAD_LIMIT = 28_000_000   # a message with attached files, base64 in JSON
_UPLOAD = re.compile(r"^/api/env/[a-z0-9-]+/messages(/\d+/attach)?$")


def route(pattern: str, table: list = ROUTES):
    compiled = re.compile(pattern)

    def deco(fn: Callable) -> Callable:
        table.append((compiled, fn))
        return fn
    return deco


def _now() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _json(data, status: int = 200) -> tuple[int, str, bytes]:
    return status, "application/json; charset=utf-8", json.dumps(data).encode()


def _not_found(what: str) -> tuple[int, str, bytes]:
    return _json({"error": what}, 404)


def _known_env(root: Path, env: str) -> bool:
    # the same names views.environments lists, without counting everything in every environment on each request
    import tracks
    return env in tracks._all(root)


# ─────────────────────────────────────────────────────────────── the static shell
@route(r"^/$")
def _index(root: Path, project: Path, m: re.Match):
    f = STATIC / "index.html"
    return 200, "text/html; charset=utf-8", f.read_bytes()


@route(r"^/app\.js$")
def _app_js(root: Path, project: Path, m: re.Match):
    f = STATIC / "app.js"
    return 200, "text/javascript; charset=utf-8", f.read_bytes()


#: WHERE THE EXTENSION LIVES once the package is installed: a consumer gets `.journal/extension/`,
#: and this checkout has it beside the source. The zip is built on the way out rather than kept, so
#: it is never stale and nothing has to be rebuilt when a file in it changes.
def _extension_dir(root: Path) -> Path | None:
    for here in (root / "extension", Path(__file__).resolve().parent / "extension"):
        if (here / "manifest.json").is_file():
            return here
    return None


@route(r"^/extension\.zip$")
def _extension_zip(root: Path, project: Path, m: re.Match):
    import io
    import zipfile
    here = _extension_dir(root)
    if here is None:
        return _not_found(say("no_extension"))
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(here.rglob("*")):
            if f.is_file() and "__pycache__" not in f.parts:
                # AT THE ROOT OF THE ZIP: the Web Store wants manifest.json there, not in a folder,
                # and a zip of many root entries unpacks into a folder of its own name anyway
                zf.write(f, str(f.relative_to(here)))
    return 200, "application/zip", buf.getvalue()


@route(r"^/help/(?P<topic>[a-z]+)\.md$")
def _help(root: Path, project: Path, m: re.Match):
    f = STATIC / "help" / f"{m.group('topic')}.md"
    if not f.is_file():
        return _not_found(say("no_help", topic=m.group("topic")))
    return 200, "text/markdown; charset=utf-8", f.read_bytes()


@route(r"^/favicon\.ico$")
def _favicon(root: Path, project: Path, m: re.Match):
    return 204, "image/x-icon", b""


# ───────────────────────────────────────────────────────────────────── the API
@route(r"^/api/identity$")
def _api_identity(root: Path, project: Path, m: re.Match):
    return _json({"root": str(root.resolve()), "project": root.resolve().parent.name,
                  "version": __import__("update").current(root)})


@route(r"^/api/skills/([A-Za-z0-9_.:-]+)$")
def _api_skill(root: Path, project: Path, m: re.Match):
    """One skill's text, read-only: skills are edited in the project's files, not through the journal."""
    skills = __import__("skills")
    got = skills.find(root.resolve().parent, m.group(1))
    if not got:
        return _json({"error": f"there is no skill {m.group(1)} on disk here"}, 404)
    return _json({**got, "always": got["name"] in skills.always(root)})


@route(r"^/api/about$")
def _api_about(root: Path, project: Path, m: re.Match):
    """The running version and its changelog, for the About page."""
    f = root / "CHANGELOG.md"
    return _json({"version": __import__("update").current(root), "changelog": f.read_text() if f.is_file() else "",
                  # the Chrome extension ships with the package; the Settings page offers it when it is there
                  "extension": _extension_dir(root) is not None,
                  # once the extension is on the Chrome Web Store, its page is the one-click way in: the
                  # link lives beside the code, filled in when the listing exists, empty until then
                  "extension_store": _extension_store(root)})


def _extension_store(root: Path) -> str:
    here = _extension_dir(root)
    f = here / "store.json" if here else None
    try:
        return str(json.loads(f.read_text()).get("url") or "") if f and f.is_file() else ""
    except (OSError, ValueError):
        return ""


@route(r"^/api/viewers$")
def _api_viewers(root: Path, project: Path, m: re.Match):
    return _json(viewers(root))


@route(r"^/api/overview$")
def _api_overview(root: Path, project: Path, m: re.Match):
    return _json(views.overview(root))


@route(r"^/api/env/(?P<env>[a-z0-9-]+)$")
def _api_env(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    envs = {e["name"]: e for e in views.environments(root)}
    if env not in envs:
        return _not_found(say("no_env", env=repr(env)))
    return _json(envs[env])


# ─────────────────────────────────────────────────────────── resources, through their controllers
RESOURCE = re.compile(r"^/api/(?:env/(?P<env>[a-z0-9-]+)/)?(?P<resource>[a-z]+)(?:/(?P<id>\d+(?:\.\d+)?))?(?:/(?P<action>[a-z]+))?$")
_VERBS = {("GET", False): "index", ("GET", True): "show", ("POST", False): "store",
          ("PATCH", True): "update", ("DELETE", True): "destroy"}
_STATUS = {"ok": 200, "created": 201, "refused": 400, "missing": 404}


class Request:
    """An HTTP request for a resource: it produces the same payload a CLI command does."""
    __slots__ = ("env", "id", "body")

    def __init__(self, env: str, id: str | None, body: dict):
        self.env, self.id, self.body = env, id, body

    def payload(self, kind, extra: dict | None = None):
        return kind.build(self.env, self.id, {**self.body, **(extra or {})}, "web")


def _served(path: str):
    """(controller, match) for a path that names a resource in its scope, or None."""
    import controllers
    m = RESOURCE.match(path)
    controller = controllers.CONTROLLERS.get(m.group("resource")) if m else None
    if controller is None or (controller.scoped is not None and controller.scoped != bool(m.group("env"))):
        return None
    return controller, m


def _answered(root: Path, method: str, path: str, body: dict | None):
    """A resource's answer, and a 500 with the error when its controller raises, as the routes already do."""
    try:
        return _resource(root, method, path, body)
    except Exception as e:  # a bad controller must answer 500, never drop the connection
        return _json({"error": say("internal", error=e)}, 500)


def _resource(root: Path, method: str, path: str, body: dict) -> tuple[int, str, bytes] | None:
    served = _served(path)
    if served is None:
        return None
    controller, m = served
    env, ident, named = m.group("env") or "", m.group("id"), m.group("action")
    if env and not _known_env(root, env):
        return _not_found(say("no_env", env=repr(env)))
    if named and method != "POST":
        return _json({"error": say("method", method=method, path=path)}, 405)
    action = named or _VERBS.get((method, bool(ident)))
    # a method the resource does not take is 405; an action it does not have is a path that is not there
    if action is None or (not named and action not in controller.actions):
        return _json({"error": say("method", method=method, path=path)}, 405)
    from controller import dispatch
    result = dispatch(root, controller, action, Request(env, ident, body))
    if method == "GET" and result.ok:
        return _json(result.data)
    if not result.ok:
        return _json({"error": result.message}, _STATUS[result.status])
    try:
        import commandlog
        import state
        from app import now
        commandlog.record_web(root, env or state.current_track(root), controller.resource, action, ident, body, now())
    except Exception as e:  # the activity line must never fail the write
        print(f"journal activity: {e}", file=sys.stderr)
    return _json({"ok": True, "message": result.message, "data": result.data}, _STATUS[result.status])


# ────────────────────────────────────────────────────────── binary: doc attachments
@route(r"^/message-files/(?P<env>[a-z0-9-]+)/(?P<n>\d+)/(?P<name>[^/]+)$")
def _message_file(root: Path, project: Path, m: re.Match):
    """A file held on a message, by NAME matched against the message's own record."""
    import inbox
    env, n, name = m.group("env"), int(m.group("n")), unquote(m.group("name"))
    items = inbox._all(root, env) if _known_env(root, env) else []
    message = items[n - 1] if 1 <= n <= len(items) else None
    # A REPLY'S FILE IS THE MESSAGE'S FILE. They live in the same folder, and a reply records only
    # the names it added — so a name is served when the message holds it OR any reply under it does.
    held = (any(f["name"] == name for f in (message or {}).get("files") or [])
            or any(name in (r.get("files") or []) for r in (message or {}).get("replies") or []))
    path = inbox.files_dir(root, env, n) / name if held else None
    if path is None or not path.is_file():
        return _not_found(say("no_attachment", name=repr(name), n=n))
    return 200, mimetypes.guess_type(name)[0] or "application/octet-stream", path.read_bytes()


@route(r"^/transcripts/(?P<env>[a-z0-9-]+)/(?P<n>\d+)$")
def _transcript(root: Path, project: Path, m: re.Match):
    """The transcript a message carried. Nothing lists these: it is reached from the message itself."""
    import inbox
    env, n = m.group("env"), int(m.group("n"))
    got = inbox.transcript(root, env, n) if _known_env(root, env) else None
    if got is None:
        return _not_found(say("no_transcript", n=n))
    _meta, body = got
    return 200, "text/markdown; charset=utf-8", body.encode("utf-8")


@route(r"^/docs/(?P<n>\d+)/files/(?P<name>[^/]+)$")
def _doc_file(root: Path, project: Path, m: re.Match):
    """An attachment, by NAME matched against the doc's own manifest — never a raw path.

    Whitelisting by name against `docs.attachments(doc)` is what makes this safe: the
    path that is actually opened always comes from the manifest, never from the URL, so
    there is no `..` or absolute-path escape to defend against in the first place. See
    `views.safe_path` for the general check a future by-path route would still need.
    """
    n, name = int(m.group("n")), unquote(m.group("name"))
    doc, _prt, err = docs_mod.get(root, str(n))
    if doc is None:
        return _not_found(err or say("no_doc", ref=n))
    match = next((a for a in docs_mod.attachments(doc) if a["name"] == name and not a["dir"]), None)
    if match is None:
        return _not_found(say("no_attachment", name=repr(name), n=n))
    ctype = mimetypes.guess_type(name)[0] or "application/octet-stream"
    return 200, ctype, match["path"].read_bytes()


@route(r"^/docs/(?P<n>\d+)/files/(?P<name>[^/]+)/(?P<rest>.+)$")
def _doc_folder_file(root: Path, project: Path, m: re.Match):
    """A file inside a folder attachment: the folder comes from the manifest, and the file must resolve inside it."""
    n, name, rest = int(m.group("n")), unquote(m.group("name")), unquote(m.group("rest"))
    doc, _prt, err = docs_mod.get(root, str(n))
    if doc is None:
        return _not_found(err or say("no_doc", ref=n))
    folder = next((a for a in docs_mod.attachments(doc) if a["name"] == name and a["dir"]), None)
    if folder is None:
        return _not_found(say("no_attachment", name=repr(name), n=n))
    base = folder["path"].resolve()
    target = (base / rest).resolve()
    if not target.is_file() or not target.is_relative_to(base):
        return _not_found(say("no_attachment", name=repr(f"{name}/{rest}"), n=n))
    ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
    return 200, ctype, target.read_bytes()


# ─────────────────────────────────────────────────────────────────────── the server
class _Server(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, addr: tuple[str, int], root: Path, project: Path):
        self.root = root
        self.project = project
        super().__init__(addr, _Handler)

    def handle_error(self, request, client_address):
        # a page closed mid-request, or another viewer's probe gave up waiting: nothing went wrong here
        if isinstance(sys.exc_info()[1], (BrokenPipeError, ConnectionResetError)):
            return
        super().handle_error(request, client_address)


class _Handler(BaseHTTPRequestHandler):
    server_version = "journal-viewer/1"
    server: _Server

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write(say("log", client=self.address_string(), line=fmt % args))

    def do_GET(self) -> None:
        self._dispatch(head=False)

    def do_HEAD(self) -> None:
        self._dispatch(head=True)

    def _method_not_allowed(self) -> None:
        status, ctype, body = _json({"error": "GET and HEAD only"}, 405)
        self.send_response(status)
        self.send_header("Allow", "GET, HEAD")
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        self._write("POST")

    def _write(self, method: str) -> None:
        path = urlsplit(self.path).path
        if method == "POST" and path in ("/api/viewer/stop", "/api/viewer/restart"):
            self._viewer(path.rsplit("/", 1)[1])
            return
        if _served(path) is None:
            self._method_not_allowed()
            return
        body, refusal = self._write_body(UPLOAD_LIMIT if method == "POST" and _UPLOAD.match(path) else BODY_LIMIT)
        if refusal:
            self._send(*refusal, False)
            return
        answered = _answered(self.server.root, method, path, body)
        if answered is None:
            self._method_not_allowed()
            return
        self._send(*answered, False)

    def _viewer(self, verb: str) -> None:
        """Stop or restart the server from the page it is serving.

        A VIEWER THAT OUTLIVES ITS LAUNCHER IS ONE NOBODY KNOWS HOW TO STOP -- `serve --detach`
        made that true, and finding a pid through lsof is not an answer for the person reading the
        page. It goes through the write path, so the same-origin guard that protects every other
        write protects this: another page on this machine cannot end your viewer.

        Both verbs are the stop `_watch_code` already uses -- set the flag, shut down -- and `run`
        decides what happens next: exec a fresh server, or fall off the end and exit.
        """
        _body, refusal = self._write_body(BODY_LIMIT)
        if refusal:
            self._send(*refusal, False)
            return
        restarting = verb == "restart"
        self._send(*_json({"ok": True, "message": say("viewer_restarting" if restarting else "viewer_stopping")}), False)
        if restarting:
            self.server.changed.set()
        self.server.stopping.set()
        import threading
        threading.Thread(target=self.server.shutdown, daemon=True).start()

    def _write_body(self, limit: int = BODY_LIMIT) -> tuple[dict | None, tuple | None]:
        origin = self.headers.get("Origin")
        # THE EXTENSION IS NOT A FOREIGN PAGE. Its worker writes from chrome-extension://…, which no
        # website can forge: an extension origin is one the user installed, and the guard is against
        # pages elsewhere on the web, not against the journal's own hands.
        if origin and urlsplit(origin).netloc != self.headers.get("Host", "") and urlsplit(origin).scheme not in EXTENSION_SCHEMES:
            return None, _json({"error": say("foreign_origin")}, 403)
        if (self.headers.get("Content-Type") or "").split(";")[0].strip() != "application/json":
            return None, _json({"error": say("not_json")}, 415)
        try:
            size = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            size = 0
        if size > limit:
            return None, _json({"error": say("too_large", limit=limit)}, 413)
        try:
            data = json.loads(self.rfile.read(size) or b"{}")
        except ValueError:
            data = None
        if not isinstance(data, dict):
            return None, _json({"error": say("bad_json")}, 400)
        return data, None

    def do_PUT(self) -> None:
        self._method_not_allowed()

    def do_DELETE(self) -> None:
        self._write("DELETE")

    def do_PATCH(self) -> None:
        self._write("PATCH")

    def _dispatch(self, head: bool) -> None:
        url = urlsplit(self.path)
        path = url.path
        answered = _answered(self.server.root, "GET", path, dict(parse_qsl(url.query))) if _served(path) else None
        if answered is not None:
            self._tagged(path, *answered, head)
            return
        for pattern, fn in ROUTES:
            m = pattern.match(path)
            if not m:
                continue
            try:
                status, ctype, body = fn(self.server.root, self.server.project, m)
            except Exception as e:   # a bad route must answer 500, never crash the server
                status, ctype, body = _json({"error": say("internal", error=e)}, 500)
            self._tagged(path, status, ctype, body, head)
            return
        self._send(*_not_found(say("nothing_at", path=path)), head)

    def _tagged(self, path: str, status: int, ctype: str, body: bytes, head: bool) -> None:
        """Send it, or answer 304 when the client already holds exactly this.

        ONE FUNNEL: a resource answers through `_answered` and everything else through ROUTES, and
        both used to send for themselves -- which is why the API, the thing polled every five
        seconds, was the one path that never got a fingerprint.
        """
        if status == 200 and _fingerprints(path):
            import hashlib
            etag = '"' + hashlib.sha1(body).hexdigest()[:20] + '"'
            if self.headers.get("If-None-Match") == etag:
                self._send(304, ctype, b"", True, etag)
                return
            self._send(status, ctype, body, head, etag)
            return
        self._send(status, ctype, body, head)

    def _send(self, status: int, ctype: str, body: bytes, head: bool, etag: str = "") -> None:
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        # an upgraded journal must never be shown through the browser's copy of the last one
        self.send_header("Cache-Control", "no-cache")
        if etag:
            self.send_header("ETag", etag)
        self.end_headers()
        if not head:
            self.wfile.write(body)


VIEWER_PORT = "viewer_port"


def _identity(port: int, timeout: float = 0.5) -> dict | None:
    """What the viewer on `port` says about itself; None when nothing answers or it does not say."""
    import http.client
    try:
        conn = http.client.HTTPConnection(HOST, int(port), timeout=timeout)
        conn.request("GET", "/api/identity")
        res = conn.getresponse()
        body = res.read()
        conn.close()
        got = json.loads(body) if res.status == 200 else None
    except (OSError, ValueError, http.client.HTTPException):
        return None
    return got if isinstance(got, dict) and got.get("root") else None


def running(root: Path) -> str:
    """This project's viewer URL when it answers on its last port (or the default), else ''."""
    import socket
    import state
    port = state.get(root, VIEWER_PORT, DEFAULT_PORT) or DEFAULT_PORT
    try:
        with socket.create_connection((HOST, int(port)), timeout=0.2):
            pass
    except OSError:
        return ""
    # another project's viewer can hold the port; a viewer too old to say whose it is keeps the old answer
    got = _identity(port)
    if got and got["root"] != str(root.resolve()):
        return ""
    return say("url", host=HOST, port=port)


#: the first version whose viewer restarts itself when its code changes
SELF_RESTART_VERSION = "1.131.63"


def needs_restart(identity: dict | None) -> bool:
    """Whether a running viewer is too old to pick up new code by itself."""
    import update
    version = (identity or {}).get("version") or ""
    return not version or update.newer(SELF_RESTART_VERSION, version)


def stale_viewer(root: Path) -> dict | None:
    """This project's running viewer when it runs code from before the self-restart: {url, port, version}."""
    import state
    url = running(root)
    if not url:
        return None
    port = int(state.get(root, VIEWER_PORT, DEFAULT_PORT) or DEFAULT_PORT)
    identity = _identity(port)
    return {"url": url, "port": port, "version": (identity or {}).get("version") or ""} if needs_restart(identity) else None


def restart_notice(root: Path) -> str:
    """What an agent is told after an upgrade when its viewer will not pick up the new code by itself."""
    old = stale_viewer(root)
    return say("restart_viewer", since=SELF_RESTART_VERSION, **old) if old else ""


def viewers(root: Path, ports=None) -> list[dict]:
    """Every journal viewer answering on this machine's viewer ports, with this project's marked current."""
    from concurrent.futures import ThreadPoolExecutor
    import state
    if ports is None:
        ports = set(range(DEFAULT_PORT, DEFAULT_PORT + PORT_TRIES))
        ports.add(int(state.get(root, VIEWER_PORT, DEFAULT_PORT) or DEFAULT_PORT))
    ports = sorted(ports)
    with ThreadPoolExecutor(max_workers=len(ports) or 1) as pool:
        found = list(zip(ports, pool.map(lambda port: _identity(port, 0.4), ports)))
    mine = str(root.resolve())
    return [{"port": port, "url": say("url", host=HOST, port=port), "version": got.get("version") or "",
             "project": got.get("project") or Path(got["root"]).parent.name, "current": got["root"] == mine}
            for port, got in found if got]


#: how many ports from the default a viewer tries before it gives up
PORT_TRIES = 20


def _taken(e: OSError) -> bool:
    return getattr(e, "errno", None) in (48, 98) or "already in use" in str(e).lower()


def bind(root: Path, project: Path, port: int | None = None, first: int = DEFAULT_PORT) -> "_Server":
    """A server on `port`, or on the first free port from `first` when no port is asked for."""
    if port:
        try:
            return _Server((HOST, port), root, project)
        except OSError as e:
            if _taken(e):
                print(say("port_taken", port=port), file=sys.stderr)
                raise SystemExit(1)
            raise
    for candidate in range(first, first + PORT_TRIES):
        try:
            return _Server((HOST, candidate), root, project)
        except OSError as e:
            if not _taken(e):
                raise
    print(say("no_free_port", first=first, last=first + PORT_TRIES - 1), file=sys.stderr)
    raise SystemExit(1)


#: a browser extension's own origin: a write from one is the user's, not a website's
EXTENSION_SCHEMES = frozenset(("chrome-extension", "moz-extension", "safari-web-extension"))

#: how often the viewer looks at its own code, and how long a change must settle before it restarts
WATCH_SECONDS = 1.0
SETTLE_SECONDS = 1.5


def _snapshot(root: Path) -> dict[str, int]:
    """Every Python file of the package under `root`, with when it last changed."""
    out = {}
    for f in root.rglob("*.py"):
        if "__pycache__" in f.parts or "runtime" in f.relative_to(root).parts[:1]:
            continue
        try:
            out[str(f)] = f.stat().st_mtime_ns
        except OSError:
            continue
    return out


def _watch_code(root: Path, server: "_Server", changed) -> None:
    """Stop the server once the package's Python has changed and then stayed still, so an upgrade lands whole."""
    import time
    seen = _snapshot(root)
    last_change = None
    while not changed.is_set():
        time.sleep(WATCH_SECONDS)
        now = _snapshot(root)
        if now != seen:
            seen, last_change = now, time.monotonic()
        elif last_change is not None and time.monotonic() - last_change >= SETTLE_SECONDS:
            changed.set()
            server.shutdown()


def run(root: Path, project: Path, port: int | None = None, open_browser: bool = False) -> None:
    """Start the server in the foreground; Ctrl-C stops it. It restarts itself when the journal's code changes."""
    import os
    import threading
    server = bind(root, project, port)
    url = say("url", host=HOST, port=server.server_port)
    import state
    state.put(root, VIEWER_PORT, server.server_port)
    # flushed: an agent that starts the viewer in the background reads the port it took from this line
    print(say("serving", url=url), flush=True)
    if open_browser:
        import webbrowser
        webbrowser.open(url)
    changed = threading.Event()
    server.changed = changed
    server.stopping = threading.Event()
    threading.Thread(target=_watch_code, args=(root, server, changed), daemon=True).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    if server.stopping.is_set() and not changed.is_set():
        print(say("stopped_by_page"), flush=True)
    if changed.is_set():
        print(say("restarting"), flush=True)
        os.execv(sys.executable, [sys.executable, str(root / "journal.py"), "serve", f"--port={server.server_port}"])


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Browse a project's journal in a browser.")
    ap.add_argument("root", nargs="?", default=".journal", help="the .journal directory")
    ap.add_argument("--port", type=int, default=DEFAULT_PORT)
    ap.add_argument("--open", action="store_true", help="open the browser on start")
    args = ap.parse_args()
    root_path = Path(args.root)
    run(root_path, root_path.parent, port=args.port, open_browser=args.open)
