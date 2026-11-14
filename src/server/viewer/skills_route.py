from engine.database.write_turns import WriteTurns
from dataclasses import asdict

from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.registry.registry import Registry


class SkillsRoute:
    """Answers GET /api/skills: every skill the modules declare, with its description and digest."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.home, self.turns = home, turns

    def skills(self) -> list[dict[str, object]]:
        container = synced_container(self.home, self.turns)
        try:
            return [asdict(skill) for skill in container.get(Registry).skills]
        finally:
            container.get(Database).close()
