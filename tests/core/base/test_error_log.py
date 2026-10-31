from core.base.error_log import ErrorLog
from core.base.journal_home import JournalHome


def test_a_fault_is_written_with_its_traceback_and_named_in_one_line(tmp_path):
    log = ErrorLog(JournalHome(tmp_path))
    try:
        {}["missing"]
    except KeyError as error:
        line = log.reported(["task", "start", "12"], error)
    written = (tmp_path / "runtime" / "errors.log").read_text()
    assert "journal task start 12" in written
    assert "Traceback" in written and "KeyError" in written
    assert line.startswith("the journal failed: KeyError") and str(tmp_path) in line
