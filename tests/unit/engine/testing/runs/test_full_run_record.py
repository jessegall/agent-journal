from engine.testing.runs.run_size import RunSize
from engine.testing.runs.full_run_record import FullRunRecord
from engine.testing.runs.full_run_records import FullRunRecords


def test_each_full_run_adds_a_line_with_its_size_and_time(tmp_path):
    file = tmp_path / "runs.jsonl"
    FullRunRecords.add(FullRunRecord(4000, 2, 120.0), file)
    FullRunRecords.add(FullRunRecord(4010, 0, 118.0), file)
    records = FullRunRecords.read(file).records
    assert [(record.tests, record.failed, record.seconds) for record in records] == [(4000, 2, 120.0), (4010, 0, 118.0)]


def test_a_run_no_slower_per_test_than_the_ones_before_it_raises_nothing():
    assert FullRunRecords([FullRunRecord(4000, 0, 120.0), FullRunRecord(4400, 0, 140.0)]).growth() == ""


def test_a_run_slower_per_test_than_the_ones_before_it_names_both_times():
    matched = FullRunRecords([FullRunRecord(4000, 0, 120.0), FullRunRecord(4000, 0, 121.0), FullRunRecord(4000, 0, 900.0)]).growth()
    assert "0.225 seconds per test over 4000 tests" in matched
    assert "against 0.030" in matched


def test_only_a_run_of_the_whole_suite_counts_as_full():
    assert RunSize([], 1000).is_full_suite()
    assert RunSize(["tests/"], 1000).is_full_suite()
    assert not RunSize(["tests/unit"], 1000).is_full_suite()


def test_a_full_run_record_keeps_wall_and_cpu_seconds(tmp_path):
    file = tmp_path / "runs.jsonl"
    FullRunRecords.add(FullRunRecord(4000, 0, 120.0, 310.5), file)
    record = FullRunRecords.read(file).records[0]
    assert (record.seconds, record.cpu_seconds) == (120.0, 310.5)
    assert "120.0 wall seconds, 310.5 cpu seconds" in record.summary_line()


def test_an_old_record_without_cpu_seconds_still_reads(tmp_path):
    file = tmp_path / "runs.jsonl"
    file.write_text('{"tests": 4000, "failed": 1, "seconds": 120.0, "finished_at": "2026-11-01T00:00:00+00:00"}\n')
    record = FullRunRecords.read(file).records[0]
    assert (record.tests, record.seconds, record.cpu_seconds) == (4000, 120.0, 0.0)
