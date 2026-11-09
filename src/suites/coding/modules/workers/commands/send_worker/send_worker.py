from dataclasses import dataclass

from suites.coding.modules.workers.support.test_command_entry import TestCommandEntry

from core.base.command.command import Command
from core.base.tasks.tasks_changed_together import TasksChangedTogether
from core.modules.drivers.models.agent_line import AgentLine


@dataclass(frozen=True)
class SendWorker(Command[AgentLine], TasksChangedTogether):
    worker_id: int
    job: str = ""
    task_ids: tuple[int, ...] = ()
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
    sandboxed: bool = True
    test_commands: tuple[TestCommandEntry, ...] = ()
