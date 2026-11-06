from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.developer.support.log_file_lines import CHUNK_BYTES, LogFileLines
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
    assert len(first) == 50 and reader.bytes_read == CHUNK_BYTES


def test_an_older_page_reaches_the_rotated_file_and_the_first_does_not(tmp_path):
    newer = "".join(f"2026-11-06T10:00:{second:02d}+00:00 newer {second}\n" for second in range(20))
    older = "".join(f"2026-11-05T10:00:{second:02d}+00:00 older {second}\n" for second in range(20))
    log = SystemLog(home_with(tmp_path, newer, older))
    first = log.page(LogFilter((), ()), 1, 10)
    assert first.rows[0].text.endswith("newer 19") and not first.is_last
    third = log.page(LogFilter((), ()), 3, 10)
    assert third.rows[0].text.endswith("older 19")


def test_a_line_with_no_time_takes_the_time_of_the_stamped_line_above_it(tmp_path):
    text = "2026-11-06T10:00:00+00:00 journal failed\nTraceback line\n"
    rows = SystemLog(home_with(tmp_path, text)).page(LogFilter((), ()), 1, 10).rows
    assert [row.text for row in rows] == ["Traceback line", "2026-11-06T10:00:00+00:00 journal failed"]
    assert rows[0].recorded_at == rows[1].recorded_at
