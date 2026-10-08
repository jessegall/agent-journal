import features
from controllers.features import Features, writes_a_secret
from features.integrations.client import IntegrationClient
from features.integrations.state import IntegrationState, read_state, state_file, write_state
from features.secrets.values import ValuesFile
from resources.base import AGENT, USER
from surfaces.settings import apply
from tests.conftest import fresh, refused


def test_a_fresh_journal_lists_linear_off_in_the_integrations_group():
    features.load()
    record = fresh()
    described = features.describe()["linear"]
    key = next(setting for setting in described["settings"] if setting["name"] == "key")
    assert (described["group"], described["default"], features.FEATURES["linear"].on_for(record)) == ("integrations", False, False), \
        "Linear is listed under Integrations and starts switched off"
    assert key["kind"] == "secret", "its key is a setting of the secret kind"


def test_only_you_pick_an_integrations_key_and_a_phone_never_does():
    features.load()
    record = fresh()
    assert "only you pick the key" in refused(lambda: Features(record, actor=AGENT).configure("linear", "key", "LINEAR_KEY")), "an agent cannot pick the key"
    assert "only you pick the key" in refused(lambda: apply(record, {"linear": {"key": "LINEAR_KEY"}}, AGENT)), "nor through the settings write"
    Features(record, actor=USER).configure("linear", "key", "LINEAR_KEY")
    assert features.FEATURES["linear"].values(record).key == "LINEAR_KEY", "you can, and it is read back"
    assert (writes_a_secret({"linear": {"key": "LINEAR_KEY"}}), writes_a_secret({"linear": {"enabled": True}}), writes_a_secret({"boards": {"x": 1}})) == (True, False, False), \
        "a settings write that holds a key is told apart, so the phone's allow list can close it"


def test_what_an_integration_learned_is_kept_beside_the_record_and_not_in_it():
    record = fresh()
    write_state(record.root, "linear", IntegrationState(last_checked=42.0, last_error="the key was refused", cursor="2026-10-09"))
    assert read_state(record.root, "linear") == IntegrationState(42.0, "the key was refused", "2026-10-09"), "a sync's state reads back as it was written"
    assert state_file(record.root, "linear").parent.parent.name == "integration-data", "it lives in the journal's integration data folder"
    inside = [path for path in record.root.rglob("*") if path.is_file() and "integration-data" not in path.parts and "the key was refused" in path.read_text(errors="ignore")]
    assert inside == [], "and nothing of it is in the record"


def test_the_integration_client_sends_its_key_only_to_its_own_host_and_masks_it_in_errors(monkeypatch, tmp_path):
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path))
    record = fresh()
    ValuesFile(record.root).put("LINEAR_KEY", "lin_api_secret_value")
    client = IntegrationClient(record.root, "api.linear.app", "LINEAR_KEY")
    assert "only to https://api.linear.app" in refused(lambda: client.post("https://example.com/graphql", {})), "another host is refused"
    assert "only to https://api.linear.app" in refused(lambda: client.post("http://api.linear.app/graphql", {})), "and so is a plain connection to its own host"
    assert client.masked("failed with lin_api_secret_value in it") == "failed with [secret LINEAR_KEY] in it", "an error never carries the key"
    assert "no key is picked" in refused(lambda: IntegrationClient(record.root, "api.linear.app", "").post("https://api.linear.app/graphql", {})), \
        "with no key picked nothing is sent"
