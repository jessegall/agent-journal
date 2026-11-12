from engine.database.repeated_finding import RepeatedFinding
from engine.database.reported_findings import REPEAT_AFTER_SECONDS, ReportedFindings


class Clock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def test_a_finding_with_the_same_count_is_reported_once():
    clock = Clock()
    reported = ReportedFindings(clock)
    assert reported.unreported([RepeatedFinding("read x", "text", 120)]) == [RepeatedFinding("read x", "text", 120)]
    assert reported.unreported([RepeatedFinding("read x", "text", 120)]) == []


def test_a_finding_is_reported_again_on_a_new_count():
    reported = ReportedFindings(Clock())
    reported.unreported([RepeatedFinding("read x", "text", 120)])
    assert reported.unreported([RepeatedFinding("read x", "text", 300)]) == [RepeatedFinding("read x", "text", 300)]
    assert reported.unreported([RepeatedFinding("read x", "text", 300)]) == []


def test_a_finding_is_reported_again_after_an_hour():
    clock = Clock()
    reported = ReportedFindings(clock)
    reported.unreported([RepeatedFinding("read x", "text", 120)])
    clock.now = REPEAT_AFTER_SECONDS - 1
    assert reported.unreported([RepeatedFinding("read x", "text", 120)]) == []
    clock.now = REPEAT_AFTER_SECONDS
    assert len(reported.unreported([RepeatedFinding("read x", "text", 120)])) == 1
