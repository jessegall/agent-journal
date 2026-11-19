import hashlib
import shutil
from pathlib import Path

from journal.config import Config
from journal.features.registry import Registry
from journal.features.skills.support.plugin_skill import PluginSkill
from journal.support.skill import Skill
from journal.support.tool_call import ToolCall

HOMES = (".claude/skills", ".agents/skills")
SKILL_FILE = "SKILL.md"
JOURNAL_SKILL_PREFIX = "journal"
PLUGIN_STAMP = "\nplugin: "


def ready_folder(folder: Path) -> None:
    """Makes a skill folder, first taking away a link in its place that leads to no folder: a dead link, or one to itself.

    On the hosted journal (19 Nov) a tool had left skills/<name> -> /data/project/.claude/skills/<name> with .claude/skills a
    link to ../skills, so the link pointed at itself; mkdir then failed and `journal setup` stopped every start."""
    if folder.is_symlink() and not folder.is_dir():
        folder.unlink()
    folder.mkdir(parents=True, exist_ok=True)


class SkillFiles:
    """Writes every feature's skill into the agents' skill folders, knows the skills the plugins published there beside them, and each file's hash so a changed skill counts as not loaded."""

    def __init__(self, config: Config, registry: Registry) -> None:
        self.config, self.registry = config, registry

    def write_all(self) -> list[Path]:
        self.clear()
        saved = []
        for skill in self.registry.skills():
            for home in HOMES:
                path = self.path(skill, home)
                ready_folder(path.parent)
                if not path.is_file() or path.read_text() != skill.text():
                    path.write_text(skill.text())
                saved.append(path)
        return saved

    def clear(self) -> None:
        for home in HOMES:
            for folder in (self.config.root / home).glob(f"{JOURNAL_SKILL_PREFIX}*"):
                if not self.is_journals(folder):
                    continue
                if folder.is_symlink():
                    folder.unlink()
                    continue
                shutil.rmtree(folder)

    @staticmethod
    def is_journals(folder: Path) -> bool:
        if folder.name != JOURNAL_SKILL_PREFIX and not folder.name.startswith(f"{JOURNAL_SKILL_PREFIX}-"):
            return False
        skill = folder / SKILL_FILE
        return not skill.is_file() or PLUGIN_STAMP not in skill.read_text().split("\n---\n")[0]

    def path(self, skill: Skill, home: str = HOMES[0]) -> Path:
        return self.config.root / self.relative_path(skill, home)

    @staticmethod
    def relative_path(skill: Skill, home: str = HOMES[0]) -> str:
        return f"{home}/{skill.folder}/{SKILL_FILE}"

    def digest(self, skill: Skill) -> str:
        return hashlib.sha1(skill.text().encode()).hexdigest()[:12]

    def catalogue(self) -> list[Skill]:
        return [*self.registry.skills(), *self.published()]

    def published(self) -> list[PluginSkill]:
        texts = {path.parent.name: path.read_text() for path in sorted((self.config.root / HOMES[0]).glob(f"*/{SKILL_FILE}"))}
        return [self.plugin_skill(name, text) for name, text in texts.items() if text.startswith(f"---{PLUGIN_STAMP}")]

    @staticmethod
    def plugin_skill(name: str, text: str) -> PluginSkill:
        front, _, body = text.removeprefix("---\n").partition("\n---\n")
        keys = dict(line.split(": ", 1) for line in front.splitlines() if ": " in line)
        return PluginSkill(name, keys.get("description", ""), body.strip(), plugin=keys["plugin"], published=text)

    def folder_skill(self, folder: str) -> Skill | None:
        return next((skill for skill in self.catalogue() if skill.folder == folder), None)

    def loaded_skills(self, call: ToolCall) -> list[Skill]:
        skills = [self.skill_read(path) for path in call.read_paths] + [self.folder_skill(call.skill_loaded)]
        return [skill for skill in skills if skill is not None]

    def other_skill_names(self, call: ToolCall) -> list[str]:
        return [name for name in call.skill_folders(HOMES, SKILL_FILE) if self.folder_skill(name) is None]

    def skill_read(self, path: str) -> Skill | None:
        read = self.config.root / path
        if read.name != SKILL_FILE:
            return None
        resolved = read.resolve()
        return next((skill for skill in self.catalogue() if any(resolved == self.path(skill, home).resolve() for home in HOMES)), None)
