import json

from core.base.journal_home import JournalHome
from core.base.timing_log import TimingLog

FIELDS: dict[str, object] = {"route": "/cli", "line": "task start", "status": 200, "exit_code": 0, "code_version": "a41c9e0f12ab",
                             "timing": "go_start=1;go_sent=2"}


def test_each_write_appends_one_json_line_with_its_fields(tmp_path):
    log = TimingLog(JournalHome(tmp_path))
    log.write(FIELDS)
    log.write({**FIELDS, "route": "/health", "line": "", "exit_code": None})
    lines = log.path.read_text().splitlines()
    assert log.path == tmp_path / "runtime" / "timing.log"
    assert [json.loads(line) for line in lines] == [FIELDS, {**FIELDS, "route": "/health", "line": "", "exit_code": None}]


def test_a_write_past_the_limit_still_appends_to_the_same_file(tmp_path):
    log = TimingLog(JournalHome(tmp_path), limit_bytes=200)
    log.write(FIELDS)
    log.write(FIELDS)
    assert len(log.path.read_text().splitlines()) == 2
    assert not log.path.with_name("timing.log.1").exists()


def test_a_rotation_past_the_limit_moves_the_file_aside_and_one_under_it_stays(tmp_path):
    log = TimingLog(JournalHome(tmp_path), limit_bytes=200)
    log.rotate()
    log.write(FIELDS)
    log.rotate()
    assert log.path.exists() and not log.path.with_name("timing.log.1").exists()
    log.write(FIELDS)
    log.rotate()
    assert not log.path.exists() and len(log.path.with_name("timing.log.1").read_text().splitlines()) == 2
