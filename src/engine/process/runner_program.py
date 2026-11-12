import os
import signal
import subprocess
import threading

from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.execution import Execution
from engine.process.placed_run import PlacedRun
from engine.process.run_placement import RunPlacement


class RunnerProgram:
    """Runs an admitted program to its end. A quick run still going at its limit is not stopped: it moves to the
    background on its row and the caller waits on for its result; any other run fails naming its command when it
    passes its limit. A run whose request reads its lines hands each on as it is printed."""

    def run(self, placed: PlacedRun, placement: RunPlacement) -> Execution:
        request = placed.request
        if request.on_line is not None:
            return self.streamed(placed)
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.PIPE if request.stdin is not None else subprocess.DEVNULL,
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=None if request.variables is None else dict(request.variables))
        try:
            stdout, stderr = child.communicate(request.stdin, timeout=request.limit_seconds)
        except subprocess.TimeoutExpired as error:
            if not request.kind.is_quick:
                child.kill()
                child.communicate()
                raise RunTimeLimitError.passed(request.text, request.limit_seconds) from error
            placement.moved_to_background(placed, child.pid)
            stdout, stderr = child.communicate()
        return Execution(placed.process_id, child.returncode, stdout, stderr)

    def streamed(self, placed: PlacedRun) -> Execution:
        request = placed.request
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                                 errors="replace", start_new_session=True, env=None if request.variables is None else dict(request.variables))
        expired = threading.Event()
        limit = threading.Timer(request.limit_seconds, self.stop_group, [child, expired])
        limit.start()
        lines: list[str] = []
        try:
            for line in child.stdout or ():
                lines.append(line)
                if request.on_line is not None:
                    request.on_line(line)
            child.wait()
        finally:
            limit.cancel()
        if expired.is_set():
            raise RunTimeLimitError.passed(request.text, request.limit_seconds)
        return Execution(placed.process_id, child.returncode, "".join(lines), "")

    @staticmethod
    def stop_group(child: "subprocess.Popen[str]", expired: threading.Event) -> None:
        expired.set()
        os.killpg(child.pid, signal.SIGKILL)
