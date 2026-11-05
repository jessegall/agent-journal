from functools import cached_property, lru_cache
from dataclasses import dataclass
from pathlib import Path

from core.base.file_access import FileAccess
from core.base.file_version import FileVersion
from core.base.skill.skill_digest import SkillDigest


@dataclass(frozen=True)
class SkillContents:
    """Skill text and its digest, read once per file version."""

    text: str

    @cached_property
    def digest(self) -> str:
        return SkillDigest.digest(self.text)

    @classmethod
    def read(cls, path: Path) -> "SkillContents":
        path = path.resolve()
        return cls.loaded(path, FileAccess.shared().version(path))

    @staticmethod
    @lru_cache(maxsize=1024)
    def loaded(path: Path, version: FileVersion) -> "SkillContents":
        return SkillContents(FileAccess.shared().read(path))
