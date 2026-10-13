
from controllers.types import Facts, Rules
from resources.base import AGENT
from tests.conftest import fresh


def test_every_standing_rule_and_fact_is_read_again_a_week_on():
    from features.memory_checkpoints.reread import owed, standing
    record = fresh()
    Facts(record, actor=AGENT).create("the port is 8423", brief="seen in the heartbeat", keywords=["port"])
    struck = Facts(record, actor=AGENT).create("the port is 8430", brief="an old port", keywords=["port"])
    Facts(record, actor=AGENT).complete(struck.n, "moved")
    Rules(record, actor=AGENT).create("main only", brief="the user said so", keywords=["branch"])
    assert owed(record) is False, "a young record owes no reading pass yet"
    assert owed(record, days=0) is True, "a week after its first event, never read: owed"
    assert sorted(r.ref for r in standing(record)) == ["fact:1", "rule:1"], "the reading pass is every standing rule and fact"
    Rules(record, actor=AGENT).action("reread")()
    assert owed(record) is False, "read: no longer owed"


def test_the_last_reread_time_moves_into_the_features_own_state_once():
    from features.memory_checkpoints.reread import READ_AT, STATE
    from migrations.m0064_reread_time_in_memory_checkpoints_state import run

    record = fresh()
    record.set_setting(READ_AT, 123.0)
    assert run(record.root) == ["t: the last reread of rules and facts moved into memory_checkpoints' state"], "a time kept in settings is moved"
    assert record.state(STATE).get(READ_AT) == 123.0, "the feature's state now holds the time"
    assert run(record.root) == [], "a time already moved is not moved again"
