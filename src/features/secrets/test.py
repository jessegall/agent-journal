import stat
import time

import features
from controllers.types import Messages
from features.secrets.controller import Secrets
from features.secrets.values import ValuesFile
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused

VALUE = "sk-test-4f9a1c7e2b"


def test_a_secret_keeps_its_value_in_a_file_of_its_own_and_nowhere_in_the_journal(tmp_path, monkeypatch):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    features.load()
    record = fresh()
    asked = Secrets(record, actor=AGENT).request("Stripe test", "to run the payment tests")
    assert [raw["variable"] for raw in asked.secret_fields] == ["STRIPE_TEST_KEY"] and asked.is_waiting(), "an asked-for key waits with one hidden field"
    assert f"secret {asked.n}" in Messages(record, actor=SYSTEM).rows.every()[-1].brief, \
        "the request reaches the chat as a card that opens the secret"
    assert "only you fill in" in refused(lambda: Secrets(record, actor=AGENT).fill(asked.n, "key", VALUE)), "the agent never fills in a value"
    filled = Secrets(record, actor=USER).fill(asked.n, "key", VALUE)
    values = ValuesFile(record.root)
    assert (values.values(), filled.is_waiting(), filled.asked) == ({"STRIPE_TEST_KEY": VALUE}, False, ""), "the value is in the file and the secret no longer waits"
    assert (stat.S_IMODE(values.path.stat().st_mode), stat.S_IMODE(values.path.parent.stat().st_mode)) == (0o600, 0o700), "only the owner reads the file"
    assert not values.path.is_relative_to(record.root.parent), "the file lives outside the project, so no worktree, backup or copy carries it"
    leaked = [path for path in record.root.rglob("*") if path.is_file() and VALUE.encode() in path.read_bytes()]
    assert leaked == [], f"the value is nowhere in the journal: {leaked}"
    login = Secrets(record, actor=USER).create("Staging", kind="login")
    made = tmp_path / "password.txt"
    made.write_text("generated-pass-9x\n")
    Secrets(record, actor=AGENT).store(login.n, "password", str(made))
    assert (values.values()["STAGING_PASSWORD"], made.exists()) == ("generated-pass-9x", False), "a value the agent made is moved in, and its file removed"
    assert "is one of api key, login, custom" in refused(lambda: Secrets(record, actor=USER).create("X", kind="token")), "the kinds are named"
    assert "has no field 'pin'" in refused(lambda: Secrets(record, actor=USER).fill(login.n, "pin", "1")), "a field the secret lacks is named"


def test_a_deleted_secret_keeps_its_values_for_30_days(tmp_path, monkeypatch):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    features.load()
    record = fresh()
    secrets = Secrets(record, actor=USER)
    row = secrets.create("GitHub", kind="api key")
    secrets.fill(row.n, "key", VALUE)
    secrets.delete(row.n, "no longer needed")
    assert (secrets._purge(), ValuesFile(record.root).values()) == ([], {"GITHUB_KEY": VALUE}), "a secret deleted today keeps its value"
    later = time.time() + 31 * 86400
    monkeypatch.setattr(time, "time", lambda: later)
    assert (secrets._purge(), ValuesFile(record.root).values()) == (["GITHUB_KEY"], {}), "after 30 days its values leave the file"
