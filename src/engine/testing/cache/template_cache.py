from engine.file.file_access import FileAccess
import os
import time
from pathlib import Path

from engine.module.python_source_folders import python_source_folders
from engine.module.schema_inputs import SchemaInputs
from engine.testing.seeds.base_seed_switch import BaseSeedSwitch
from engine.testing.cache.folder_stat import FolderStat

CACHE_FOLDER = Path.home() / ".cache" / "agent-journal" / "story-templates"
UNUSED_FOLDER_SECONDS = 24 * 3600
PRUNE_INTERVAL_SECONDS = 3600
PRUNED_STAMP = ".pruned"
LEASE_PREFIX = ".in-use-"
CACHE_LIMIT_BYTES = 3 * 1024 ** 3
HASH_CHARACTERS = 16


class TemplateCache:
    """Shares complete story templates between every checkout of a project, in a folder keyed on the schema
    inputs only (migrations, models, seeders and module manifests: see SchemaInputs), so editing any other
    code leaves the folder as it was and each template checks the code its own build ran (see TouchedCode).
    When a new folder is made it removes the ones unused for a day and then the least recently used until
    the cache is under its size limit, never one a running suite holds (each process leaves a lease named
    for its process number); a cache already pruned within the hour is left alone."""

    def __init__(self, root: Path = CACHE_FOLDER, limit_bytes: int = CACHE_LIMIT_BYTES) -> None:
        self.root, self.limit_bytes = root, limit_bytes

    def folder(self) -> Path:
        source_hash = SchemaInputs.hash(python_source_folders())
        current = self.root / f"{source_hash[:HASH_CHARACTERS]}{BaseSeedSwitch.folder_suffix()}"
        is_new = not FileAccess.is_dir(current)
        FileAccess.mkdir(current, parents=True, exist_ok=True)
        FileAccess.update_timestamp(current)
        FileAccess.update_timestamp(current / f"{LEASE_PREFIX}{os.getpid()}")
        if is_new or self.is_prune_due():
            self.drop_expired(current)
        return current

    @staticmethod
    def is_leased(folder: Path) -> bool:
        for lease in FileAccess.glob(folder, f"{LEASE_PREFIX}*"):
            try:
                os.kill(int(lease.name.removeprefix(LEASE_PREFIX)), 0)
            except (ValueError, ProcessLookupError):
                FileAccess.unlink(lease, missing_ok=True)
            except PermissionError:
                return True
            else:
                return True
        return False

    def is_prune_due(self) -> bool:
        stamp = self.root / PRUNED_STAMP
        due = not FileAccess.exists(stamp) or FolderStat.modified_time(stamp) < time.time() - PRUNE_INTERVAL_SECONDS
        if due:
            FileAccess.update_timestamp(stamp)
        return due

    def drop_expired(self, kept: Path | None = None) -> None:
        limit = time.time() - UNUSED_FOLDER_SECONDS
        for folder in FileAccess.iterdir(self.root) if FileAccess.is_dir(self.root) else ():
            is_expired = FileAccess.is_dir(folder) and folder != kept and FolderStat.modified_time(folder) < limit and not self.is_leased(folder)
            if is_expired:
                FileAccess.rmtree(folder, ignore_errors=True)
        self.drop_oldest_templates(kept)

    def drop_oldest_templates(self, kept: Path | None = None) -> None:
        sizes = {folder: FolderStat.bytes(folder) for folder in FileAccess.iterdir(self.root) if FileAccess.is_dir(folder)} if FileAccess.is_dir(self.root) else {}
        total = sum(sizes.values())
        for folder in sorted(sizes, key=FolderStat.modified_time):
            if total <= self.limit_bytes:
                break
            if folder != kept and not self.is_leased(folder):
                FileAccess.rmtree(folder, ignore_errors=True)
                total -= sizes[folder]
