from core.modules.helpers.support.helper_spend import COST_LIMIT, HelperSpend


def spend(cost: float | None, baseline: float | None, max_cost: float = 1.0) -> HelperSpend:
    return HelperSpend(0, cost, baseline, 60, max_cost)


def test_a_job_pays_only_for_what_the_session_spent_since_the_job_began():
    assert round(spend(3.4, 3.0).cost_spent, 6) == 0.4
    assert spend(3.4, 3.0).cost_share < 1


def test_a_fractional_cost_cap_is_a_share_of_a_fraction():
    assert spend(0.6, 0.0, 0.5).share >= 1
    assert spend(0.6, 0.0, 0.5).limit_name == COST_LIMIT


def test_s59_unknown_or_reset_cost_is_not_zero():
    for reading, baseline in ((None, 0.0), (0.4, None), (0.4, 3.0)):
        result = spend(reading, baseline)
        assert result.cost_spent is None and result.cost_uncertain and result.cost_share == 0.0


def test_a_cost_limit_of_zero_is_unlimited_and_never_uncertain():
    assert not spend(None, None, 0).cost_uncertain
