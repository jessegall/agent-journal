import os
import subprocess
from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.process.execution_request import ExecutionRequest
from engine.process.process_executor import ProcessExecutor

LIMIT_SECONDS = 30


class ToolStart:
    def __init__(self, executor: ProcessExecutor) -> None:
        self.executor = executor

    def version(self) -> str:
        # @sin architecture_processes_program_started_outside_the_door
        return subprocess.run(["tool", "--version"], capture_output=True, text=True, timeout=LIMIT_SECONDS, check=False).stdout

    def cleaned(self) -> int:
        # @sin architecture_processes_program_started_outside_the_door
        return os.system("tool clean")

    def built(self, folder: Path) -> int:
        # @righteous architecture_processes_program_started_outside_the_door
        return self.executor.execute(ExecutionRequest(["tool", "build"], folder, ProcessKind.SHELL, LIMIT_SECONDS)).exit_code
