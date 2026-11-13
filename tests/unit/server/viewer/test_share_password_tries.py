import base64
import threading
from concurrent.futures import ThreadPoolExecutor
from types import SimpleNamespace

from server.viewer.share_password_tries import TRY_COUNT
from server.viewer.share_route import PASSWORD_NEEDED, PASSWORD_TRY_LIMIT_STATUS, OPEN, ShareRoute

TOKEN = "link-token"
RIGHT_PASSWORD = "open-sesame"
PARALLEL_GUESSES = 20
BARRIER_LIMIT_SECONDS = 30


class LockedShares:
    """A locked share link whose password checks all wait at one barrier, so every admitted guess is compared
    at the same moment, as guesses sent at once over a tunnel are."""

    def __init__(self, comparing_parties: int) -> None:
        self.barrier = threading.Barrier(comparing_parties, timeout=BARRIER_LIMIT_SECONDS)

    def link(self, token: str) -> SimpleNamespace:
        return SimpleNamespace(locked=True)

    def is_open(self, link: SimpleNamespace) -> bool:
        return True

    def is_locked(self, link: SimpleNamespace, token: str, key: str) -> bool:
        return True

    def unlock(self, token: str, password: str) -> str | None:
        self.barrier.wait()
        return "unlock-key" if password == RIGHT_PASSWORD else None

    def count_view(self, token: str) -> None:
        pass


def basic(password: str) -> str:
    return "Basic " + base64.b64encode(f"visitor:{password}".encode()).decode()


def status(route: ShareRoute, password: str) -> int:
    return route.opening(TOKEN, basic(password), "").status


def test_wrong_guesses_sent_at_once_past_the_limit_are_refused():
    route = ShareRoute(LockedShares(TRY_COUNT))
    with ThreadPoolExecutor(PARALLEL_GUESSES) as pool:
        statuses = list(pool.map(lambda number: status(route, f"guess-{number}"), range(PARALLEL_GUESSES)))
    assert statuses.count(PASSWORD_NEEDED) == TRY_COUNT
    assert statuses.count(PASSWORD_TRY_LIMIT_STATUS) == PARALLEL_GUESSES - TRY_COUNT


def test_a_right_password_is_no_wrong_try():
    route = ShareRoute(LockedShares(1))
    assert [status(route, "wrong") for _ in range(TRY_COUNT - 1)] == [PASSWORD_NEEDED] * (TRY_COUNT - 1)
    assert status(route, RIGHT_PASSWORD) == OPEN
    assert [status(route, "wrong"), status(route, "wrong")] == [PASSWORD_NEEDED, PASSWORD_TRY_LIMIT_STATUS]
