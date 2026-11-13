from engine.file.append_log import AppendLog
from engine.file.file_access import FileAccess


def log_in(folder) -> AppendLog:
    return AppendLog(folder / "lines.log", folder / "lines.taken", FileAccess.shared())


def test_appended_lines_are_taken_only_on_the_round_after_they_were_moved_aside(tmp_path):
    log = log_in(tmp_path)
    log.append("one")
    assert log.taken_lines() == ()
    log.move_aside()
    log.append("two")
    assert log.taken_lines() == tuple(["one"])
    log.move_aside()
    assert log.taken_lines() == tuple(["two"])


def test_a_round_writes_back_the_lines_it_did_not_finish_and_removes_the_rest(tmp_path):
    log = log_in(tmp_path)
    log.append("one")
    log.append("two")
    log.move_aside()
    log.replace_taken(tuple(["two"]))
    assert log.taken_lines() == tuple(["two"])
    log.append("three")
    log.move_aside(tuple(["two"]))
    assert log.taken_lines() == ("three", "two")
    log.move_aside()
    assert log.taken_lines() == () and not log.path.exists()
