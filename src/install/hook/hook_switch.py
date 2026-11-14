import shutil
import subprocess
from pathlib import Path

from engine.provider.program_hooks import ProgramHooks
from install.hook.hook_writer import HookWriter
from install.backup.version_four_backup import BACKUP_FOLDER
from engine.file.file_access import FileAccess

SETTINGS_FILES = (Path(".claude") / "settings.json", Path(".claude") / "settings.local.json", Path(".codex") / "hooks.json")
SAVED_FOLDER = "hooks"
BINARY = Path(".journal") / "bin" / "journal-hook"
VERSION_FOUR_SWITCH = Path(".journal") / "hooks-on-version-4"
START_LIMIT_SECONDS = 10


class HookSwitch:
    """Copies project hook files to a backup and switches their journal entries during upgrades and restores."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.saved = root / ".journal" / BACKUP_FOLDER / SAVED_FOLDER

    def switch(self) -> list[str]:
        FileAccess.unlink(self.root / VERSION_FOUR_SWITCH, missing_ok=True)
        present = [name for name in SETTINGS_FILES if FileAccess.is_file(self.root / name)]
        if not present:
            return []
        for name in present:
            kept = self.saved / name
            if not FileAccess.exists(kept):
                FileAccess.mkdir(kept.parent, parents=True, exist_ok=True)
                FileAccess.copy(self.root / name, kept)
        runner = self.runner()
        HookWriter(self.root).write(runner)
        return [f"Claude Code and Codex start on the journal's own settings in .journal/programs, whose hooks call {runner}; the old files are in {self.saved}"]

    def restore(self) -> list[str]:
        FileAccess.mkdir((self.root / VERSION_FOUR_SWITCH).parent, parents=True, exist_ok=True)
        FileAccess.update_timestamp(self.root / VERSION_FOUR_SWITCH)
        restored = [name for name in SETTINGS_FILES if FileAccess.is_file(self.saved / name)]
        for name in SETTINGS_FILES:
            path = self.root / name
            if not FileAccess.is_file(path) and name not in restored:
                continue
            current = self.settings(path)
            hooks = ProgramHooks.partitioned(current.get("hooks")).native
            if name in restored:
                saved = ProgramHooks.partitioned(self.settings(self.saved / name).get("hooks"))
                for event, blocks in saved.journal.items():
                    hooks.setdefault(event, []).extend(blocks)
            ProgramHooks.store(path, {**current, "hooks": hooks})
        return [f"version 4's hooks are back in {', '.join(str(name) for name in restored)}"] if restored else []

    def runner(self) -> str:
        binary = self.root / BINARY
        if FileAccess.is_file(binary) and self.starts(binary):
            return f'"{binary}"'
        hook = self.root / ".journal" / "hooks" / "hook.sh"
        FileAccess.mkdir(hook.parent, parents=True, exist_ok=True)
        FileAccess.copy(Path(__file__).parent / "hook.sh", hook)
        return f'sh "{hook}"'

    def starts(self, binary: Path) -> bool:
        try:
            return subprocess.run([str(binary), "--version"], capture_output=True, timeout=START_LIMIT_SECONDS, check=False).returncode == 0
        except (OSError, subprocess.TimeoutExpired):
            return False

    def settings(self, path: Path) -> dict[str, object]:
        return ProgramHooks.read(path)
