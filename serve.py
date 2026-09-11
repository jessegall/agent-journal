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

LOCALHOST ONLY, AND READ-ONLY. `http.server` is documented as not hardened for anything
public, and this process has no CSRF or origin checking — acceptable for a GET-only
server bound to 127.0.0.1, not for one that changes anything. Every write this package
makes is attributed (who, which transcript line, which environment) and gated by rules a
browser click has no way to satisfy, so writing from here is a later phase's decision,
not this one's.

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
from urllib.parse import unquote, urlsplit

import docs as docs_mod
import views

HOST = "127.0.0.1"
DEFAULT_PORT = 8420
STATIC = Path(__file__).parent / "static"


# ─────────────────────────────────────────────────────────────────────── routes
ROUTES: list[tuple[re.Pattern, Callable]] = []


def route(pattern: str):
    compiled = re.compile(pattern)

    def deco(fn: Callable) -> Callable:
        ROUTES.append((compiled, fn))
        return fn
    return deco


def _json(data, status: int = 200) -> tuple[int, str, bytes]:
    return status, "application/json; charset=utf-8", json.dumps(data).encode()


def _not_found(what: str) -> tuple[int, str, bytes]:
    return _json({"error": what}, 404)


def _known_env(root: Path, env: str) -> bool:
    return env in {e["name"] for e in views.environments(root)}


# ─────────────────────────────────────────────────────────────── the static shell
@route(r"^/$")
def _index(root: Path, project: Path, m: re.Match):
    f = STATIC / "index.html"
    return 200, "text/html; charset=utf-8", f.read_bytes()


@route(r"^/app\.js$")
def _app_js(root: Path, project: Path, m: re.Match):
    f = STATIC / "app.js"
    return 200, "text/javascript; charset=utf-8", f.read_bytes()


@route(r"^/favicon\.ico$")
def _favicon(root: Path, project: Path, m: re.Match):
    return 204, "image/x-icon", b""


# ───────────────────────────────────────────────────────────────────── the API
@route(r"^/api/overview$")
def _api_overview(root: Path, project: Path, m: re.Match):
    return _json(views.overview(root))


