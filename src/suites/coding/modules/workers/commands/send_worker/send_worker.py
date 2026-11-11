from dataclasses import dataclass

from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry

from engine.command.command import Command
from core.modules.tasks.support.tasks_changed_together import TasksChangedTogether
from core.modules.drivers.models.agent_line import AgentLine


@dataclass(frozen=True)
class SendWorker(Command[AgentLine], TasksChangedTogether):
    worker_id: int
    job: str = ""
    task_ids: tuple[int, ...] = ()
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
    sandboxed: bool = True
    test_commands: tuple[WorkerTestCommandEntry, ...] = ()
    plan_id: int | None = None
    phase_id: int | None = None
