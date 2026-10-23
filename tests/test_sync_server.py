import pytest

from sync_server.account import ADMIN, MEMBER
from sync_server.accounts import Accounts
from sync_server.change_log import ChangeLog
from sync_server.devices import FAILURES_ALLOWED, LOCKOUT_SECONDS, Devices
from sync_server.id_ranges import IdRanges
from sync_server.logged_change import LoggedChange
from sync_server.protocol import PROTOCOL, PROTOCOL_HEADER
from sync_server.refusal import Refusal
from sync_server.stored_row import StoredRow
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
    assert log.row("tasks", 7) == StoredRow({"title": "c", "brief": "b"}, {"title": 2.0, "brief": 1.0}, {"title": 2, "brief": 1})
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


def test_a_push_keeps_the_later_edit_of_a_field_puts_times_on_the_servers_clock_and_rejects_the_older(store):
    from sync_server.push_handler import PushHandler
    from sync_server.push_results import PushResults
    from sync_server.db.push_result_rows import PushResultRows
    from sync_server.push_request import PushRequest
    from sync_server.rejected_field import RejectedField

    accounts, devices = people(store)
    accounts.create("ada@example.com", "Ada", PASSWORD, ADMIN, 1.0)
    accounts.create("bob@example.com", "Bob", PASSWORD, MEMBER, 1.0)
    _, ada = devices.login("ada@example.com", PASSWORD, "ada's laptop", "10.0.0.1", 2.0)
    _, bob = devices.login("bob@example.com", PASSWORD, "bob's laptop", "10.0.0.2", 2.0)
    log = ChangeLog(store, ChangeRows(store), RowValues(store))
    push = PushHandler(store, log, devices, PushResults(PushResultRows(store)))

    def request(action, actor, fields, seconds, clock_offset=0.0):
        return PushRequest.parsed([{"row_table": "tasks", "row": 7, "action": action, "actor": actor, "fields": fields, "changed_at": {name: seconds for name in fields}}], clock_offset)

    assert push.answer(ada, request("created", "user:1", {"title": "first", "brief": "b"}, 10.0), 11.0).sequences == (1,)
    answer = push.answer(bob, request("updated", "agent:s", {"title": "bob's"}, 120.0, -100.0), 21.0)
    assert (answer.sequences, answer.rejected, answer.server_time) == ((2,), (), 21.0), "bob's clock runs 100 seconds ahead; his edit was made at 20 by the server's"
    older = push.answer(ada, request("updated", "user:1", {"title": "ada's", "brief": "c"}, 15.0), 22.0)
    assert older.rejected == (RejectedField("tasks", 7, "title", "bob's", 20.0, "Bob"),), "the older edit of the title is rejected and sent back with the value that stands and who wrote it"
    assert log.row("tasks", 7) == StoredRow({"title": "bob's", "brief": "c"}, {"title": 20.0, "brief": 15.0}, {"title": 2, "brief": 1}), "the brief, which nobody edited later, is kept"
    push.answer(bob, request("deleted", "user:2", {}, 30.0), 31.0)
    stale = push.answer(ada, request("updated", "user:1", {"title": "too late"}, 40.0), 41.0)
    assert stale.sequences == (0,) and stale.rejected == (RejectedField.deleted_row("tasks", 7),), "an update to a deleted row is dropped and named"
    with pytest.raises(Refusal, match="a person sends only their own writes"):
        push.answer(ada, request("updated", "user:2", {"title": "as bob"}, 50.0), 51.0)
    assert log.head() == 4, "a refused push keeps nothing"