@route(r"^/api/env/(?P<env>[a-z0-9-]+)$")
def _api_env(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    envs = {e["name"]: e for e in views.environments(root)}
    if env not in envs:
        return _not_found(f"no environment called {env!r}")
    return _json(envs[env])


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/todos$")
def _api_todos(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    if not _known_env(root, env):
        return _not_found(f"no environment called {env!r}")
    return _json(views.todos(root, env))


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/todos/(?P<n>\d+)$")
def _api_todo_detail(root: Path, project: Path, m: re.Match):
    env, n = m.group("env"), int(m.group("n"))
    t = views.todo_detail(root, env, n)
    if t is None:
        return _not_found(f"no to-do {n} on environment {env!r}")
    return _json(t)


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/pins$")
def _api_pins(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    if not _known_env(root, env):
        return _not_found(f"no environment called {env!r}")
    return _json(views.pins_on(root, env))


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/pins/(?P<n>\d+)$")
def _api_pin_detail(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    if not _known_env(root, env):
        return _not_found(f"no environment called {env!r}")
    row = views.pin_detail(root, env, int(m.group("n")))
    if row is None:
        return _not_found(f"no pin {m.group('n')} on environment {env!r}")
    return _json(row)


@route(r"^/api/rules$")
def _api_rules(root: Path, project: Path, m: re.Match):
    return _json(views.rules(root))


@route(r"^/api/rules/(?P<n>\d+)$")
def _api_rule_detail(root: Path, project: Path, m: re.Match):
    row = views.rule_detail(root, int(m.group("n")))
    if row is None:
        return _not_found(f"no rule {m.group('n')}")
    return _json(row)


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/work$")
def _api_work(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    if not _known_env(root, env):
        return _not_found(f"no environment called {env!r}")
    return _json(views.work_on(root, env))


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/reminders$")
def _api_reminders(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    if not _known_env(root, env):
        return _not_found(f"no environment called {env!r}")
    return _json(views.reminders_on(root, env))


@route(r"^/api/docs$")
def _api_docs(root: Path, project: Path, m: re.Match):
    return _json(views.docs(root))


@route(r"^/api/env/(?P<env>[a-z0-9-]+)/docs$")
def _api_env_docs(root: Path, project: Path, m: re.Match):
    env = m.group("env")
    if not _known_env(root, env):
        return _not_found(f"no environment called {env!r}")
    return _json(views.docs_on(root, env))


@route(r"^/api/docs/(?P<ref>\d+(?:\.\d+)?)$")
def _api_doc_detail(root: Path, project: Path, m: re.Match):
    d = views.doc_detail(root, m.group("ref"))
    if d is None:
        return _not_found(f"no doc {m.group('ref')}")
    return _json(d)


@route(r"^/api/tools$")
def _api_tools(root: Path, project: Path, m: re.Match):
    return _json(views.tools_catalogue(root))


# ────────────────────────────────────────────────────────── binary: doc attachments
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
        return _not_found(err or f"no doc {n}")
    match = next((a for a in docs_mod.attachments(doc) if a["name"] == name and not a["dir"]), None)
    if match is None:
        return _not_found(f"no attachment {name!r} on doc {n}")
    ctype = mimetypes.guess_type(name)[0] or "application/octet-stream"
    return 200, ctype, match["path"].read_bytes()


# ─────────────────────────────────────────────────────────────────────── the server
class _Server(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, addr: tuple[str, int], root: Path, project: Path):
        self.root = root
        self.project = project
        super().__init__(addr, _Handler)


class _Handler(BaseHTTPRequestHandler):
    server_version = "journal-viewer/1"
    server: _Server

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write(f"{self.address_string()} {fmt % args}\n")

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
        self._method_not_allowed()

    def do_PUT(self) -> None:
        self._method_not_allowed()

    def do_DELETE(self) -> None:
        self._method_not_allowed()

    def do_PATCH(self) -> None:
        self._method_not_allowed()

    def _dispatch(self, head: bool) -> None:
        path = urlsplit(self.path).path
        for pattern, fn in ROUTES:
            m = pattern.match(path)
            if not m:
                continue
            try:
                status, ctype, body = fn(self.server.root, self.server.project, m)
            except Exception as e:   # a bad route must answer 500, never crash the server
                status, ctype, body = _json({"error": f"internal error: {e}"}, 500)
            self._send(status, ctype, body, head)
            return
        self._send(*_not_found(f"nothing at {path}"), head)

    def _send(self, status: int, ctype: str, body: bytes, head: bool) -> None:
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if not head:
            self.wfile.write(body)


def run(root: Path, project: Path, port: int = DEFAULT_PORT, open_browser: bool = False) -> None:
    """Start the server in the foreground; Ctrl-C stops it. No daemon mode in the MVP."""
    try:
        server = _Server((HOST, port), root, project)
    except OSError as e:
        if getattr(e, "errno", None) in (48, 98) or "already in use" in str(e).lower():
            print(f"port {port} is already in use — pick another: --port=<n>", file=sys.stderr)
            raise SystemExit(1)
        raise
    url = f"http://{HOST}:{server.server_port}/"
    print(f"serving the journal at {url}  (Ctrl-C to stop)")
    if open_browser:
        import webbrowser
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Browse a project's journal in a browser.")
    ap.add_argument("root", nargs="?", default=".journal", help="the .journal directory")
    ap.add_argument("--port", type=int, default=DEFAULT_PORT)
    ap.add_argument("--open", action="store_true", help="open the browser on start")
    args = ap.parse_args()
    root_path = Path(args.root)
    run(root_path, root_path.parent, port=args.port, open_browser=args.open)
