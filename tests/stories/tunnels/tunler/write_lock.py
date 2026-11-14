import pytest

from engine.database.database import Database
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.tunnels.tunler.support.fake_tunler_client import FakeTunlerClient, TUNLER_HOST, ACCOUNT
from tunnels.tunler.support.tunler_client import TunlerClient

MODULE = "tunnels.tunler.tunler_module:TunlerModule"
LINES = [f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one", "tunler logout", f"tunler release one.{TUNLER_HOST}", "tunler update", f"tunler install {TUNLER_HOST}"]


class WatchedClient(FakeTunlerClient):
    """Notes whether the database held a transaction at each call that waits on tunler."""

    def __init__(self, database: Database) -> None:
        super().__init__(domains=[f"one.{TUNLER_HOST}"], latest="v0.3.0")
        self.database = database
        self.held: list[bool] = []

    def login(self, host, username, password, master):
        self.held.append(self.database.has_transaction)
        return super().login(host, username, password, master)

    def logout(self):
        self.held.append(self.database.has_transaction)
        super().logout()

    def release(self, domain):
        self.held.append(self.database.has_transaction)
        super().release(domain)

    def update(self):
        self.held.append(self.database.has_transaction)
        return super().update()

    def install(self, host):
        self.held.append(self.database.has_transaction)
        return super().install(host)


@pytest.mark.parametrize("line", LINES)
def test_a_call_that_waits_on_tunler_holds_no_write_lock(new_story, line):
    story = new_story(MODULE, fixture=UserJoined)
    client = WatchedClient(story.container.get(Database))
    story.replace(TunlerClient, client)
    story.expect_success(line, actor=story.user)
    story.expect_rows(client.held == [False])
