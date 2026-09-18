import json
import mimetypes
import sys
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine.manifest import manifest  # noqa: E402
from v2.engine.record import Record  # noqa: E402
from v2.resources.base import USER, Refused  # noqa: E402

WEB = Path(__file__).resolve().parent / "web" / "dist"


def shaped(r) -> dict:
    return {**asdict(r), "type": r.type, "ref": r.ref}


class Handler(BaseHTTPRequestHandler):
    root: Path = Path(".journal")

    def log_message(self, *_):
        pass

    def send(self, code: int, body, kind="application/json"):
        data = body if isinstance(body, bytes) else json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def parts(self):
        return [p for p in self.path.split("?")[0].split("/") if p]

    def do_GET(self):
        parts = self.parts()
        if parts == ["api", "manifest"]:
            return self.send(200, manifest())
        if len(parts) >= 3 and parts[0] == "api":
            env, type_ = parts[1], parts[2]
            if type_ not in CONTROLLERS:
                return self.send(404, {"error": f"no type {type_}"})
            c = CONTROLLERS[type_](Record(self.root, env), actor=USER)
            try:
                if len(parts) == 3:
                    return self.send(200, [shaped(r) for r in c.all()])
                if len(parts) == 4:
                    return self.send(200, shaped(c.show(int(parts[3]))))
            except Refused as e:
                return self.send(404, {"error": str(e)})
        return self.static(parts)

    def do_POST(self):
        parts = self.parts()
        length = int(self.headers.get("Content-Length") or 0)
        body = json.loads(self.rfile.read(length) or b"{}") if length else {}
        if len(parts) < 3 or parts[0] != "api" or parts[2] not in CONTROLLERS:
            return self.send(404, {"error": "no such route"})
        env, type_ = parts[1], parts[2]
        c = CONTROLLERS[type_](Record(self.root, env), actor=body.pop("actor", USER))
        try:
            if len(parts) == 3:
                return self.send(201, shaped(c.create(**body)))
            method, n = (parts[4], int(parts[3])) if len(parts) == 5 else (parts[3], None)
            if n is None:
                return self.send(201, shaped(c.method(method)(**body)))
            got = c.method(method)(n, **body)
            return self.send(200, shaped(got) if got is not None else {"ok": True})
        except Refused as e:
            return self.send(400, {"error": str(e)})
        except (TypeError, AttributeError) as e:
            return self.send(400, {"error": f"not an action here: {e}"})

    def static(self, parts):
        f = WEB / ("/".join(parts) or "index.html")
        if not f.is_file():
            f = WEB / "index.html"
        if not f.is_file():
            return self.send(404, {"error": "no web build; run npm run build in v2/web"})
        return self.send(200, f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream")


def serve(root: Path, port: int = 8430) -> ThreadingHTTPServer:
    Handler.root = root
    return ThreadingHTTPServer(("127.0.0.1", port), Handler)


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".journal").resolve()
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8430
    print(f"http://127.0.0.1:{port}/")
    serve(root, port).serve_forever()
