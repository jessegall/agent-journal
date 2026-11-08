from functools import cached_property, lru_cache
from dataclasses import dataclass
from pathlib import Path

from core.base.file_access import FileAccess
from core.base.file_version import FileVersion
from core.base.skill.skill_digest import SkillDigest

FRONT_MATTER_MARK = "---"


@dataclass(frozen=True)
class SkillContents:
    """Skill text and its digest, read once per file version, and the text below its front matter, which is what
    an agent program puts into the context."""

    text: str

    @cached_property
    def digest(self) -> str:
        return SkillDigest.digest(self.text)

    @cached_property
    def body(self) -> str:
        lines = self.text.split("\n")
        if not lines or lines[0].strip() != FRONT_MATTER_MARK:
            return self.text.strip()
        end = next((number for number, line in enumerate(lines[1:], 1) if line.strip() == FRONT_MATTER_MARK), 0)
        return "\n".join(lines[end + 1:]).strip()

    @classmethod
    def read(cls, path: Path) -> "SkillContents":
        path = path.resolve()
        return cls.loaded(path, FileAccess.shared().version(path))

    @staticmethod
    @lru_cache(maxsize=1024)
    def loaded(path: Path, version: FileVersion) -> "SkillContents":
        return SkillContents(FileAccess.shared().read(path))
