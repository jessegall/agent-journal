from core.modules.plugins.support.hold_projection import HoldProjection


def test_an_open_stop_hold_under_an_escalation_is_told_apart_from_one_that_refuses_the_stop_now():
    deferred = HoldProjection.projected({"closed_at": None, "scope_stop": True, "escalation_id": 4})
    refusing = HoldProjection.projected({"closed_at": None, "scope_stop": True, "escalation_id": None})
    waived = HoldProjection.projected({"closed_at": "t", "closed_reason": "waived", "closer": "agent:3"})
    assert (deferred["stop_deferred"], refusing["stop_deferred"], waived["waived_by"], deferred["version"]) == (True, False, "agent:3", 2)
