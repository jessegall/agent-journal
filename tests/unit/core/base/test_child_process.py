import os
import subprocess
import select

from core.base.child_process import ChildProcess

LIMIT_SECONDS = 5
EXITING_LEADER_SCRIPT = "python3 -c 'import signal; signal.pause()' & echo $!"
SIGNAL_IGNORING_CHILD_SCRIPT = """(trap "" TERM; exec python3 -c 'import signal; signal.pause()') & echo $!; wait"""


def group_leader(line: str) -> tuple[ChildProcess, int]:
    process = subprocess.Popen(["sh", "-c", line], stdout=subprocess.PIPE, text=True, start_new_session=True)
    child_pid = int(process.stdout.readline())
    return ChildProcess(process), child_pid


def has_exited(child: ChildProcess) -> bool:
    pipe = child.process.stdout
    ready, _, _ = select.select([pipe], [], [], LIMIT_SECONDS)
    return bool(ready) and os.read(pipe.fileno(), 1) == b""


def test_the_children_of_a_leader_that_ended_die_with_the_group():
    child, child_pid = group_leader(EXITING_LEADER_SCRIPT)
    child.process.wait(LIMIT_SECONDS)
    child.stop_group(LIMIT_SECONDS)
    assert has_exited(child)
    child.process.stdout.close()


def test_a_child_that_ignores_the_first_signal_dies_with_the_group():
    child, child_pid = group_leader(SIGNAL_IGNORING_CHILD_SCRIPT)
    child.stop_group(LIMIT_SECONDS)
    assert has_exited(child)
    child.process.stdout.close()
