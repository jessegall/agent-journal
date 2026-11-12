import subprocess

from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.execution import Execution
from engine.process.placed_run import PlacedRun
from engine.process.run_placement import RunPlacement


class RunnerProgram:
    """Runs an admitted program to its end. A quick run still going at its limit is not stopped: it moves to the
    background on its row and the caller waits on for its result; any other run fails naming its command when it
    passes its limit. Output that is not UTF-8 is read with each bad byte replaced, never refused."""

    def run(self, placed: PlacedRun, placement: RunPlacement) -> Execution:
        request = placed.request
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.PIPE if request.stdin is not None else subprocess.DEVNULL,
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8", errors="replace", env=None if request.variables is None else dict(request.variables))
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
