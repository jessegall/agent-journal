from core.modules.assignments.models.enums.kept_reason import KeptReason
from core.modules.assignments.support.cascade import Cascade


def test_counts_per_model():
    cascade = Cascade().with_assigned("plan").with_assigned("phase").with_assigned("phase")
    assert cascade.counts() == {"plan": 1, "phase": 2} and cascade.text == "assigned 1 plan, 2 phases"


def test_kept_rows_carry_their_reason():
    cascade = Cascade().with_assigned("plan").with_kept("task", 7, KeptReason.HAND_GIVEN)
    assert cascade.kept_rows[0].reason is KeptReason.HAND_GIVEN and cascade.text == "assigned 1 plan; kept 1 task (given by hand)"


def test_an_assign_that_changed_nothing_says_so():
    assert Cascade().text == "assigned nothing new"
