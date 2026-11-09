from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class WorkerTestCommand(Model):
    """A test command a worker may run, under the name the main agent gave it at dispatch."""

    model_name = "worker_test_command"
    cli_name = "worker-test-command"

    worker_id: int
    name: str
    command: str
