from dataclasses import dataclass

from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry


@dataclass(frozen=True)
class ProjectManifest:
    """One package manifest found in a project: its path from the project folder, the language it names and the test
    command it gives a worker, when it names one."""

    path: str
    language: str
    test_command: WorkerTestCommandEntry | None
