import http.server
import json
import threading
from dataclasses import dataclass, field
from typing import ClassVar

from engine.fields import Loaded


@dataclass(frozen=True)
class Within(Loaded):
    aliases: ClassVar[dict] = {"ids": ("in",)}
    ids: tuple[str, ...] = ()


@dataclass(frozen=True)
class Later(Loaded):
    gt: str = ""


@dataclass(frozen=True)
class Filter(Loaded):
    aliases: ClassVar[dict] = {"updated": ("updatedAt",)}
    id: Within = field(default_factory=Within)
    updated: Later = field(default_factory=Later)


@dataclass(frozen=True)
class Variables(Loaded):
    aliases: ClassVar[dict] = {"state_id": ("stateId",), "issue_id": ("issueId",)}
    after: str = ""
    filter: Filter = field(default_factory=Filter)
    id: str = ""
    state_id: str = ""
    issue_id: str = ""
    body: str = ""


@dataclass(frozen=True)
class Asked(Loaded):
    query: str = ""
    variables: Variables = field(default_factory=Variables)


@dataclass
class Seen:
    path: str
    asked: Asked
    authorization: str
    body: str


@dataclass
class FakeLinear:
    """A local stand-in for Linear's GraphQL address: it answers the sync's queries from what it is given and records every request with its headers."""

    teams: list = field(default_factory=list)
    issues: list = field(default_factory=list)
    states: list = field(default_factory=list)
    page_size: int = 50
    remaining: int = -1
    reset: float = 0.0
    status: int = 200
    fail_page: int = 0
    echo_key: bool = False
    requests: list = field(default_factory=list)
    updates: list = field(default_factory=list)
    comments: list = field(default_factory=list)

    def start(self) -> str:
        fake = self

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_POST(self):
                body = self.rfile.read(int(self.headers["Content-Length"])).decode()
                asked = Asked.from_json(json.loads(body))
                fake.requests.append(Seen(self.path, asked, self.headers.get("Authorization", ""), body))
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

    def answer(self, asked: Asked, key: str) -> tuple[int, dict]:
        if self.status != 200:
            return self.status, {"errors": [{"message": f"refused {key}" if self.echo_key else "refused"}]}
        variables = asked.variables
        if "issueUpdate" in asked.query:
            self.updates.append(variables)
            return 200, {"data": {"issueUpdate": {"success": True}}}
        if "commentCreate" in asked.query:
            self.comments.append(variables)
            return 200, {"data": {"commentCreate": {"success": True}}}
        if "workflowStates" in asked.query:
            return 200, {"data": {"workflowStates": {"nodes": self.states}}}
        if "teams" in asked.query:
            return 200, {"data": {"teams": {"nodes": self.teams}}}
        wanted = variables.filter.id.ids
        if wanted:
            return 200, {"data": {"issues": {"nodes": [issue for issue in self.issues if issue["id"] in wanted]}}}
        matching = [issue for issue in self.issues if issue["updatedAt"] > variables.filter.updated.gt and issue.get("mine", True)]
        start = int(variables.after) if variables.after else 0
        if self.fail_page and start >= self.fail_page:
            return 500, {"errors": [{"message": "a page failed"}]}
        page = matching[start:start + self.page_size]
        end = start + len(page)
        return 200, {"data": {"issues": {"nodes": page, "pageInfo": {"hasNextPage": end < len(matching), "endCursor": str(end)}}}}