def test_over_http_a_pull_waits_and_wakes_on_a_push_while_other_requests_go_on_and_a_joiner_downloads_a_full_copy(tmp_path):
    import json
    import threading
    import time
    import urllib.error
    import urllib.request

    from sync_server.team_server import TeamServer

    team = TeamServer(tmp_path)
    team.accounts.create("ada@example.com", "Ada", PASSWORD, ADMIN, 1.0)
    team.accounts.create("bob@example.com", "Bob", PASSWORD, MEMBER, 1.0)
    server = team.started("127.0.0.1", 0)
    address = f"http://127.0.0.1:{server.server_address[1]}"

    def call(path, body=None, token=""):
        request = urllib.request.Request(address + path, data=None if body is None else json.dumps(body).encode(), headers={PROTOCOL_HEADER: str(PROTOCOL), **({"Authorization": f"Bearer {token}"} if token else {})})
        try:
            with urllib.request.urlopen(request, timeout=10) as answer:
                return answer.status, json.loads(answer.read())
        except urllib.error.HTTPError as refused:
            return refused.code, json.loads(refused.read())

    try:
        assert call("/login", {"email": "ada@example.com", "password": "wrong", "device_name": "laptop"}) == (403, {"error": "the email or the password is wrong"})
        ada = call("/login", {"email": "ada@example.com", "password": PASSWORD, "device_name": "laptop"})[1]["token"]
        bob = call("/login", {"email": "bob@example.com", "password": PASSWORD, "device_name": "desktop"})[1]["token"]
        assert call("/pull?after=0", token="made up")[0] == 403 and call("/nothing")[0] == 404
        task = {"row_table": "tasks", "row": 7, "action": "created", "actor": "user:1", "fields": {"title": "first"}, "changed_at": {"title": 1.0}}
        assert call("/push", {"changes": [task]}, ada)[1]["sequences"] == [1]
        first = call("/pull?after=0", token=bob)[1]
        assert [change["row"] for change in first["changes"]] == [7] and first["head"] == 1 and first["server_time"] > 0
        assert call("/pull?after=0", token=ada)[1]["changes"] == [], "a device never pulls its own changes"
        waited = {}

        def held_pull():
            began = time.monotonic()
            waited["answer"] = call("/pull?after=1&wait=8", token=bob)[1]
            waited["seconds"] = time.monotonic() - began

        puller = threading.Thread(target=held_pull)
        puller.start()
        time.sleep(0.3)
        began = time.monotonic()
        copy = call("/copy", token=ada)[1]
        assert time.monotonic() - began < 2, "another request is answered while a pull is held"
        assert copy["rows"] == [{"row_table": "tasks", "row": 7, "fields": {"title": "first"}, "changed_at": {"title": 1.0}}] and copy["head"] == 1
        call("/push", {"changes": [{**task, "action": "updated", "fields": {"title": "second"}, "changed_at": {"title": 2.0}}]}, ada)
        puller.join(10)
        assert [change["fields"] for change in waited["answer"]["changes"]] == [{"title": "second"}] and waited["seconds"] < 4, "the held pull answers the moment a change arrives"
        assert team.devices.pulled_sequence(team.devices.device(bob)) == 1, "the sequence a device holds is recorded"
    finally:
        server.shutdown()
        server.server_close()
        team.store.close()


def test_a_push_sent_again_after_a_lost_answer_is_kept_once_and_answered_as_the_first_time(store):
    from sync_server.db.push_result_rows import PushResultRows
    from sync_server.push_handler import PushHandler
    from sync_server.push_request import PushRequest
    from sync_server.push_results import PushResults

    accounts, devices = people(store)
    accounts.create("ada@example.com", "Ada", PASSWORD, ADMIN, 1.0)
    accounts.create("bob@example.com", "Bob", PASSWORD, MEMBER, 1.0)
    _, ada = devices.login("ada@example.com", PASSWORD, "laptop", "10.0.0.1", 2.0)
    _, bob = devices.login("bob@example.com", PASSWORD, "desktop", "10.0.0.2", 2.0)
    log = ChangeLog(store, ChangeRows(store), RowValues(store))
    push = PushHandler(store, log, devices, PushResults(PushResultRows(store)))

    def request(local_number, actor, title, seconds):
        return PushRequest.parsed([{"row_table": "tasks", "row": 7, "action": "updated", "actor": actor, "fields": {"title": title}, "changed_at": {"title": seconds}, "local_number": local_number}])

    push.answer(bob, request(1, "user:2", "bob's", 20.0), 21.0)
    first = push.answer(ada, request(5, "user:1", "ada's", 10.0), 22.0)
    again = push.answer(ada, request(5, "user:1", "ada's", 10.0), 23.0)
    assert (again.sequences, again.rejected) == (first.sequences, first.rejected) and first.rejected[0].writer == "Bob", "the second answer is the first, rejection and all"
    bob_again = push.answer(bob, request(1, "user:2", "bob's", 20.0), 24.0)
    assert bob_again.sequences == (1,) and bob_again.rejected == () and log.head() == 1, "a change sent twice is kept once and never rejected by itself"
    assert push.answer(ada, request(6, "user:1", "ada's newest", 30.0), 31.0).sequences == (2,), "a new local number is a new change"


