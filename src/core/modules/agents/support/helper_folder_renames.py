from pathlib import Path

from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.statement import Statement
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.agents.support.agent_folders import START_FOLDERS_SUFFIX

RENUMBERS = Statement("SELECT old_id, new_id FROM agent_renumbers ORDER BY old_id", scan_reason=SCHEMA_REASON)
FOLDERS_STEP = Statement("SELECT folders_done FROM agent_renumber_summary WHERE id = 1", scan_reason=SCHEMA_REASON)
FOLDERS_STEP_SET = "UPDATE agent_renumber_summary SET folders_done = ? WHERE id = 1"
SUMMARY_EXISTS = Statement("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'agent_renumber_summary'", scan_reason=SCHEMA_REASON)
MOVED_STEP = 1
REMOVED_FOLDER = "removed-before-renumber"
RENAMED_STEP = 2


class HelperFolderRenames:
    """Renames the start folder of every renumbered helper from its old id to its new one, once, after the
    renumber is committed: each folder first goes to a passing name, then to its new id, so ids that swap never
    meet, and the step reached is stored, so a start after a power loss goes on where it ended. A folder already
    at a new id is kept beside it with the suffix -before-renumber, the folders of removed helpers move into
    removed-before-renumber, so a new agent that takes an old id starts in a new folder, and a missing folder
    is skipped and returned."""

    def __init__(self, database: Database, home: JournalHome) -> None:
        self.database = database
        self.base = home.project_folder.resolve().parent / f".{home.project_folder.resolve().name}{START_FOLDERS_SUFFIX}"

    def step(self) -> int:
        if not self.database.rows(SUMMARY_EXISTS):
            return RENAMED_STEP
        rows = self.database.rows(FOLDERS_STEP)
        return int(rows[0]["folders_done"]) if rows else RENAMED_STEP

    def passing(self, old_id: int) -> Path:
        return self.base / f"renumber-{old_id}"

    def renamed(self) -> list[int]:
        step = self.step()
        if step == RENAMED_STEP:
            return []
        pairs = [(int(row["old_id"]), int(row["new_id"])) for row in self.database.rows(RENUMBERS)]
        if step < MOVED_STEP:
            renumbered = {old_id for old_id, _ in pairs}
            for folder in list(FileAccess.iterdir(self.base)) if FileAccess.is_dir(self.base) else []:
                if folder.name.isdigit() and int(folder.name) not in renumbered:
                    FileAccess.mkdir(self.base / REMOVED_FOLDER, parents=True, exist_ok=True)
                    FileAccess.rename(folder, self.base / REMOVED_FOLDER / folder.name)
            for old_id, _ in pairs:
                if FileAccess.is_dir(self.base / str(old_id)):
                    FileAccess.rename(self.base / str(old_id), self.passing(old_id))
            self.database.update(Statement(FOLDERS_STEP_SET, [MOVED_STEP]))
        missing = []
        for old_id, new_id in pairs:
            if not FileAccess.is_dir(self.passing(old_id)):
                missing.append(old_id)
                continue
            target = self.base / str(new_id)
            if FileAccess.exists(target):
                FileAccess.rename(target, self.base / f"{new_id}-before-renumber")
            FileAccess.rename(self.passing(old_id), target)
        self.database.update(Statement(FOLDERS_STEP_SET, [RENAMED_STEP]))
        return missing
