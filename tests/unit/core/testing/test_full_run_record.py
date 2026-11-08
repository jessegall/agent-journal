from core.testing.run_size import RunSize
from core.testing.full_run_record import FullRunRecord, FullRunRecords


def test_each_full_run_adds_a_line_with_its_size_and_time(tmp_path):
    file = tmp_path / "runs.jsonl"
    FullRunRecord(4000, 2, 120.0).write(file)
    FullRunRecord(4010, 0, 118.0).write(file)
    records = FullRunRecords.read(file).records
    assert [(record.tests, record.failed, record.seconds) for record in records] == [(4000, 2, 120.0), (4010, 0, 118.0)]


def test_a_run_no_slower_per_test_than_the_ones_before_it_raises_nothing():
    assert FullRunRecords([FullRunRecord(4000, 0, 120.0), FullRunRecord(4400, 0, 140.0)]).growth() == ""


def test_a_run_slower_per_test_than_the_ones_before_it_names_both_times():
    found = FullRunRecords([FullRunRecord(4000, 0, 120.0), FullRunRecord(4000, 0, 121.0), FullRunRecord(4000, 0, 900.0)]).growth()
    assert "0.225 seconds per test over 4000 tests" in found
    assert "against 0.030" in found


def test_only_a_run_of_the_whole_suite_counts_as_full():
    assert RunSize([], 1000).is_whole_suite()
    assert RunSize(["tests/"], 1000).is_whole_suite()
    assert not RunSize(["tests/unit"], 1000).is_whole_suite()
