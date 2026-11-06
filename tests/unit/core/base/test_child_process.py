import os
import subprocess
import time

from core.base.child_process import ChildProcess

LIMIT_SECONDS = 5
POLL_SECONDS = 0.02
LEADER_THAT_ENDS = "sleep 60 & echo $!"
LEADER_WITH_A_STUBBORN_CHILD = """(trap "" TERM; sleep 60) & echo $!; wait"""


def group_leader(line: str) -> tuple[ChildProcess, int]:
    process = subprocess.Popen(["sh", "-c", line], stdout=subprocess.PIPE, text=True, start_new_session=True)
    child_pid = int(process.stdout.readline())
    return ChildProcess(process), child_pid


def is_gone(pid: int) -> bool:
    deadline = time.monotonic() + LIMIT_SECONDS
    while time.monotonic() < deadline:
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return True
        time.sleep(POLL_SECONDS)
    return False


def test_the_children_of_a_leader_that_ended_die_with_the_group():
    child, child_pid = group_leader(LEADER_THAT_ENDS)
    child.process.wait(LIMIT_SECONDS)
    child.stop_group(LIMIT_SECONDS)
    assert is_gone(child_pid)
    child.process.stdout.close()


def test_a_child_that_ignores_the_first_signal_dies_with_the_group():
    child, child_pid = group_leader(LEADER_WITH_A_STUBBORN_CHILD)
    child.stop_group(LIMIT_SECONDS)
    assert is_gone(child_pid)
    child.process.stdout.close()
