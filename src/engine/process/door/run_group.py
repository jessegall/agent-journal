import os
import signal
import subprocess
import threading


class RunGroup:
    """The process group of one streamed run. Its time limit and its end decide under one lock, so only a group
    still running is stopped, and only then is the run counted as past its limit."""

    def __init__(self, child: "subprocess.Popen[str]") -> None:
        self.child = child
        self.lock = threading.Lock()
        self.expired = False
        self.finished = False

    def expire(self) -> None:
        with self.lock:
            if self.finished or self.child.poll() is not None:
                return
            self.expired = True
            self.kill()

    def stop(self) -> None:
        with self.lock:
            if self.child.poll() is None:
                self.kill()
        self.child.communicate()

    def finish(self) -> None:
        with self.lock:
            self.finished = True

    def kill(self) -> None:
        try:
            os.killpg(self.child.pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            pass
