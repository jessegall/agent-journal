import pytest

from sync_server.account import ADMIN, MEMBER
from sync_server.accounts import Accounts
from sync_server.change_log import ChangeLog
from sync_server.devices import FAILURES_ALLOWED, LOCKOUT_SECONDS, Devices
from sync_server.id_ranges import IdRanges
from sync_server.logged_change import LoggedChange
from sync_server.refusal import Refusal
from sync_server.db.account_rows import AccountRows
from sync_server.db.change_rows import ChangeRows
from sync_server.db.device_rows import DeviceRows
from sync_server.db.failed_login_rows import FailedLoginRows
from sync_server.db.id_block_rows import IdBlockRows
from sync_server.db.row_values import RowValues
from sync_server.db.server_schema import MIGRATIONS, ServerSchema
from sync_server.db.store import Store

PASSWORD = "correct horse battery"


def people(store: Store) -> tuple[Accounts, Devices]:
    accounts = Accounts(AccountRows(store))
    return accounts, Devices(DeviceRows(store), FailedLoginRows(store), accounts)


@pytest.fixture
def store(tmp_path) -> Store:
    store = Store(tmp_path / "team.db")
    ServerSchema(store).migrated()
    yield store
    store.close()


def test_the_server_migrates_its_own_schema_once_and_keeps_its_version(tmp_path):
    store = Store(tmp_path / "team.db")
    assert ServerSchema(store).migrated() == len(MIGRATIONS)
    assert ServerSchema(store).migrated() == len(MIGRATIONS), "a second start migrates nothing"
    store.close()


def test_a_person_logs_in_a_device_which_can_be_revoked_and_a_wrong_password_is_refused(store):
    accounts, devices = people(store)
    admin = accounts.create("Ada@Example.com", "Ada", PASSWORD, ADMIN, 1.0)
    assert admin.is_admin() and admin.email == "ada@example.com" and not accounts.is_empty()
    with pytest.raises(Refusal, match="at least"):
        accounts.create("bob@example.com", "Bob", "short", MEMBER, 1.0)
    with pytest.raises(Refusal, match="already has an account"):
        accounts.create("ada@example.com", "Ada again", PASSWORD, MEMBER, 1.0)
    device, token = devices.login("ada@example.com", PASSWORD, "laptop", "10.0.0.1", 2.0)
    assert devices.person(token) == admin and device.name == "laptop"
    assert DeviceRows(store).with_token_hash(token) is None and DeviceRows(store).with_token_hash(Devices.token_hash(token)) is not None, "the token is kept only as a hash"
    with pytest.raises(Refusal, match="email or the password is wrong"):
        devices.login("ada@example.com", "not the password", "phone", "10.0.0.2", 3.0)
    devices.revoke(device.id, 4.0)
    with pytest.raises(Refusal, match="revoked"):
        devices.person(token)
    with pytest.raises(Refusal, match="not known"):
        devices.person("made up")


def test_too_many_failed_logins_from_one_address_shut_it_out_for_a_while(store):
    accounts, devices = people(store)
    accounts.create("ada@example.com", "Ada", PASSWORD, ADMIN, 1.0)
    for attempt in range(FAILURES_ALLOWED):
        with pytest.raises(Refusal):
            devices.login("ada@example.com", "guess", "laptop", "10.0.0.9", 10.0 + attempt)
    with pytest.raises(Refusal, match="too many failed logins"):
        devices.login("ada@example.com", PASSWORD, "laptop", "10.0.0.9", 20.0)
    assert devices.login("ada@example.com", PASSWORD, "laptop", "10.0.0.8", 20.0)[1], "another address is not shut out"
    assert devices.login("ada@example.com", PASSWORD, "laptop", "10.0.0.9", 20.0 + LOCKOUT_SECONDS)[1], "the address may try again once the while is over"


def test_the_log_keeps_changes_in_order_with_each_rows_current_value_and_a_device_never_pulls_its_own(store):
    log = ChangeLog(store, ChangeRows(store), RowValues(store))
    first = log.appended(LoggedChange("tasks", 7, "created", "user:1", 1, 1, {"title": "a", "brief": "b"}, {"title": 1.0, "brief": 1.0}))
    second = log.appended(LoggedChange("tasks", 7, "updated", "agent:s", 2, 2, {"title": "c"}, {"title": 2.0}))
    assert (first.sequence, second.sequence, log.head()) == (1, 2, 2)
    assert log.row("tasks", 7) == ({"title": "c", "brief": "b"}, {"title": 2.0, "brief": 1.0})
    assert [change.sequence for change in log.pull_page(0, 1)] == [2] and [change.sequence for change in log.pull_page(1, 3)] == [2]
    log.appended(LoggedChange("tasks", 7, "deleted", "user:1", 1, 1))
    assert log.row("tasks", 7) is None


def test_number_blocks_never_overlap_and_start_above_a_shared_journals_numbers(store):
    ranges = IdRanges(store, IdBlockRows(store))
    ranges.raise_floor("tasks", 1450)
    ranges.raise_floor("tasks", 1200)
    assert ranges.block(1, "tasks", 100) == (1451, 1550)
    assert ranges.block(2, "tasks", 100) == (1551, 1650)
    assert ranges.block(1, "messages", 1000) == (1, 1000)
