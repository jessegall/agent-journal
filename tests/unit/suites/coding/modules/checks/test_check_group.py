import subprocess

from suites.coding.modules.checks.commands.support.check_group import CheckGroup


def started(command: str) -> subprocess.Popen[str]:
    return subprocess.Popen(["sh", "-c", command], stdout=subprocess.PIPE, text=True, start_new_session=True)


def test_a_group_stopped_after_its_reader_failed_is_killed_and_reaped():
    running = started("sleep 30")
    group = CheckGroup(running)
    group.stop()
    assert (running.returncode, group.expired) == (-9, False)


def test_a_group_that_ended_in_time_is_not_counted_late_when_the_limit_fires_afterwards():
    running = started("true")
    running.wait()
    group = CheckGroup(running)
    group.expire()
    assert (group.expired, running.returncode) == (False, 0)


def test_the_limit_after_the_run_finished_counts_nothing_late():
    running = started("sleep 30")
    group = CheckGroup(running)
    group.finish()
    group.expire()
    group.stop()
    assert (group.expired, running.returncode) == (False, -9)


def test_a_group_still_running_at_its_limit_is_killed_and_counted_late():
    running = started("sleep 30")
    group = CheckGroup(running)
    group.expire()
    running.wait()
    assert (group.expired, running.returncode) == (True, -9)