def test_an_admin_invites_a_person_hands_out_blocks_lists_revokes_and_removes_and_takes_the_first_full_copy(tmp_path):
    import json
    import urllib.error
    import urllib.request

    from sync_server.team_server import TeamServer

    team = TeamServer(tmp_path)
    team.accounts.create("ada@example.com", "Ada", PASSWORD, ADMIN, 1.0)
    server = team.started("127.0.0.1", 0)
    address = f"http://127.0.0.1:{server.server_address[1]}"

    def call(path, body=None, token=""):
        request = urllib.request.Request(address + path, data=None if body is None else json.dumps(body).encode(), headers={PROTOCOL_HEADER: str(PROTOCOL), **({"Authorization": f"Bearer {token}"} if token else {})})
        try:
            with urllib.request.urlopen(request, timeout=10) as answer:
                return answer.status, json.loads(answer.read())
        except urllib.error.HTTPError as refused:
            return refused.code, json.loads(refused.read())

    try:
        for path in ("/invite", "/blocks", "/devices/revoke", "/people/remove", "/upload"):
            assert call(path, {})[0] == 403, f"{path} refuses a request with no token"
        ada = call("/login", {"email": "ada@example.com", "password": PASSWORD, "device_name": "laptop"})[1]["token"]
        upload = {"rows": [{"row_table": "tasks", "row": 1450, "fields": {"title": "from before"}, "changed_at": {"title": 1.0}}], "highest": {"tasks": 1450}, "repository": "", "version": "4.20.0"}
        assert call("/team") == (200, {"repository": "", "has_rows": False, "version": ""}), "anyone may ask what the team holds before joining"
        assert call("/upload", {**upload, "repository": "abc123"}, ada) == (200, {"rows": 1, "head": 1})
        assert call("/team") == (200, {"repository": "abc123", "has_rows": True, "version": "4.20.0"}), "the first copy pins the team to its journal's version"
        assert call("/upload", upload, ada)[1]["error"].startswith("the team's journal already holds rows"), "a full copy is taken once"
        assert call("/blocks", {"tables": ["tasks", "messages"]}, ada)[1]["blocks"] == [{"row_table": "tasks", "first": 1451, "last": 1950}, {"row_table": "messages", "first": 1, "last": 5000}], "blocks start above the copy's numbers and messages get a bigger one"
        invitation = call("/invite", {"email": "Bob@Example.com"}, ada)[1]
        assert invitation["email"] == "bob@example.com" and invitation["code"]
        assert call("/accept", {"code": invitation["code"], "name": "Bob", "password": PASSWORD, "password_repeat": "another password", "device_name": "desktop"})[1]["error"].startswith("the two passwords differ")
        bob = call("/accept", {"code": invitation["code"], "name": "Bob", "password": PASSWORD, "password_repeat": PASSWORD, "device_name": "desktop"})[1]
        assert bob["name"] == "Bob" and bob["account_id"] == 2
        assert call("/team/version", {"version": "4.21.0"}, bob["token"])[0] == 403, "only an admin moves the team's version"
        assert call("/team/version", {"version": "latest"}, ada)[1]["error"].startswith("latest is not a journal version"), "a version is three numbers"
        assert call("/team/version", {"version": "4.21.0"}, ada)[1]["version"] == "4.21.0"
        assert call("/pull?after=0&wait=0", None, bob["token"])[1]["team_version"] == "4.21.0", "every pull names the version the team is pinned to"
        assert call("/accept", {"code": invitation["code"], "name": "Eve", "password": PASSWORD, "password_repeat": PASSWORD, "device_name": "x"})[1]["error"].startswith("this invitation code is not known or was used"), "a code is used once"
        assert call("/invite", {"email": "eve@example.com"}, bob["token"])[1]["error"].startswith("Bob is no admin"), "only an admin invites"
        assert [device["name"] for device in call("/devices", token=ada)[1]["devices"]] == ["laptop", "desktop"]
        _, laptop = call("/login", {"email": "bob@example.com", "password": PASSWORD, "device_name": "bob's laptop"})
        assert call("/devices/revoke", {"device_id": laptop["device_id"]}, ada)[0] == 200 and call("/copy", token=laptop["token"])[0] == 403, "a revoked device is refused"
        assert call("/people/remove", {"account_id": 2}, ada)[0] == 200
        assert call("/copy", token=bob["token"])[0] == 403 and call("/login", {"email": "bob@example.com", "password": PASSWORD, "device_name": "again"})[0] == 403, "a removed person's devices are refused and they cannot log in"
    finally:
        team.close(server)


