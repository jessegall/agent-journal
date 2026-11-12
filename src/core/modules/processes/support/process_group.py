import os
import signal
import threading

from engine.process.leftover_process import LeftoverProcess

KILL_AFTER_SECONDS = 10


class ProcessGroup:
    """The group of processes the runner leads: the runner is its leader, so its pid is the group's number. A stop
    asks the group to end, and kills what is left of it ten seconds later. A pid whose command no longer names
    the run's folder has gone to another program and is left alone; a dead leader's group can still hold its
    children, and they are stopped."""

    @classmethod
    def stop(cls, leader_pid: int | None, process_id: int) -> None:
        if leader_pid is None or not cls.is_run(leader_pid, process_id):
            return
        try:
            os.killpg(leader_pid, signal.SIGTERM)
        except (ProcessLookupError, PermissionError):
            return
        timer = threading.Timer(KILL_AFTER_SECONDS, cls.kill_left, (leader_pid, process_id))
        timer.daemon = True
        timer.start()

    @classmethod
    def kill_left(cls, leader_pid: int, process_id: int) -> None:
        if not cls.is_run(leader_pid, process_id):
            return
        try:
            os.killpg(leader_pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            return

    @staticmethod
    def is_run(leader_pid: int, process_id: int) -> bool:
        command = LeftoverProcess.command_line(leader_pid)
        return not command or f"processes/{process_id}/" in command
