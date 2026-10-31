import json
import shutil
from pathlib import Path

from core.base.type_guards import is_list, is_mapping
from core.base.upgrade.version_four_hook import VersionFourHook
from install.hook_writer import HookWriter
from install.version_four_backup import BACKUP_FOLDER

SETTINGS_FILES = (Path(".claude") / "settings.local.json", Path(".codex") / "hooks.json")
SAVED_FOLDER = "hooks"


class HookSwitch:
    """Moves the hooks of the agent programs from version 4 to version 5 when a project is upgraded, and
    back when it is restored. The settings files that exist are kept as they were in .journal/version-4/hooks,
    the entries that call version 4's hook are taken out, and version 5's hooks are written in, calling the
    fallback hook of the project; the rest of each file stays. A project with no such file is left without
    hooks. It runs inside the steps CodeReplacement holds the server lock for."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.saved = root / ".journal" / BACKUP_FOLDER / SAVED_FOLDER

    def switch(self) -> list[str]:
        present = [name for name in SETTINGS_FILES if (self.root / name).is_file()]
        if not present:
            return []
        for name in present:
            kept = self.saved / name
            if not kept.exists():
                kept.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(self.root / name, kept)
            self.write_without_version_four_hooks(self.root / name)
        hook = self.root / ".journal" / "hooks" / "hook.sh"
        hook.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(Path(__file__).parent / "hook.sh", hook)
        HookWriter(self.root).write(f'sh "{hook}"')
        return [f"the hooks of {', '.join(str(name) for name in present)} call {hook}; the old files are in {self.saved}"]

    def restore(self) -> list[str]:
        restored = [name for name in SETTINGS_FILES if (self.saved / name).is_file()]
        for name in restored:
            shutil.copy2(self.saved / name, self.root / name)
        return [f"version 4's hooks are back in {', '.join(str(name) for name in restored)}"] if restored else []

    def write_without_version_four_hooks(self, path: Path) -> None:
        settings: object = json.loads(path.read_text())
        if is_mapping(settings) and is_mapping(settings.get("hooks")):
            hooks = {event: groups for event, groups in ((event, self.kept(groups)) for event, groups in settings["hooks"].items()) if groups}
            path.write_text(json.dumps({**settings, "hooks": hooks}, indent=2))

    def kept(self, groups: object) -> list[object]:
        kept: list[object] = []
        for group in groups if is_list(groups) else []:
            entries = group.get("hooks") if is_mapping(group) else None
            if not is_list(entries):
                kept.append(group)
                continue
            remaining = [entry for entry in entries if not (is_mapping(entry) and VersionFourHook.FILE in str(entry.get("command", "")))]
            if remaining:
                kept.append({**group, "hooks": remaining})
        return kept
