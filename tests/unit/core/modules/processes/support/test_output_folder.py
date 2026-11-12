from datetime import datetime, timezone
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp
from core.modules.processes.support.output_folder import OutputFolder


def folder(tmp_path) -> OutputFolder:
    return OutputFolder(JournalHome(tmp_path / ".journal"))


def test_a_started_run_leaves_its_line_and_parts_to_be_read_back(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "make test && echo done", ["make test", "echo done"])
    assert (processes.line(4), processes.part_texts(4), processes.relative(4)) == ("make test && echo done", ["make test", "echo done"], ".journal/processes/4")


def test_the_runner_s_pid_statuses_and_end_are_read_back_and_missing_ones_are_none(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "make", ["make"])
    assert (processes.pid(4), processes.status(4, 1), processes.end(4)) == (None, None, None)
    processes.write_pid(4, 321)
    processes.write_status(4, 1, 2)
    processes.write_end(4, 2)
    assert (processes.pid(4), processes.status(4, 1), processes.end(4)) == (321, 2, 2)


def test_the_output_of_the_parts_is_counted_in_bytes_and_lines(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "a && b", ["a", "b"])
    processes.write_output(4, 1, "one\ntwo\n")
    processes.write_output(4, 2, "three")
    assert (processes.output(4, 1), processes.sizes(4)) == ("one\ntwo\n", (13, 3))


def test_the_last_lines_are_read_from_the_end_in_windows_that_grow_until_they_hold_them(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "a", ["a"])
    processes.write_output(4, 1, "".join(f"line {number} {'x' * 60}\n" for number in range(1, 1001)))
    assert [line[:9] for line in processes.last_lines(4, 3)] == ["line 998 ", "line 999 ", "line 1000"]
    assert len(processes.last_lines(4, 500)) == 500 and processes.last_lines(4, 500)[0].startswith("line 501 ")
    assert len(processes.last_lines(4, 5000)) == 1000


def test_numbered_lines_are_counted_across_the_parts_and_stop_at_the_last_wanted(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "a && b", ["a", "b"])
    processes.write_output(4, 1, "one\ntwo\n")
    processes.write_output(4, 2, "three\nfour")
    assert processes.numbered_lines(4, 2, 3) == [(2, "two"), (3, "three")]
    assert processes.numbered_lines(4, 4, 9) == [(4, "four")]


def test_a_carriage_return_breaks_a_line_as_it_does_in_the_whole_text(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "a", ["a"])
    processes.write_output(4, 1, "10%\r20%\r\ndone\n")
    assert [line for _, line in processes.numbered_lines(4, 1, 9)] == "10%\r20%\r\ndone\n".splitlines()


def test_the_heartbeat_is_the_time_of_the_last_beat_and_a_removed_folder_is_gone(tmp_path):
    processes = folder(tmp_path)
    assert processes.heartbeat(4) is None
    timestamp = Timestamp(datetime(2026, 11, 1, 9, 30, tzinfo=timezone.utc))
    processes.beat(4, timestamp)
    assert processes.heartbeat(4) == timestamp
    processes.remove(4)
    assert processes.heartbeat(4) is None and processes.line(4) == ""


def test_the_folder_the_go_runner_wrote_is_read_back():
    processes = OutputFolder(JournalHome(Path(__file__).parents[6] / "tools" / "journal-run" / "testdata" / "home"))
    assert (processes.line(4), processes.part_texts(4), processes.status(4, 1), processes.status(4, 2), processes.end(4), processes.pid(4)) == (
        "echo one && echo two", ["echo one", "echo two"], 0, 0, 0, 321)
    assert (processes.output(4, 1), processes.output(4, 2), processes.sizes(4)) == ("one\n", "two\n", (8, 2))


def test_only_the_bytes_past_an_offset_are_read_across_the_parts_and_the_readers_lines_are_appended(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "a && b", ["a", "b"])
    processes.write_output(4, 1, "one\ntwo\n")
    processes.write_output(4, 2, "three\n")
    assert (processes.total_bytes(4), processes.bytes_after(4, 0), processes.bytes_after(4, 4), processes.bytes_after(4, 8), processes.bytes_after(4, 14)) == (14, b"one\ntwo\nthree\n", b"two\nthree\n", b"three\n", b"")
    processes.append_reader_lines(4, ["1: one"])
    processes.append_reader_lines(4, ["3: three"])
    assert processes.reader_lines(4) == ["1: one", "3: three"]
    processes.replace_reader_lines(4, ["9: nine"])
    assert processes.reader_lines(4) == ["9: nine"]


def test_the_head_of_the_output_reaches_no_further_than_the_characters_asked_for_across_the_parts(tmp_path):
    processes = folder(tmp_path)
    processes.write_start(4, "make && echo", ["make", "echo"])
    processes.write_output(4, 1, "abcdef")
    processes.write_output(4, 2, "ghijkl")
    assert (processes.head_output(4, 3), processes.head_output(4, 8), processes.head_output(4, 100)) == ("abc", "abcdefgh", "abcdefghijkl")
