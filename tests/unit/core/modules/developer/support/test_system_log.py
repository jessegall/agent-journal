from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from core.modules.developer.support.log_file_lines import BLOCK_BYTES, LogFileLines
from core.modules.developer.support.log_filter import LogFilter
from core.modules.developer.support.system_log import SystemLog

LINE = "2026-11-06T10:00:00+00:00 a line of the log with some length to it\n"


def home_with(tmp_path: Path, server: str, rotated: str = "") -> JournalHome:
    home = JournalHome(tmp_path / ".journal")
    runtime = home.folder / "runtime"
    runtime.mkdir(parents=True)
    (runtime / "server.log").write_text(server)
    if rotated:
        (runtime / "server.log.1").write_text(rotated)
    return home


def test_the_newest_lines_read_only_a_chunk_of_a_large_log(tmp_path):
    home = home_with(tmp_path, LINE * 400_000)
    reader = LogFileLines(home.folder / "runtime" / "server.log")
    lines = reader.newest_first()
    first = [next(lines) for _ in range(50)]
    assert len(first) == 50 and reader.bytes_read == BLOCK_BYTES


def test_an_older_page_reaches_the_rotated_file_and_the_first_does_not(tmp_path):
    newer = "".join(f"2026-11-06T10:00:{second:02d}+00:00 newer {second}\n" for second in range(20))
    older = "".join(f"2026-11-05T10:00:{second:02d}+00:00 older {second}\n" for second in range(20))
    log = SystemLog(home_with(tmp_path, newer, older))
    first = log.page(LogFilter((), ()), 1, 10)
    assert first.rows[0].text.endswith("newer 19") and not first.is_last
    third = log.page(LogFilter((), ()), 3, 10)
    assert third.rows[0].text.endswith("older 19")


def test_a_written_line_shows_its_own_level_source_and_message(tmp_path):
    text = "2026-11-06T10:00:00+00:00 error journal the journal failed\n"
    row = SystemLog(home_with(tmp_path, text)).page(LogFilter((), ()), 1, 10).rows[0]
    assert (row.source, row.level, row.text) == (LogSource.JOURNAL, LogLevel.ERROR, "the journal failed")


def test_raw_output_is_a_server_warning_at_the_time_of_the_line_above_it(tmp_path):
    text = "2026-11-06T10:00:00+00:00 info server started\nTraceback line\n"
    rows = SystemLog(home_with(tmp_path, text)).page(LogFilter((), ()), 1, 10).rows
    assert [row.text for row in rows] == ["Traceback line", "started"]
    assert (rows[0].source, rows[0].level) == (LogSource.SERVER, LogLevel.WARNING)
    assert rows[0].recorded_at == rows[1].recorded_at
