import shutil
from collections.abc import Sequence
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.registry.skill_entry import SkillEntry
from core.base.skill.skill_declaration import SKILL_FILE
from core.base.skill.skill_digest import SkillDigest

PROGRAM_FOLDERS = (".claude/skills", ".agents/skills")
FOLDER_PREFIX = "journal"


class SkillFiles:
    """The skill folders of the agent programs in the project: each skill's text in its own folder of each program,
    written only when it changed, and the journal's own folders no module declares any more cleared."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def path(self, program_folder: str, folder: str) -> Path:
        return self.home.project_folder / program_folder / folder / SKILL_FILE

    def write(self, skill: SkillEntry) -> bool:
        text, changed = Path(skill.path).read_text(), False
        for program_folder in PROGRAM_FOLDERS:
            target = self.path(program_folder, skill.folder)
            if target.exists() and SkillDigest.digest(target.read_text()) == SkillDigest.digest(text):
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text)
            changed = True
        return changed

    def clear(self, declared: Sequence[SkillEntry]) -> list[str]:
        names, cleared = {skill.folder for skill in declared}, []
        for program_folder in PROGRAM_FOLDERS:
            root = self.home.project_folder / program_folder
            stale = [folder for folder in root.glob(f"{FOLDER_PREFIX}*") if folder.is_dir() and folder.name not in names]
            for folder in stale:
                shutil.rmtree(folder)
                cleared.append(folder.name)
        return list(dict.fromkeys(cleared))
