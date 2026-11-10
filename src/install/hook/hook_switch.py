import shutil
import subprocess
from pathlib import Path

from engine.provider.program_hooks import ProgramHooks
from install.hook.hook_writer import HookWriter
from install.backup.version_four_backup import BACKUP_FOLDER

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
        (self.root / VERSION_FOUR_SWITCH).unlink(missing_ok=True)
        present = [name for name in SETTINGS_FILES if (self.root / name).is_file()]
        if not present:
            return []
        for name in present:
            kept = self.saved / name
            if not kept.exists():
                kept.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(self.root / name, kept)
        runner = self.runner()
        writer = HookWriter(self.root)
        writer.write(runner, is_upgrade=True)
        return [f"the hooks of {', '.join(str(name) for name in present)} call {runner}; the old files are in {self.saved}"]

    def restore(self) -> list[str]:
        (self.root / VERSION_FOUR_SWITCH).parent.mkdir(parents=True, exist_ok=True)
        (self.root / VERSION_FOUR_SWITCH).touch()
        restored = [name for name in SETTINGS_FILES if (self.saved / name).is_file()]
        for name in SETTINGS_FILES:
            path = self.root / name
            if not path.is_file() and name not in restored:
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
        if binary.is_file() and self.starts(binary):
            return f'"{binary}"'
        hook = self.root / ".journal" / "hooks" / "hook.sh"
        hook.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(Path(__file__).parent / "hook.sh", hook)
        return f'sh "{hook}"'

    def starts(self, binary: Path) -> bool:
        try:
            return subprocess.run([str(binary), "--version"], capture_output=True, timeout=START_LIMIT_SECONDS, check=False).returncode == 0
        except (OSError, subprocess.TimeoutExpired):
            return False

    def settings(self, path: Path) -> dict[str, object]:
        return ProgramHooks.read(path)
