import re
from http.server import BaseHTTPRequestHandler
from types import SimpleNamespace

from server.viewer.hosted_headers import HostedHeaders
from server.viewer.viewer_request_handler import ViewerRequestHandler

PUBLIC_ORIGIN = "https://journal.example.com"
HOSTED_COOKIE = r"__Host-journal_viewer=[^;]+; Secure; HttpOnly; SameSite=Strict; Path=/"


def test_the_hosted_session_cookie_is_host_prefixed_secure_and_http_only():
    cookie = HostedHeaders(PUBLIC_ORIGIN).cookie(f"{HostedHeaders.cookie_prefix}journal_viewer", "token")
    assert re.fullmatch(HOSTED_COOKIE, cookie)


def test_every_answer_carries_the_common_headers_once_even_when_the_answer_set_one(monkeypatch):
    delivered: list[tuple[str, str]] = []
    monkeypatch.setattr(BaseHTTPRequestHandler, "send_header", lambda handler, name, value: delivered.append((name, value)))
    monkeypatch.setattr(BaseHTTPRequestHandler, "end_headers", lambda handler: None)
    handler = object.__new__(ViewerRequestHandler)
    handler.sent_header_names = set()
    handler.viewer = lambda: SimpleNamespace(answer_headers=HostedHeaders(PUBLIC_ORIGIN))
    handler.send_header("X-Content-Type-Options", "nosniff")
    handler.end_headers()
    names = [name for name, _ in delivered]
    assert sorted(names) == sorted(HostedHeaders(PUBLIC_ORIGIN).common_headers())
    assert names.count("X-Content-Type-Options") == 1


def test_the_content_policy_belongs_to_the_shell_page_alone():
    headers = HostedHeaders(PUBLIC_ORIGIN)
    assert "Content-Security-Policy" in headers.shell_page() and "Content-Security-Policy" not in headers.common_headers()
