import os
import signal
import subprocess
import threading


class CheckGroup:
    """The process group of one running check. The time limit and the end of the run decide under one lock, so
    only a group still running is stopped, and only then is the check counted as late."""

    def __init__(self, running: subprocess.Popen[str]) -> None:
        self.running = running
        self.lock = threading.Lock()
        self.expired = False
        self.finished = False

    def expire(self) -> None:
        with self.lock:
            if self.finished or self.running.poll() is not None:
                return
            self.expired = True
            self.kill()

    def stop(self) -> None:
        with self.lock:
            if self.running.poll() is None:
                self.kill()
        self.running.wait()

    def finish(self) -> None:
        with self.lock:
            self.finished = True

    def kill(self) -> None:
        os.killpg(self.running.pid, signal.SIGKILL)
