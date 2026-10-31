from datetime import datetime, timezone
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp
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


def test_the_heartbeat_is_the_time_of_the_last_beat_and_a_removed_folder_is_gone(tmp_path):
    processes = folder(tmp_path)
    assert processes.heartbeat(4) is None
    moment = Timestamp(datetime(2026, 11, 1, 9, 30, tzinfo=timezone.utc))
    processes.beat(4, moment)
    assert processes.heartbeat(4) == moment
    processes.remove(4)
    assert processes.heartbeat(4) is None and processes.line(4) == ""


def test_the_folder_the_go_runner_wrote_is_read_back():
    processes = OutputFolder(JournalHome(Path(__file__).parents[5] / "tools" / "journal-run" / "testdata" / "home"))
    assert (processes.line(4), processes.part_texts(4), processes.status(4, 1), processes.status(4, 2), processes.end(4), processes.pid(4)) == (
        "echo one && echo two", ["echo one", "echo two"], 0, 0, 0, 321)
    assert (processes.output(4, 1), processes.output(4, 2), processes.sizes(4)) == ("one\n", "two\n", (8, 2))
