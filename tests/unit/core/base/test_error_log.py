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
