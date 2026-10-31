from core.modules.reviews.models.enums.point_finding import PointFinding
from core.modules.reviews.support.review_report import ReviewReport


def findings(text: str) -> list[tuple[int, PointFinding, str]]:
    return [(point.number, point.finding, point.reason) for point in ReviewReport(text).points()]


def test_a_line_names_a_point_and_whether_it_passed():
    assert findings("1 passed") == [(1, PointFinding.PASSED, "")]


def test_a_short_or_undecided_point_carries_its_reason():
    assert findings("2 short: the total is wrong\n3 undecided: the tests cannot run") == [
        (2, PointFinding.SHORT, "the total is wrong"),
        (3, PointFinding.UNDECIDED, "the tests cannot run"),
    ]


def test_points_are_split_by_line():
    assert [number for number, _, _ in findings("1 passed\n2 passed\n3 passed")] == [1, 2, 3]


def test_points_are_split_by_sentence():
    assert findings("1 passed. 2 short: no test. 3 undecided: unclear.") == [
        (1, PointFinding.PASSED, ""),
        (2, PointFinding.SHORT, "no test"),
        (3, PointFinding.UNDECIDED, "unclear"),
    ]


def test_a_tests_line_is_not_a_point():
    assert findings("1 passed\ntests: 12 passed") == [(1, PointFinding.PASSED, "")]


def test_a_report_with_no_points_names_none_and_is_undecided():
    report = ReviewReport("looks fine to me")
    assert report.points() == ()
    assert not report.is_approved(2)
    assert report.is_undecided(2)


def test_every_point_passed_is_approved():
    assert ReviewReport("1 passed\n2 passed").is_approved(2)


def test_a_point_short_is_neither_approved_nor_undecided():
    report = ReviewReport("1 passed\n2 short: wrong")
    assert not report.is_approved(2)
    assert not report.is_undecided(2)


def test_a_point_not_named_is_undecided():
    report = ReviewReport("1 passed")
    assert not report.is_approved(2)
    assert report.is_undecided(2)
