from engine.file.append_log import AppendLog
from engine.file.file_access import FileAccess


def log_in(folder) -> AppendLog:
    return AppendLog(folder / "lines.log", folder / "lines.taken", FileAccess.shared())


def test_appended_lines_are_taken_only_on_the_round_after_they_were_moved_aside(tmp_path):
    log = log_in(tmp_path)
    log.append("one")
    assert log.claimed_lines() == ()
    log.archive()
    log.append("two")
    assert log.claimed_lines() == tuple(["one"])
    log.archive()
    assert log.claimed_lines() == tuple(["two"])


def test_a_round_writes_back_the_lines_it_did_not_finish_and_removes_the_rest(tmp_path):
    log = log_in(tmp_path)
    log.append("one")
    log.append("two")
    log.archive()
    log.replace_claimed(tuple(["two"]))
    assert log.claimed_lines() == tuple(["two"])
    log.append("three")
    log.archive(tuple(["two"]))
    assert log.claimed_lines() == ("three", "two")
    log.archive()
    assert log.claimed_lines() == () and not log.path.exists()
