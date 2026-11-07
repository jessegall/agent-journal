import subprocess
import sys

from core.base.leftover_process import LeftoverProcess


def test_a_leftover_that_ended_while_it_was_being_stopped_raises_nothing() -> None:
    process = subprocess.Popen([sys.executable, "-c", "pass"])
    process.wait()
    LeftoverProcess.signal(process.pid, 15)


def test_a_pid_that_runs_another_program_is_left_alone() -> None:
    process = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(5)"])
    try:
        LeftoverProcess.stop(process.pid, "no-such-program")
        assert process.poll() is None
    finally:
        process.kill()
        process.wait()
