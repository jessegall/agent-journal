import json
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess
from engine.types.type_guards import is_mapping

MANAGED_SETTINGS_FILES = (Path("/Library/Application Support/ClaudeCode/managed-settings.json"), Path("/etc/claude-code/managed-settings.json"))
MANAGED_HOOKS_KEY = "allowManagedHooksOnly"


class ManagedHooks:
    """Refuses a Claude Code launch when its managed settings allow managed hooks alone: the journal's --settings
    file is no managed source (report 1459), so its hooks would not run. A missing or unreadable file passes."""

    files: tuple[Path, ...] = MANAGED_SETTINGS_FILES

    def refuse_blocked_hooks(self) -> None:
        blocking = next((file for file in self.files if self.blocks_hooks(file)), None)
        if blocking is None:
            return
        raise Refusal(f"Claude Code's managed settings in {blocking} allow only managed hooks, so the journal's hooks would not run",
                      f"set {MANAGED_HOOKS_KEY} to false in {blocking}, or ask whoever manages this machine to")

    @staticmethod
    def blocks_hooks(file: Path) -> bool:
        if not FileAccess.is_file(file):
            return False
        try:
            settings = json.loads(FileAccess.read(file))
        except (OSError, ValueError):
            return False
        return is_mapping(settings) and settings.get(MANAGED_HOOKS_KEY) is True
