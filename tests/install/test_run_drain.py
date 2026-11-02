import os
import subprocess
import threading
import time
from pathlib import Path

from core.base.journal_home import JournalHome
from install.run_drain import RunDrain


def going_run(home: Path, name: str, pid: int) -> Path:
    run = home / "processes" / name
    run.mkdir(parents=True)
    (run / "pid").write_text(str(pid))
    (run / "1.out").write_text("")
    return run


def test_a_change_waits_for_a_going_run_and_makes_new_runs_wait_on_the_lock(tmp_path):
    run = going_run(tmp_path, "7", os.getpid())
    drain = RunDrain(JournalHome(tmp_path), limit_seconds=10, poll_seconds=0.01)
    waiter = threading.Thread(target=drain.wait)
    waiter.start()
    time.sleep(0.1)
    assert waiter.is_alive() and (tmp_path / "run-lock").exists()
    (run / "end").write_text("0")
    waiter.join(timeout=5)
    assert not waiter.is_alive()


def test_a_run_waiting_on_the_lock_or_gone_or_ended_does_not_count(tmp_path):
    waiting = tmp_path / "processes" / "1"
    waiting.mkdir(parents=True)
    (waiting / "pid").write_text(str(os.getpid()))
    ended_process = subprocess.Popen(["true"])
    ended_process.wait()
    going_run(tmp_path, "2", ended_process.pid)
    ended = going_run(tmp_path, "3", os.getpid())
    (ended / "end").write_text("0")
    assert RunDrain(JournalHome(tmp_path)).running_folders() == ()


def test_the_run_that_started_the_change_does_not_wait_on_itself(tmp_path, monkeypatch):
    going_run(tmp_path, "7", os.getpid())
    monkeypatch.setenv("JOURNAL_PROCESS", "7")
    assert RunDrain(JournalHome(tmp_path)).running_folders() == ()


def test_past_the_limit_the_change_goes_ahead(tmp_path):
    going_run(tmp_path, "7", os.getpid())
    started = time.monotonic()
    RunDrain(JournalHome(tmp_path), limit_seconds=0.05, poll_seconds=0.01).wait()
    assert time.monotonic() - started < 5
