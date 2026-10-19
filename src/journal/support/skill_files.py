import hashlib
from pathlib import Path

from journal.config import Config
from journal.features.registry import Registry
from journal.support.skill import Skill

HOMES = (".claude/skills", ".agents/skills")


class SkillFiles:
    """Writes every feature's skill into the agents' skill folders, and knows each file's hash so a changed skill counts as not loaded."""

    def __init__(self, config: Config, registry: Registry) -> None:
        self.config, self.registry = config, registry

    def write_all(self) -> list[Path]:
        written = []
        for skill in self.registry.skills():
            for home in HOMES:
                path = self.path(skill, home)
                path.parent.mkdir(parents=True, exist_ok=True)
                if not path.is_file() or path.read_text() != skill.text():
                    path.write_text(skill.text())
                written.append(path)
        return written

    def path(self, skill: Skill, home: str = HOMES[0]) -> Path:
        return self.config.root / home / skill.folder / "SKILL.md"

    def hash_of(self, skill: Skill) -> str:
        return hashlib.sha1(skill.text().encode()).hexdigest()[:12]

    def skill_in_folder(self, folder: str) -> Skill | None:
        return next((skill for skill in self.registry.skills() if skill.folder == folder), None)

    def skill_read(self, path: str) -> Skill | None:
        """The skill a read of this path loads, if it is one of ours; a relative path is the project's."""
        for skill in self.registry.skills():
            if any((self.config.root / path).resolve() == self.path(skill, home).resolve() for home in HOMES):
                return skill
        return None
