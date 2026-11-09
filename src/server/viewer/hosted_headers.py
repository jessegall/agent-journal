from collections.abc import Mapping

from server.viewer.answer_headers import AnswerHeaders

TRANSPORT_SECURITY_SECONDS = 63072000
SHELL_POLICY = "default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'"


class HostedHeaders(AnswerHeaders):
    """The headers of a hosted journal: transport security on every answer, a content policy on the shell page,
    and a cookie that only the public origin can set and read."""

    cookie_prefix = "__Host-"

    def __init__(self, public_origin: str) -> None:
        self.public_origin = public_origin

    def common_headers(self) -> Mapping[str, str]:
        return {"Strict-Transport-Security": f"max-age={TRANSPORT_SECURITY_SECONDS}", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer"}

    def shell_page(self) -> Mapping[str, str]:
        return {"Content-Security-Policy": SHELL_POLICY}

    def listener_origin(self, host: str) -> str:
        return self.public_origin

    def cookie(self, name: str, value: str) -> str:
        return f"{name}={value}; Secure; HttpOnly; SameSite=Strict; Path=/"
