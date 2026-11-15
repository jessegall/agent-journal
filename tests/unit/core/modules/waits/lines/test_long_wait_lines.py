from core.modules.waits.lines.long_wait_lines import LongWaitLines


def test_the_long_wait_lines_are_asked_at_the_minute_step():
    assert LongWaitLines.includes_steps