def test_two_devices_racing_for_a_lease_leave_exactly_one_holder_and_an_unrenewed_lease_lapses(store):
    import threading
    from sync_server.db.lease_rows import LeaseRows
    from sync_server.leases import LAPSE_SECONDS, Leases

    accounts, devices = people(store)
    ada_account = accounts.create("ada@example.com", "Ada", PASSWORD, ADMIN, 1.0)
    bob_account = accounts.create("bob@example.com", "Bob", PASSWORD, MEMBER, 1.0)
    ada, _ = devices.login("ada@example.com", PASSWORD, "laptop", "10.0.0.1", 2.0)
    bob, _ = devices.login("bob@example.com", PASSWORD, "desktop", "10.0.0.2", 2.0)
    leases = Leases(store, LeaseRows(store), accounts)
    winners, losers = [], []

    def race(device, person):
        try:
            winners.append(leases.acquire("team-chat", device, person, 100.0).holder)
        except Refusal as refused:
            losers.append(str(refused))

    racers = [threading.Thread(target=race, args=pair) for pair in ((ada, ada_account), (bob, bob_account)) * 5]
    for racer in racers:
        racer.start()
    for racer in racers:
        racer.join(5)
    assert len(set(winners)) == 1 and losers and "is held by" in losers[0], "two devices racing for one lease leave exactly one holder"
    holder = ada if winners[0] == "Ada" else bob
    other, other_account = (bob, bob_account) if holder is ada else (ada, ada_account)
    assert leases.acquire("team-chat", holder, ada_account if holder is ada else bob_account, 130.0).renewed_at == 130.0, "the holder renews it by taking it again"
    with pytest.raises(Refusal, match="is held by"):
        leases.acquire("team-chat", other, other_account, 131.0)
    assert leases.state("team-chat", 130.0 + LAPSE_SECONDS + 1).is_lapsed, "a lease nobody renews lapses"
    assert leases.acquire("team-chat", other, other_account, 130.0 + LAPSE_SECONDS + 1).holder == other_account.name, "and another device may take it"
    assert leases.release("team-chat", other, 300.0).holder == "", "its holder lets it go"


def test_a_journal_and_a_team_server_on_different_protocols_are_refused_with_the_side_to_upgrade(tmp_path, monkeypatch):
    import json

    from journal.config import Config
    from journal.sync.team_account import TEAM_FILE, TeamAccount
    from journal.sync.team_refusal import TeamRefusal
    from journal.sync.team_server_link import TeamServerLink
    from sync_server.team_server import TeamServer

    server = TeamServer(tmp_path).started("127.0.0.1", 0)
    address = f"http://127.0.0.1:{server.server_address[1]}"
    config = Config(tmp_path / "journal")
    config.home.mkdir(parents=True)
    (config.home / TEAM_FILE).write_text(json.dumps({"address": address, "token": "t"}))
    link = TeamServerLink(TeamAccount(config))
    try:
        assert link.summary(address) is not None, "a journal on the server's protocol is answered"
        monkeypatch.setattr("journal.sync.team_server_link.PROTOCOL", PROTOCOL - 1)
        with pytest.raises(TeamRefusal, match="upgrade the journal with journal update apply"):
            link.summary(address)
        monkeypatch.setattr("journal.sync.team_server_link.PROTOCOL", PROTOCOL + 1)
        with pytest.raises(TeamRefusal, match="upgrade the team server's image"):
            link.summary(address)
    finally:
        server.shutdown()
        server.server_close()
