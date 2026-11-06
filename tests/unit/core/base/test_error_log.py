from core.base.exception_sink import ExceptionSink
from core.base.error_log import ErrorLog
from core.base.journal_home import JournalHome


def test_an_exception_is_written_with_its_traceback_and_named_in_one_line(tmp_path):
    log = ErrorLog(JournalHome(tmp_path), ExceptionSink())
    try:
        {}["missing"]
    except KeyError as error:
        line = log.reported(["task", "start", "12"], error)
    log_text = (tmp_path / "runtime" / "errors.log").read_text()
    assert "journal task start 12" in log_text
    assert "Traceback" in log_text and "KeyError" in log_text
    assert line.startswith("the journal failed: KeyError") and str(tmp_path) in line


def test_the_log_stays_under_its_limit_and_keeps_the_newest_lines(tmp_path, monkeypatch):
    monkeypatch.setattr("core.base.error_log.ERROR_LOG_BYTES", 2000)
    log = ErrorLog(JournalHome(tmp_path), ExceptionSink())
    for number in range(100):
        log.noted(f"line {number} " + "x" * 50)
    path = tmp_path / "runtime" / "errors.log"
    assert path.stat().st_size <= 2000
    assert "line 99 " in path.read_text() and "line 0 " not in path.read_text()
    assert "line 98 " in path.read_text() or "line 98 " in (tmp_path / "runtime" / "errors.log.1").read_text()
    assert len(list(path.parent.glob("errors.log*"))) == 2


def test_a_reported_error_after_a_rotation_is_in_the_log_the_line_names(tmp_path, monkeypatch):
    monkeypatch.setattr("core.base.error_log.ERROR_LOG_BYTES", 2000)
    log = ErrorLog(JournalHome(tmp_path), ExceptionSink())
    for number in range(40):
        log.noted(f"line {number} " + "x" * 50)
    line = log.reported(["task", "list"], ValueError("late"))
    assert str(tmp_path / "runtime" / "errors.log") in line
    assert "ValueError: late" in (tmp_path / "runtime" / "errors.log").read_text()
