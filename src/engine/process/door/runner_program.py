import os
import signal
import subprocess
import threading

from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution import Execution
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_placement import RunPlacement

QUICK_RUN_LONGEST_FACTOR = 10
QUICK_RUN_LONGEST_SECONDS = 600


class RunnerProgram:
    """Runs an admitted program to its end in a process group of its own. A quick run still going at its limit moves
    to the background and the caller waits on, up to ten times its limit; any run past its limit is stopped with its
    whole group and fails naming its command. A run whose request reads its lines hands each on as it is printed."""

    def run(self, placed: PlacedRun, placement: RunPlacement) -> Execution:
        request = placed.request
        if request.on_line is not None:
            return self.streamed(placed)
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.PIPE if request.stdin is not None else subprocess.DEVNULL,
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, errors="replace", start_new_session=True,
                                 env=None if request.variables is None else dict(request.variables))
        try:
            stdout, stderr = child.communicate(request.stdin, timeout=request.limit_seconds)
        except subprocess.TimeoutExpired as error:
            if not request.kind.is_quick:
                self.stop_group(child)
                raise RunTimeLimitError.passed(request.text, request.limit_seconds) from error
            placement.moved_to_background(placed, child.pid)
            stdout, stderr = self.waited_on(child, request.text, min(request.limit_seconds * QUICK_RUN_LONGEST_FACTOR, QUICK_RUN_LONGEST_SECONDS))
        return Execution(placed.process_id, child.returncode, stdout, stderr)

    def waited_on(self, child: "subprocess.Popen[str]", text: str, longest_seconds: float) -> tuple[str, str]:
        try:
            return child.communicate(timeout=longest_seconds)
        except subprocess.TimeoutExpired as error:
            self.stop_group(child)
            raise RunTimeLimitError.passed(text, longest_seconds) from error

    def streamed(self, placed: PlacedRun) -> Execution:
        request = placed.request
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                                 errors="replace", start_new_session=True, env=None if request.variables is None else dict(request.variables))
        expired = threading.Event()
        limit = threading.Timer(request.limit_seconds, self.expire, [child, expired])
        limit.start()
        lines: list[str] = []
        try:
            for line in child.stdout or ():
                lines.append(line)
                if request.on_line is not None:
                    request.on_line(line)
            child.wait()
        except BaseException:
            self.stop_group(child)
            raise
        finally:
            limit.cancel()
        if expired.is_set() and child.returncode != 0:
            raise RunTimeLimitError.passed(request.text, request.limit_seconds)
        return Execution(placed.process_id, child.returncode, "".join(lines), "")

    def expire(self, child: "subprocess.Popen[str]", expired: threading.Event) -> None:
        expired.set()
        self.stop_group(child)

    @staticmethod
    def stop_group(child: "subprocess.Popen[str]") -> None:
        try:
            os.killpg(child.pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            pass
        child.communicate()
