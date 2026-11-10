from dataclasses import asdict

from engine.database.database import Database
from engine.container.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from core.base.registry.registry import Registry


class SkillsRoute:
    """Answers GET /api/skills: every skill the modules declare, with its description and digest."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def skills(self) -> list[dict[str, object]]:
        container = synced_container(self.home)
        try:
            return [asdict(skill) for skill in container.get(Registry).skills]
        finally:
            container.get(Database).close()
