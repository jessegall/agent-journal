import http.server
import json
import threading
from dataclasses import dataclass, field


@dataclass
class Seen:
    path: str
    query: str
    variables: dict
    authorization: str
    body: str


@dataclass
class FakeLinear:
    """A local stand-in for Linear's GraphQL address: it answers the sync's queries from what it is given and records every request with its headers."""

    teams: list = field(default_factory=list)
    issues: list = field(default_factory=list)
    page_size: int = 50
    remaining: int = -1
    reset: float = 0.0
    status: int = 200
    fail_page: int = 0
    echo_key: bool = False
    requests: list = field(default_factory=list)

    def start(self) -> str:
        fake = self

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_POST(self):
                body = self.rfile.read(int(self.headers.get("Content-Length") or 0)).decode()
                asked = json.loads(body)
                fake.requests.append(Seen(self.path, asked["query"], asked.get("variables") or {}, self.headers.get("Authorization", ""), body))
                status, answer = fake.answer(asked, self.headers.get("Authorization", ""))
                raw = json.dumps(answer).encode()
                self.send_response(status)
                self.send_header("Content-Type", "application/json")
                if fake.remaining >= 0:
                    self.send_header("X-RateLimit-Requests-Remaining", str(fake.remaining))
                    self.send_header("X-RateLimit-Requests-Reset", str(fake.reset))
                self.send_header("Content-Length", str(len(raw)))
                self.end_headers()
                self.wfile.write(raw)

            def log_message(self, *_):
                pass

        self.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        return f"http://127.0.0.1:{self.server.server_port}"

    def stop(self) -> None:
        self.server.shutdown()

    def answer(self, asked: dict, key: str) -> tuple[int, dict]:
        if self.status != 200:
            return self.status, {"errors": [{"message": f"refused {key}" if self.echo_key else "refused"}]}
        if "teams" in asked["query"]:
            return 200, {"data": {"teams": {"nodes": self.teams}}}
        found = asked.get("variables", {}).get("filter") or {}
        if "id" in found:
            wanted = found["id"]["in"]
            return 200, {"data": {"issues": {"nodes": [issue for issue in self.issues if issue["id"] in wanted]}}}
        since = (found.get("updatedAt") or {}).get("gt", "")
        matching = [issue for issue in self.issues if issue["updatedAt"] > since and issue.get("mine", True)]
        start = int(asked["variables"].get("after") or 0)
        if self.fail_page and start >= self.fail_page:
            return 500, {"errors": [{"message": "a page failed"}]}
        page = matching[start:start + self.page_size]
        end = start + len(page)
        return 200, {"data": {"issues": {"nodes": page, "pageInfo": {"hasNextPage": end < len(matching), "endCursor": str(end)}}}}
