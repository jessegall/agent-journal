import subprocess
import sys

from engine.process.leftover_process import LeftoverProcess


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


def test_a_program_is_found_by_its_name_never_by_a_word_in_a_path(monkeypatch):
    lines = {1: "/Users/ada/.local/bin/claude --resume s-1", 2: "python3 /private/tmp/claude-501/scratchpad/relay.py", 3: "node /usr/local/bin/codex"}
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: lines[pid]))
    assert LeftoverProcess.runs_program(1, "claude")
    assert not LeftoverProcess.runs_program(2, "claude")
    assert LeftoverProcess.runs_program(3, "codex")
    assert LeftoverProcess.runs_program(2, lines[2])
