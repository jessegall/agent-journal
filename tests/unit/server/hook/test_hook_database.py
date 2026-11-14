import pytest

from engine.journal.journal_home import JournalHome
from server.hook.hook_database import HookDatabase
from server.hook.hook_sender import MAIN_AGENT_HOOK_PRIORITY


@pytest.mark.parametrize("seconds", [0.125, 5.0])
def test_returning_a_hook_connection_restores_its_busy_timeout(tmp_path, seconds):
    pool = HookDatabase(JournalHome(tmp_path), instant_capacity=1)
    try:
        pool.databases[0].set_busy_timeout(seconds)
        with pool.used(MAIN_AGENT_HOOK_PRIORITY, 1) as database:
            database.set_busy_timeout(0)
        with pool.used(MAIN_AGENT_HOOK_PRIORITY, 1) as database:
            assert database.busy_timeout_seconds() == seconds
        with pytest.raises(ValueError):
            with pool.used(MAIN_AGENT_HOOK_PRIORITY, 1) as database:
                database.set_busy_timeout(0)
                raise ValueError
        with pool.used(MAIN_AGENT_HOOK_PRIORITY, 1) as database:
            assert database.busy_timeout_seconds() == seconds
    finally:
        pool.close()
