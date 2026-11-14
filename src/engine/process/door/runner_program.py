from engine.process.child_process import ChildProcess
import subprocess
import threading

from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution import Execution
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_group import RunGroup


class RunnerProgram:
    """Runs an admitted program to its end in a process group of its own. Any run past its limit, a quick one
    too, is stopped with its whole group and fails naming its command. A run whose request reads its lines
    hands each on as it is printed."""

    def run(self, placed: PlacedRun) -> Execution:
        request = placed.request
        if request.line_callback is not None:
            return self.streamed(placed)
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.PIPE if request.stdin is not None else subprocess.DEVNULL,
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, errors="replace", start_new_session=True,
                                 env=None if request.variables is None else dict(request.variables))
        try:
            stdout, stderr = ChildProcess(child).communicate(request.stdin, request.limit_seconds)
        except subprocess.TimeoutExpired as error:
            self.stop_group(child)
            raise RunTimeLimitError.passed(request.text, request.limit_seconds) from error
        return Execution(placed.process_id, child.returncode, stdout, stderr)

    def streamed(self, placed: PlacedRun) -> Execution:
        request = placed.request
        child = subprocess.Popen(list(request.line), cwd=request.folder, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                                 errors="replace", start_new_session=True, env=None if request.variables is None else dict(request.variables))
        group = RunGroup(child)
        limit = threading.Timer(request.limit_seconds, group.expire)
        limit.start()
        lines: list[str] = []
        try:
            for line in child.stdout or ():
                lines.append(line)
                if request.line_callback is not None:
                    request.line_callback(line)
            ChildProcess(child).wait()
        except BaseException:
            group.stop()
            raise
        finally:
            limit.cancel()
            group.finish()
        if group.expired:
            raise RunTimeLimitError.passed(request.text, request.limit_seconds)
        return Execution.output_result(placed.process_id, child.returncode, "".join(lines))

    @staticmethod
    def stop_group(child: "subprocess.Popen[str]") -> None:
        RunGroup(child).stop()
