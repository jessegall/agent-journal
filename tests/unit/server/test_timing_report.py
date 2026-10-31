import json

from scripts.timing_report import report


def log_line(timing: str) -> str:
    return json.dumps({"request_id": "", "route": "/cli", "line": "task start", "status": 200, "exit_code": 0, "code_version": "a41c9e0f12ab", "timing": timing})


def test_each_step_and_the_whole_request_print_their_median_90th_percentile_and_maximum():
    lines = [log_line("go_start=1000;go_sent=2000;answered=4000"), log_line("go_start=1000;go_sent=4000;answered=5000")]
    assert report(lines) == "\n".join([
        "/cli task start  (2 requests)",
        "  step                                       median ms  p90 ms  max ms",
        "  go_start -> go_sent                             2.00    2.80    3.00",
        "  go_sent -> answered                             1.50    1.90    2.00",
        "  whole request                                   3.50    3.90    4.00",
    ])
