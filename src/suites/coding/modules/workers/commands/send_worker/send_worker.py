from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.agent_line import AgentLine


@dataclass(frozen=True)
class SendWorker(Command[AgentLine]):
    worker_id: int
    job: str = ""
    task_ids: tuple[int, ...] = ()
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
