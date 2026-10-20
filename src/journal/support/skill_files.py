import hashlib
import shutil
from pathlib import Path

from journal.config import Config
from journal.features.registry import Registry
from journal.support.skill import Skill

HOMES = (".claude/skills", ".agents/skills")
OURS = "journal"
"""The journal's skills are its own folder and every journal-* one."""
PLUGIN_STAMP = "\nplugin: "
"""A skill a plugin published says so in its front matter; such a skill is the plugin's, whatever its name."""


class SkillFiles:
    """Writes every feature's skill into the agents' skill folders, and knows each file's hash so a changed skill counts as not loaded."""

    def __init__(self, config: Config, registry: Registry) -> None:
        self.config, self.registry = config, registry

    def write_all(self) -> list[Path]:
        """Every skill of the journal's removed, then the newest written: one it no longer ships never lingers, and none is left as an old version."""
        self.clear()
        written = []
        for skill in self.registry.skills():
            for home in HOMES:
                path = self.path(skill, home)
                path.parent.mkdir(parents=True, exist_ok=True)
                if not path.is_file() or path.read_text() != skill.text():
                    path.write_text(skill.text())
                written.append(path)
        return written

    def clear(self) -> None:
        """The journal's skill folders taken out of every skills home; a skill of the project's own or a plugin's is left as it is."""
        for home in HOMES:
            for folder in (self.config.root / home).glob(f"{OURS}*"):
                if not self.is_ours(folder):
                    continue
                if folder.is_symlink():
                    folder.unlink()
                    continue
                shutil.rmtree(folder)

    @staticmethod
    def is_ours(folder: Path) -> bool:
        if folder.name != OURS and not folder.name.startswith(f"{OURS}-"):
            return False
        skill = folder / "SKILL.md"
        return not skill.is_file() or PLUGIN_STAMP not in skill.read_text().split("\n---\n")[0]

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
