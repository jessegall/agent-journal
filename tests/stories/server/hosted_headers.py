import re

from server.viewer.hosted_headers import HostedHeaders
from tests.stories.server.support.hosted_viewer import PUBLIC_ORIGIN, hosted_server, reply_headers, session_cookie, socket_raw, socket_path
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.support.story_checks import expect_value

TRANSPORT_SECURITY = "Strict-Transport-Security"
HOSTED_HEADERS = {TRANSPORT_SECURITY: "max-age=63072000", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer"}
SHELL_POLICY = "default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'"
POLICY = "Content-Security-Policy"
JSON_ROUTE = "/api/server-state"
FILE_ROUTE = "/viewer/kit/window-kit.js"
SHELL_ROUTE = "/"
HOSTED_COOKIE = r"__Host-journal_viewer=[^;]+; Secure; HttpOnly; SameSite=Strict; Path=/"
LOCAL_COOKIE = r"journal_viewer=[^;]+; HttpOnly; SameSite=Strict; Path=/"


def test_every_hosted_header_is_on_a_json_answer_a_file_answer_and_the_shell_page(hosted_server):
    server, socket_path = hosted_server
    for route in (JSON_ROUTE, FILE_ROUTE, SHELL_ROUTE):
        headers = reply_headers(socket_raw(socket_path, "GET", route, headers=session_cookie(server)))
        expect_value({name: headers.get(name) for name in HOSTED_HEADERS}, HOSTED_HEADERS)


def test_a_hosted_header_is_sent_once_when_the_answer_already_sets_it(hosted_server):
    _, socket_path = hosted_server
    raw_head = socket_raw(socket_path, "GET", FILE_ROUTE).partition(b"\r\n\r\n")[0].decode()
    expect_value(raw_head.count("X-Content-Type-Options"), 1)


def test_the_content_policy_is_on_the_shell_page_only(hosted_server):
    server, socket_path = hosted_server
    expect_value(reply_headers(socket_raw(socket_path, "GET", SHELL_ROUTE, headers=session_cookie(server))).get(POLICY), SHELL_POLICY)
    expect_value(POLICY in reply_headers(socket_raw(socket_path, "GET", JSON_ROUTE)), False)
    expect_value(POLICY in reply_headers(socket_raw(socket_path, "GET", FILE_ROUTE)), False)


def test_the_hosted_session_cookie_is_host_prefixed_secure_and_http_only():
    cookie = HostedHeaders(PUBLIC_ORIGIN).cookie(f"{HostedHeaders.cookie_prefix}journal_viewer", "token")
    expect_value(bool(re.fullmatch(HOSTED_COOKIE, cookie)), True)


def test_a_local_viewer_adds_no_hosted_header_and_keeps_the_old_cookie(new_story):
    with server_story(new_story()) as server:
        key = server.context.viewer.login.new_key(1)
        _, headers, _ = viewer_answer(server.viewer_port(), f"/?key={key}", "", "")
        expect_value(bool(re.fullmatch(LOCAL_COOKIE, headers["Set-Cookie"])), True)
        _, state_headers, _ = viewer_answer(server.viewer_port(), JSON_ROUTE, "", "")
        expect_value([name for name in (*HOSTED_HEADERS, POLICY) if name in state_headers], [])
