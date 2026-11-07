import os
import subprocess
import time

from core.base.child_process import ChildProcess

LIMIT_SECONDS = 5
POLL_SECONDS = 0.02
EXITING_LEADER_SCRIPT = "sleep 60 & echo $!"
SIGNAL_IGNORING_CHILD_SCRIPT = """(trap "" TERM; sleep 60) & echo $!; wait"""


def group_leader(line: str) -> tuple[ChildProcess, int]:
    process = subprocess.Popen(["sh", "-c", line], stdout=subprocess.PIPE, text=True, start_new_session=True)
    child_pid = int(process.stdout.readline())
    return ChildProcess(process), child_pid


def has_exited(pid: int) -> bool:
    deadline = time.monotonic() + LIMIT_SECONDS
    while time.monotonic() < deadline:
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return True
        time.sleep(POLL_SECONDS)
    return False


def test_the_children_of_a_leader_that_ended_die_with_the_group():
    child, child_pid = group_leader(EXITING_LEADER_SCRIPT)
    child.process.wait(LIMIT_SECONDS)
    child.stop_group(LIMIT_SECONDS)
    assert has_exited(child_pid)
    child.process.stdout.close()


def test_a_child_that_ignores_the_first_signal_dies_with_the_group():
    child, child_pid = group_leader(SIGNAL_IGNORING_CHILD_SCRIPT)
    child.stop_group(LIMIT_SECONDS)
    assert has_exited(child_pid)
    child.process.stdout.close()
