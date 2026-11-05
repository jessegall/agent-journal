from core.base.file_access import FileAccess
from core.base.file_version import FileVersion
from functools import lru_cache
from pathlib import Path
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.base.registry.registry import Registry
from core.base.registry.skill_entry import SkillEntry
from core.base.skill.skill_declaration import SKILL_FILE
from core.base.skill.skill_digest import SkillDigest

FRONT_MATTER_MARK = "---"
PLUGIN_KEY = "plugin"


class SkillCatalogue:
    """Lists declared skills and published plugin skills; a file a publish removes while it is listed is no skill."""

    def __init__(self, registry: Registry, home: JournalHome, providers: Providers) -> None:
        self.registry, self.home, self.providers = registry, home, providers

    def skills(self) -> tuple[SkillEntry, ...]:
        return (*self.registry.skills, *self.plugin_skills())

    def plugin_skills(self) -> list[SkillEntry]:
        entries: list[SkillEntry] = []
        paths = {path.parent.name: path for program_folder in reversed(self.providers.skill_folders()) for path in (self.home.project_folder / program_folder).glob(f"*/{SKILL_FILE}")}
        for path in [paths[name] for name in sorted(paths)]:
            try:
                entries.extend(self.loaded_skill(path, FileAccess.shared().version(path)))
            except FileNotFoundError:
                continue
        return entries

    @staticmethod
    @lru_cache(maxsize=256)
    def loaded_skill(path: Path, version: FileVersion) -> tuple[SkillEntry, ...]:
        text = FileAccess.shared().read(path)
        fields = SkillCatalogue.front_matter(text)
        if PLUGIN_KEY not in fields:
            return ()
        return (SkillEntry(path.parent.name, f"plugin:{fields[PLUGIN_KEY]}", fields["description"] if "description" in fields else "", (), (), (),
                           SkillDigest.digest(text), str(path), False),)

    @staticmethod
    def front_matter(text: str) -> dict[str, str]:
        lines = text.splitlines()
        if not lines or lines[0].strip() != FRONT_MATTER_MARK:
            return {}
        fields: dict[str, str] = {}
        for line in lines[1:]:
            if line.strip() == FRONT_MATTER_MARK:
                break
            key, colon, value = line.partition(":")
            if colon:
                fields[key.strip()] = value.strip()
        return fields
