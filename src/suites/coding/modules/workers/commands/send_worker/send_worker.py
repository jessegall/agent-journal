from dataclasses import dataclass

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
    plan_id: int | None = None
