from datetime import datetime, timezone

from scripts.queue_baseline import HookRun, HookWait, WaitSummary, hook_wait_summaries, locked_line_count, table, unchecked_hook_count

START = datetime(2026, 11, 13, 18, 0, tzinfo=timezone.utc)
INSIDE = datetime(2026, 11, 13, 18, 30, tzinfo=timezone.utc)
OUTSIDE = datetime(2026, 11, 13, 17, 30, tzinfo=timezone.utc)


def test_counts_locked_lines():
    log_lines = [
        "2026-11-13T17:59:59+00:00 warning server request recording failed: database is locked",
        "2026-11-13T18:00:01+00:00 warning server request recording failed: database is locked",
        "2026-11-13T18:00:02+00:00 error journal a listener failed",
        "sqlite3.OperationalError: database is locked",
        "2026-11-13T18:00:03+00:00 info journal listener took 3 ms",
    ]
    assert locked_line_count(log_lines, START) == 2


def test_hook_wait_median_and_p95():
    main_waits = [HookWait(INSIDE, "main", float(ms)) for ms in range(1, 21)]
    helper_waits = [HookWait(INSIDE, "worker", 10.0), HookWait(INSIDE, "helper", 30.0), HookWait(OUTSIDE, "worker", 9000.0)]
    viewer_waits = [HookWait(INSIDE, "viewer", 5000.0)]
    assert hook_wait_summaries(main_waits + helper_waits + viewer_waits, START) == (WaitSummary(20, 10.5, 19.0), WaitSummary(2, 20.0, 30.0))
    runs = [HookRun(INSIDE, "pre_tool_use", 2), HookRun(INSIDE, "claude pre_tool_use", 2), HookRun(INSIDE, "stop", 0), HookRun(OUTSIDE, "stop", 2)]
    assert unchecked_hook_count(runs, START) == 1


def test_empty_window_prints_zeros():
    main_waits, helper_waits = hook_wait_summaries([], START)
    printed = table(locked_line_count([], START), main_waits, helper_waits, unchecked_hook_count([], START))
    assert [row.split()[-1] for row in printed.splitlines()[1:]] == ["0", "0", "0", "0"]
    assert [row.split()[-3:] for row in printed.splitlines()[2:4]] == [["0", "0", "0"], ["0", "0", "0"]]
