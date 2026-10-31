import pytest

from core.base.refusal import Refusal
from core.modules.reviews.models.enums.point_verdict import PointVerdict
from core.modules.reviews.models.review_point import ReviewPoint


def test_a_point_is_numbered_from_1():
    assert ReviewPoint(review_id=1, creator_id=1, number=1, verdict=PointVerdict.PASSED).reason == ""
    with pytest.raises(Refusal):
        ReviewPoint(review_id=1, creator_id=1, number=0, verdict=PointVerdict.SHORT, reason="x")
