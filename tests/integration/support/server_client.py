import http.client
import json
import os
import shlex
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlencode

from engine.performance.timing import TIMING_HEADER
from engine.testing.examples.hook_samples import HookSamples
from server.context.server_context import ServerContext
from tests.integration.support.server_harness import TIMEOUT_SECONDS, ServerAnswer, raw_answer, request_answer, viewer_answer


class ServerClient:
    """A client of a running server: what it sends to the socket and the viewer port, and the checks of what the
    server answers."""

    def __init__(self, socket_path: Path, context: ServerContext) -> None:
        self.socket_path = socket_path
        self.context = context

    def request(self, method: str, route: str, body: object = None, headers: dict[str, str] | None = None) -> ServerAnswer:
        return request_answer(self.socket_path, method, route, body, headers)

    def viewer_line_value(self, cookie: str, body: dict[str, object]) -> dict[str, object]:
        status, _, answer = viewer_answer(self.viewer_port(), "/api/line", cookie, "", body)
        answered = json.loads(answer)
        assert status == 200 and answered["code"] == 0, (status, answer)
        return answered["value"]

    def expect_hook_line_soon(self, text: str, firing: str) -> None:
        body = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use", session="s-1", environment="main", firing=firing, role="main").body
        answer = request_answer(self.socket_path, "POST", "/hook", dict(body))
        assert text in answer.text, answer.text

    def hook_decision(self, body: dict[str, object], headers: dict[str, str]) -> tuple[object, object]:
        reply = request_answer(self.socket_path, "POST", "/hook?program=claude", body, headers).json()
        assert isinstance(reply, dict), reply
        return reply["refusal"], reply["lines"]

    def viewer_key(self, login_name: str) -> str:
        return self.login_key({"USER": login_name})

    def login_key(self, variables: dict[str, str]) -> str:
        answer = request_answer(self.socket_path, "POST", "/viewer/key", {"variables": variables, "folder": "/"}).json()
        assert isinstance(answer, dict) and isinstance(answer.get("key"), str), answer
        return answer["key"]

    def expect_viewer_key_environment(self, login_name: str, folder: str, environment: str) -> str:
        answer = request_answer(self.socket_path, "POST", "/viewer/key", {"variables": {"USER": login_name}, "folder": folder}).json()
        assert isinstance(answer, dict) and answer.get("environment") == environment, answer
        assert isinstance(answer["key"], str) and answer["key"], answer
        return answer["key"]

    def expect_viewer_key_refusal(self, body: object, status: int, text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/viewer/key", body)
        assert answer.status == status and text in answer.text, answer

    def cookie_name(self, base: str) -> str:
        return self.context.viewer.login.cookie_name(base)

    def viewer_port(self) -> int:
        answer = request_answer(self.socket_path, "GET", "/health").json()
        assert isinstance(answer, dict) and isinstance(answer["viewer_port"], int), answer
        return answer["viewer_port"]

    def expect_viewer_login(self, key: str) -> str:
        status, headers, _ = viewer_answer(self.viewer_port(), f"/?key={key}", "", "")
        cookie = headers.get("Set-Cookie", "")
        assert status == 303 and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers)
        return cookie.split(";", 1)[0]

    def expect_viewer_login_target(self, key: str, query: str, location: str) -> None:
        self.expect_viewer_redirect(f"/?key={key}{query}", "", location)

    def expect_viewer_redirect(self, path: str, cookie: str, location: str) -> None:
        status, headers, _ = viewer_answer(self.viewer_port(), path, cookie, "")
        assert status == 303 and headers.get("Location") == location, (status, headers)

    def viewer_upload(self, path: str, cookie: str, data: bytes) -> tuple[int, str]:
        connection = http.client.HTTPConnection("127.0.0.1", self.viewer_port(), timeout=TIMEOUT_SECONDS)
        try:
            connection.request("POST", path, body=data, headers={"Host": f"127.0.0.1:{self.viewer_port()}", "Cookie": cookie, "Content-Type": "application/octet-stream"})
            response = connection.getresponse()
            return response.status, response.read().decode(errors="replace")
        finally:
            connection.close()

    def viewer_download(self, path: str, cookie: str) -> tuple[int, bytes, str]:
        connection = http.client.HTTPConnection("127.0.0.1", self.viewer_port(), timeout=TIMEOUT_SECONDS)
        try:
            connection.request("GET", path, headers={"Host": f"127.0.0.1:{self.viewer_port()}", **({"Cookie": cookie} if cookie else {})})
            response = connection.getresponse()
            return response.status, response.read(), response.getheader("Content-Type") or ""
        finally:
            connection.close()

    def expect_viewer_status(self, path: str, status: int, cookie: str = "", host: str = "", text: str = "") -> None:
        answered, headers, body = viewer_answer(self.viewer_port(), path, cookie, host)
        assert answered == status and text in body, (answered, headers, body)

    def expect_viewer_headers(self, path: str, cookie: str, headers: dict[str, str]) -> None:
        status, answered, _ = viewer_answer(self.viewer_port(), path, cookie, "")
        assert status == 200 and all(value in answered.get(name, "") for name, value in headers.items()), (status, answered)

    def expect_viewer_line(self, cookie: str, body: dict[str, object], status: int, text: str) -> None:
        answered, headers, answer = viewer_answer(self.viewer_port(), "/api/line", cookie, "", body)
        assert answered == status and text in answer, (answered, headers, answer)

    def expect_phone_paired(self, code: str) -> str:
        status, headers, body = viewer_answer(self.viewer_port(), "/viewer/pair", "", "", {"code": code})
        cookie = headers.get("Set-Cookie", "")
        assert status == 200 and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers, body)
        return cookie.split(";", 1)[0]

    def expect_pairing_refusal(self, code: str, text: str) -> None:
        status, headers, body = viewer_answer(self.viewer_port(), "/viewer/pair", "", "", {"code": code})
        assert status == 400 and text in body and "Set-Cookie" not in headers, (status, headers, body)

    def viewer_event_ids(self, cookie: str, cursor_id: int, count: int) -> list[int]:
        port = self.viewer_port()
        connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
        try:
            connection.request("GET", f"/api/events?cursor={cursor_id}&environment=main", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
            response = connection.getresponse()
            ids: list[int] = []
            while len(ids) < count:
                line = response.readline().decode()
                if line.startswith("id: "):
                    ids.append(int(line[4:]))
            return ids
        finally:
            connection.close()

    def expect_viewer_event_ids(self, cookie: str, cursor_id: int, count: int, ids: list[int]) -> None:
        assert self.viewer_event_ids(cookie, cursor_id, count) == ids

    def viewer_stream(self, cookie: str, cursor_id: int, patterns: list[str]):
        port = self.viewer_port()
        follows = [("follow", pattern) for pattern in patterns] or [("follow", "")]
        query = urlencode([("cursor", str(cursor_id)), ("environment", "main"), *follows])
        connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
        try:
            connection.request("GET", f"/api/events?{query}", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
            response = connection.getresponse()
            assert response.status == 200, response.status
            yield response
        finally:
            connection.close()

    def expect_health(self) -> None:
        answer = request_answer(self.socket_path, "GET", "/health")
        health = answer.json()
        assert answer.status == 200 and isinstance(health, dict), answer
        assert (health["status"], health["pid"], health["code_version"]) == ("ok", os.getpid(), answer.code_version) and health["started_at"], answer

    def expect_cli_exit(self, line: str, folder: str, code: int, text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": folder})
        assert answer.exit_code == code and text in answer.text, answer

    def expect_atomic_writes(self, lines: list[str]) -> None:
        with ThreadPoolExecutor(len(lines)) as pool:
            answers = list(pool.map(lambda line: request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"}), lines))
        assert all(answer.exit_code == 0 for answer in answers), answers

    def expect_stop(self) -> None:
        answer = request_answer(self.socket_path, "POST", "/stop", None)
        assert answer.status == 200 and answer.json() == {"status": "stopping"}, answer

    def run_as(self, line: str, session: str) -> ServerAnswer:
        return request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "variables": {"JOURNAL_AGENT_SESSION": session}, "folder": "/"})

    def expect_hook_answer(self, route: str, body: object, status: int, text: str, headers: dict[str, str] | None = None) -> None:
        answer = request_answer(self.socket_path, "POST", route, body, headers or {})
        assert answer.status == status and (text in answer.text if text else answer.text == ""), answer

    def expect_status(self, method: str, route: str, body: object, status: int) -> None:
        answer = request_answer(self.socket_path, method, route, body)
        assert answer.status == status, answer

    def post_repeated_health(self) -> None:
        first_request, last_request = b"GET /health HTTP/1.1\r\nHost: journal\r\n\r\n", b"GET /health HTTP/1.1\r\nHost: journal\r\nConnection: close\r\n\r\n"
        assert raw_answer(self.socket_path, first_request + last_request).count(b"HTTP/1.1 200") == 2

    def post_timed_line(self, line: str, timing_text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"}, {TIMING_HEADER: timing_text})
        assert answer.exit_code == 0, answer
