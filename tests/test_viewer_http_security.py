import json
import threading
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer

from serve import Handler


def test_viewer_requires_its_host_and_write_token(tmp_path):
    Handler.root = tmp_path / ".journal"
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    server.token = "test-server-token"
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_port}"

    def status(path, method="GET", headers=None):
        request = urllib.request.Request(f"{base}{path}", data=b"{}" if method == "POST" else None, headers=headers or {}, method=method)
        try:
            with urllib.request.urlopen(request, timeout=5) as response:
                return response.status, response.read()
        except urllib.error.HTTPError as error:
            return error.code, error.read()

    try:
        code, body = status("/api/session-token")
        assert (code, json.loads(body)["token"]) == (200, server.token)
        assert status("/api/session-token", headers={"Host": f"evil.example:{server.server_port}"})[0] == 403
        assert status("/api/session-token", headers={"Origin": "http://localhost:9999"})[0] == 403
        assert status("/api/no-such-route", "POST")[0] == 403
        assert status("/api/no-such-route", "POST", {"X-Journal-Token": "wrong"})[0] == 403
        assert status("/api/no-such-route", "POST", {"X-Journal-Token": server.token})[0] == 404
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
