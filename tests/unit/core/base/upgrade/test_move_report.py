from core.base.upgrade.move_report import MoveReport


def test_the_report_counts_rows_moved_and_rows_repeated_per_table():
    report = MoveReport()
    report.count("tasks", True)
    report.count("tasks", True)
    report.count("tasks", False)
    assert report.moved == {"tasks": 2} and report.repeated == {"tasks": 1}


def test_the_report_counts_the_rows_of_a_dropped_table():
    report = MoveReport()
    report.drop("note_drafts", 4)
    assert report.dropped == {"note_drafts": 4}


def test_reports_add_up():
    first, second = MoveReport(), MoveReport()
    first.count("tasks", True)
    second.count("tasks", True)
    second.drop("old", 2)
    assert first.plus(second).moved == {"tasks": 2} and first.plus(second).dropped == {"old": 2}
