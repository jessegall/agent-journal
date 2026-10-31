import json

from scripts.timing_report import bypass_timings, logged_timings, report


def log_line(timing: str) -> str:
    return json.dumps({"request_id": "", "route": "/cli", "line": "task start", "status": 200, "exit_code": 0, "code_version": "a41c9e0f12ab", "timing": timing})


def test_each_step_and_the_whole_request_print_their_median_90th_percentile_and_maximum():
    lines = [log_line("go_start=1000;go_sent=2000;answered=4000"), log_line("go_start=1000;go_sent=4000;answered=5000")]
    assert report(logged_timings(lines)) == "\n".join([
        "/cli task start  (2 requests)",
        "  step                                       median ms  p90 ms  max ms",
        "  go_start -> go_sent                             2.00    2.80    3.00",
        "  go_sent -> answered                             1.50    1.90    2.00",
        "  whole request                                   3.50    3.90    4.00",
    ])


def test_a_hook_that_gave_up_is_read_from_its_bypass_line_and_a_version_4_line_is_left_out():
    lines = ["1793395000 hook claude", "1793395000 hook claude 4321-1000 go_start=1000;go_sent=2000;go_gave_up=7000"]
    assert report(bypass_timings(lines)).splitlines()[0] == "gave up: hook claude  (1 requests)"
    assert [row.split("  ")[1].strip() for row in report(bypass_timings(lines)).splitlines()[2:]] == ["go_start -> go_sent", "go_sent -> go_gave_up", "whole request"]
