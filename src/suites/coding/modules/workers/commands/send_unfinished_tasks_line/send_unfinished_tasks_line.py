from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.models.agent_line import AgentLine

UNFINISHED_TASKS_SOURCE = "workers.unfinished-tasks"
WORKER_UNFINISHED_TASKS = NudgeDeclaration("workers.unfinished_tasks", NudgeType.STEERING, 'you ended with tasks left: {line}', path_fields=["line"])


@dataclass(frozen=True)
class SendUnfinishedTasksLine(Command[AgentLine]):
    """Gives a stopped worker that holds started work the line that tells it to go on, which resumes it."""

    worker_id: int
    line: str
