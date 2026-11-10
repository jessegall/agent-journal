from engine.time.clock import Clock
from core.base.error_log import ErrorLog
from core.base.exception_sink import ExceptionSink
from engine.journal.journal_home import JournalHome
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from core.base.system_log_writer import SystemLogWriter

LINE_LENGTH = 90


def test_an_exception_is_written_with_its_traceback_and_named_in_one_line(tmp_path):
    log = ErrorLog(SystemLogWriter(JournalHome(tmp_path), Clock()), ExceptionSink())
    try:
        {}["missing"]
    except KeyError as error:
        line = log.reported(["task", "start", "12"], error)
    log_text = JournalHome(tmp_path).system_log.read_text()
    assert " error journal journal task start 12\n" in log_text
    assert "Traceback" in log_text and "KeyError" in log_text
    assert line.startswith("the journal failed: KeyError") and str(tmp_path) in line


def test_each_line_of_a_write_holds_its_time_level_and_source(tmp_path):
    SystemLogWriter(JournalHome(tmp_path), Clock()).write(LogLevel.WARNING, "first\nsecond", LogSource.SERVER)
    lines = JournalHome(tmp_path).system_log.read_text().splitlines()
    assert [line.split(" ", 1)[1] for line in lines] == ["warning server first", "warning server second"]
    assert JournalHome(tmp_path).system_log.stat().st_mode & 0o777 == 0o600


def test_the_log_stays_near_its_limit_and_keeps_the_newest_lines(tmp_path):
    log = SystemLogWriter(JournalHome(tmp_path), Clock(), limit_bytes=2000)
    for number in range(100):
        log.write(LogLevel.INFORMATION, f"line {number} " + "x" * 50)
    path = JournalHome(tmp_path).system_log
    assert path.stat().st_size <= 2000 + LINE_LENGTH
    assert "line 99 " in path.read_text() and "line 0 " not in path.read_text()
    assert "line 98 " in path.read_text() or "line 98 " in path.with_name("server.log.1").read_text()
    assert len(list(path.parent.glob("server.log*"))) == 2


def test_a_reported_error_after_a_rotation_is_in_the_log_the_line_names(tmp_path):
    system_log = SystemLogWriter(JournalHome(tmp_path), Clock(), limit_bytes=2000)
    for number in range(40):
        system_log.write(LogLevel.INFORMATION, f"line {number} " + "x" * 50)
    line = ErrorLog(system_log, ExceptionSink()).reported(["task", "list"], ValueError("late"))
    assert str(JournalHome(tmp_path).system_log) in line
    assert "ValueError: late" in JournalHome(tmp_path).system_log.read_text()
