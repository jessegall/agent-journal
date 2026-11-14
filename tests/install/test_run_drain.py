import os
import subprocess
import threading
from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from install.update.run_drain import RunDrain
from engine.serving.server_files import ServerFiles
from engine.time.polled_wait import PolledWait


def active_run(home: Path, name: str, pid: int) -> Path:
    run = home / "processes" / name
    run.mkdir(parents=True)
    (run / "pid").write_text(str(pid))
    (run / "1.started").write_text("")
    return run


def test_a_change_waits_for_a_going_run_and_makes_new_runs_wait_on_the_lock(tmp_path):
    run = active_run(tmp_path, "7", os.getpid())
    drain = RunDrain(JournalHome(tmp_path), limit_seconds=10, poll_seconds=0.01)
    waiter = threading.Thread(target=drain.drain)
    waiter.start()
    assert PolledWait(5, 0.01).poll((tmp_path / "run-lock").exists)
    assert waiter.is_alive()
    (run / "end").write_text("0")
    waiter.join(timeout=5)
    assert not waiter.is_alive()


def test_a_run_waiting_on_the_lock_or_gone_or_ended_does_not_count(tmp_path):
    waiting = tmp_path / "processes" / "1"
    waiting.mkdir(parents=True)
    (waiting / "pid").write_text(str(os.getpid()))
    (waiting / "1.out").write_text("")
    ended_process = subprocess.Popen(["true"])
    ended_process.wait()
    active_run(tmp_path, "2", ended_process.pid)
    ended = active_run(tmp_path, "3", os.getpid())
    (ended / "end").write_text("0")
    assert RunDrain(JournalHome(tmp_path)).running_folders() == ()


def test_the_run_that_started_the_change_does_not_wait_on_itself(tmp_path, monkeypatch):
    active_run(tmp_path, "7", os.getpid())
    monkeypatch.setenv("JOURNAL_PROCESS", "7")
    assert RunDrain(JournalHome(tmp_path)).running_folders() == ()


def test_past_the_limit_the_change_goes_ahead(tmp_path):
    active_run(tmp_path, "7", os.getpid())
    RunDrain(JournalHome(tmp_path), limit_seconds=0.05, poll_seconds=0.01).drain()


def test_the_run_queue_is_held_while_a_change_waits_for_a_going_run_and_free_after_it(tmp_path):
    home = JournalHome(tmp_path)
    run = active_run(tmp_path, "7", os.getpid())
    waiter = threading.Thread(target=RunDrain(home, limit_seconds=10, poll_seconds=0.01).drain)
    waiter.start()
    assert PolledWait(5, 0.01).poll(lambda: RunQueueHalt(home).halt_type == "update")
    assert RunQueueHalt(home).running_run_ids() == tuple([7])
    (run / "end").write_text("0")
    waiter.join(timeout=5)
    ServerFiles(home).clear_run_lock()
    assert not RunQueueHalt(home).is_halted


def test_a_lock_a_dead_change_left_is_cleared_at_boot_and_one_of_a_live_change_stays(tmp_path):
    ended_process = subprocess.Popen(["true"])
    ended_process.wait()
    files = ServerFiles(JournalHome(tmp_path))
    (tmp_path / "run-lock").write_text(str(ended_process.pid))
    files.clear_dead_run_lock()
    assert not (tmp_path / "run-lock").exists()
    (tmp_path / "run-lock").write_text(str(os.getpid()))
    files.clear_dead_run_lock()
    assert (tmp_path / "run-lock").exists()


def test_a_real_server_clears_the_wait_a_dead_update_left_and_keeps_one_a_live_update_holds(journal):
    ended_process = subprocess.Popen(["true"])
    ended_process.wait()
    journal.home.run_lock.write_text(str(ended_process.pid))
    journal.start_server()
    journal.wait_healthy()
    assert not journal.home.run_lock.exists()
    journal.home.run_lock.write_text(str(os.getpid()))
    ServerFiles(journal.home).clear_dead_run_lock()
    assert journal.home.run_lock.exists()
