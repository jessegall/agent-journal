from engine.skill.skill_contents import SkillContents
from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
from functools import lru_cache
from pathlib import Path
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from engine.provider.providers import Providers
from engine.registry.registry import Registry
from engine.registry.skill_entry import SkillEntry
from engine.request.request_values import RequestValues
from engine.skill.skill_declaration import SKILL_FILE
from engine.skill.skill_digest import SkillDigest
from engine.skill.skill_contents import FRONT_MATTER_MARK

PLUGIN_KEY = "plugin"
KEPT_SECONDS = 5


class SkillCatalogue:
    """Lists module skills and skills installed in the project's program folders. One request reads the
    skill files once, and again only when a program folder changes. The skills of the program folders are
    kept across requests for a few seconds, so a hook checks each skill file at most once in that time; a
    file edited in place shows after it."""

    def __init__(self, registry: Registry, home: JournalHome, providers: Providers, request_values: RequestValues, clock: Clock) -> None:
        self.registry, self.home, self.providers, self.request_values, self.clock = registry, home, providers, request_values, clock

    def skills(self) -> tuple[SkillEntry, ...]:
        return self.request_values.read("skills.catalogue", self.folder_versions, self.read_skills)

    def contains(self, folder: str) -> bool:
        return any(skill.folder == folder for skill in self.skills())

    def folder_versions(self) -> tuple[FileVersion | None, ...]:
        return tuple(self.folder_version(self.home.project_folder / program_folder) for program_folder in self.providers.skill_folders())

    @staticmethod
    def folder_version(folder: Path) -> FileVersion | None:
        try:
            return FileAccess.version(folder)
        except FileNotFoundError:
            return None

    def read_skills(self) -> tuple[SkillEntry, ...]:
        declared = {skill.folder for skill in self.registry.skills}
        return (*self.registry.skills, *(skill for skill in self.plugin_skills() if skill.folder not in declared))

    def plugin_skills(self) -> list[SkillEntry]:
        folders = tuple(self.home.project_folder / program_folder for program_folder in reversed(self.providers.skill_folders()))
        period = int(self.clock.timestamp().value.timestamp() // KEPT_SECONDS)
        return list(SkillCatalogue.kept_plugin_skills(folders, tuple(self.folder_version(folder) for folder in folders), period))

    @staticmethod
    @lru_cache(maxsize=8)
    def kept_plugin_skills(folders: tuple[Path, ...], versions: tuple[FileVersion | None, ...], period: int) -> tuple[SkillEntry, ...]:
        paths = {path.parent.name: path for folder in folders for path in SkillCatalogue.skill_files(folder)}
        entries: list[SkillEntry] = []
        for path in [paths[name] for name in sorted(paths)]:
            try:
                entries.extend(SkillCatalogue.loaded_skill(path, FileAccess.version(path)))
            except FileNotFoundError:
                continue
        return tuple(entries)

    @staticmethod
    def skill_files(folder: Path) -> tuple[Path, ...]:
        try:
            return SkillCatalogue.listed_skill_files(folder, FileAccess.version(folder))
        except FileNotFoundError:
            return ()

    @staticmethod
    @lru_cache(maxsize=16)
    def listed_skill_files(folder: Path, version: FileVersion) -> tuple[Path, ...]:
        return tuple(FileAccess.glob(folder, f"*/{SKILL_FILE}"))

    @staticmethod
    @lru_cache(maxsize=256)
    def loaded_skill(path: Path, version: FileVersion) -> tuple[SkillEntry, ...]:
        text = SkillContents.read(path).text
        fields = SkillCatalogue.front_matter(text)
        module = f"plugin:{fields[PLUGIN_KEY]}" if PLUGIN_KEY in fields else "project"
        return (SkillEntry(path.parent.name, module, fields["description"] if "description" in fields else "", (), (), (),
                           SkillDigest.digest(text), str(path), False, version.modified_at),)

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
