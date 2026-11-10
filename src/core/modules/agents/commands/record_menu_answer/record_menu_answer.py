from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.menu_answer import MenuAnswer


@dataclass(frozen=True)
class RecordMenuAnswer(Command[MenuAnswer]):
    """Records what the launcher pressed on a menu in an agent's terminal."""

    lock = False

    agent_id: int
    question: str
    answer: str
