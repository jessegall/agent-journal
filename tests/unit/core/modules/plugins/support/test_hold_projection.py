from core.modules.plugins.support.block_projection import BlockProjection


def test_an_open_stop_hold_under_an_escalation_is_told_apart_from_one_that_refuses_the_stop_now():
    deferred = BlockProjection.projected({"closed_at": None, "scope_stop": True, "escalation_id": 4})
    refusing = BlockProjection.projected({"closed_at": None, "scope_stop": True, "escalation_id": None})
    skipped = BlockProjection.projected({"closed_at": "t", "closed_reason": "waived", "closer": "agent:3"})
    assert (deferred["stop_deferred"], refusing["stop_deferred"], skipped["waived_by"], deferred["version"]) == (True, False, "agent:3", 2)
