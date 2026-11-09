from dataclasses import dataclass

from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class WorkerTestRun:
    """A worker's named test that was started, and whether the worker piped its answer into another program."""

    process: Process
    piped: bool
