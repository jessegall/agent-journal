"""The login check Caddy asks before every request: a correct username and password let the request through, and an
address that gave a wrong one three times within a minute is refused until that minute has passed, so the password
cannot be guessed at speed. It runs as the user caddy, on the loopback, and holds only the password's scrypt key."""

import base64
import hashlib
import hmac
import os
import threading
import time
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 8429
FAILURES_ALLOWED = 3
FAILURE_WINDOW_SECONDS = 60
SCRYPT_COST = {"n": 2 ** 14, "r": 8, "p": 1}
REALM = 'Basic realm="journal"'
CLIENT_HEADER = "X-Journal-Client"

USER = os.environ["JOURNAL_USER"]
SALT = bytes.fromhex(os.environ["JOURNAL_LOGIN_SALT"])
KEY = bytes.fromhex(os.environ["JOURNAL_LOGIN_KEY"])

lock = threading.Lock()
failures: dict[str, deque[float]] = defaultdict(deque)
# the Authorization headers already found correct, so a logged-in browser's requests cost no scrypt each
accepted: set[str] = set()


def key_of(password: str) -> bytes:
    return hashlib.scrypt(password.encode(), salt=SALT, dklen=len(KEY), **SCRYPT_COST)


def is_correct(header: str) -> bool:
    if not header.startswith("Basic "):
        return False
    try:
        user, _, password = base64.b64decode(header[6:], validate=True).decode().partition(":")
    except ValueError:
        return False
    return hmac.compare_digest(user.encode(), USER.encode()) & hmac.compare_digest(key_of(password), KEY)


def recent_failures(address: str, now: float) -> deque[float]:
    times = failures[address]
    while times and now - times[0] >= FAILURE_WINDOW_SECONDS:
        times.popleft()
    return times


class LoginGate(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        header = self.headers.get("Authorization", "")
        # the client's address as Caddy works it out past the trusted ingress, set by Caddy over any the client sent
        address = self.headers.get(CLIENT_HEADER, "")
        with lock:
            if header in accepted:
                return self.answer(200)
            now = time.monotonic()
            times = recent_failures(address, now)
            if len(times) >= FAILURES_ALLOWED:
                return self.answer(429, retry_after=int(FAILURE_WINDOW_SECONDS - (now - times[0])) + 1)
        if not header:
            return self.answer(401)
        if is_correct(header):
            with lock:
                accepted.add(header)
            return self.answer(200)
        with lock:
            recent_failures(address, time.monotonic()).append(time.monotonic())
        return self.answer(401)

    def answer(self, status: int, retry_after: int = 0) -> None:
        self.send_response(status)
        if status == 401:
            self.send_header("WWW-Authenticate", REALM)
        if retry_after:
            self.send_header("Retry-After", str(retry_after))
        self.send_header("Content-Length", "0")
        self.end_headers()

    def log_message(self, format: str, *args: object) -> None:
        return None


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", PORT), LoginGate).serve_forever()
