import re

from server.viewer.hosted_headers import HostedHeaders

PUBLIC_ORIGIN = "https://journal.example.com"
HOSTED_COOKIE = r"__Host-journal_viewer=[^;]+; Secure; HttpOnly; SameSite=Strict; Path=/"


def test_the_hosted_session_cookie_is_host_prefixed_secure_and_http_only():
    cookie = HostedHeaders(PUBLIC_ORIGIN).cookie(f"{HostedHeaders.cookie_prefix}journal_viewer", "token")
    assert re.fullmatch(HOSTED_COOKIE, cookie)
