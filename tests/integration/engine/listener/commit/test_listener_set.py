import pytest

from engine.database.listener_cursor_table import ListenerCursorTable
from engine.listener.errors.listener_rebuilt_error import ListenerRebuiltError
from engine.time.polled_wait import PolledWait
from tests.integration.support.integration_server import integration_server
from tests.integration.support.listener_builds import LISTENER_THREAD, ListenerBuilds, build_twice

SESSION = "s-1"
WAKE_COUNT = 50
WAIT_SECONDS = 10
POLL_SECONDS = 0.05


def test_building_a_set_twice_for_one_registry_raises_naming_the_thread_and_the_registry(synced_home):
    with pytest.raises(ListenerRebuiltError) as raised:
        build_twice(synced_home, LISTENER_THREAD)
    assert raised.value.thread_name == LISTENER_THREAD
    assert raised.value.fingerprint in str(raised.value)


def test_writes_through_the_server_wake_the_listener_thread_which_builds_its_listeners_once(journal):
    with ListenerBuilds.counted() as builds, integration_server(journal) as server:
        server.start_agent(SESSION)
        assert server.run_as('task make "Wake the listeners" --brief "A task to log on"', SESSION).exit_code == 0
        for number in range(WAKE_COUNT):
            server.run_as(f'task log 1 "step {number}"', SESSION)
        cursors = journal.container.get(ListenerCursorTable)
        assert PolledWait(WAIT_SECONDS, POLL_SECONDS).poll(lambda: not cursors.has_unhandled_events()), "the listener thread never handled the writes"
    assert builds.count(LISTENER_THREAD) == 1
