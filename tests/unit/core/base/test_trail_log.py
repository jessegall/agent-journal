import json

from core.base.trail_log import TrailLog


def test_each_write_appends_one_json_line(tmp_path):
    log = TrailLog(tmp_path / "runtime" / "trail.log")
    log.write({"route": "/cli", "line": "task start", "status": 200, "exit_code": 0, "code_version": "a41c9e0f12ab", "trail": "go_start=1"})
    log.write({"route": "/health", "line": "", "status": 200, "exit_code": None, "code_version": "a41c9e0f12ab", "trail": "server_accepted=2"})
    lines = log.path.read_text().splitlines()
    assert [json.loads(line)["route"] for line in lines] == ["/cli", "/health"]
    assert json.loads(lines[0]) == {"route": "/cli", "line": "task start", "status": 200, "exit_code": 0, "code_version": "a41c9e0f12ab", "trail": "go_start=1"}
