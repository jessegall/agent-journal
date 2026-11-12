from pathlib import Path

from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.provider import Provider

STATUS_LINE_KEY = "statusLine"
HOOKS_KEY = "hooks"


class ProjectHookCleanup:
    """Takes the journal's old entries and its status line out of a project's hook file of an agent program, after
    backing the file up, and keeps every other key and every entry of others."""

    def __init__(self, backup: ProgramSettingsBackup) -> None:
        self.backup = backup

    def has_journal_entries(self, provider: Provider, folder: Path) -> bool:
        settings = ProgramHooks.read(folder / provider.hook_file.path)
        return bool(ProgramHooks.partitioned(settings.get(HOOKS_KEY)).journal) or ProgramHooks.is_journals(settings.get(STATUS_LINE_KEY))

    def cleaned(self, provider: Provider, folder: Path) -> bool:
        path = folder / provider.hook_file.path
        settings = ProgramHooks.read(path)
        parts = ProgramHooks.partitioned(settings.get(HOOKS_KEY))
        has_status_line = ProgramHooks.is_journals(settings.get(STATUS_LINE_KEY))
        if not parts.journal and not has_status_line:
            return False
        self.backup.project_copied(provider.name, path)
        kept = {key: value for key, value in settings.items() if key != HOOKS_KEY and not (key == STATUS_LINE_KEY and has_status_line)}
        ProgramHooks.store(path, {**kept, HOOKS_KEY: parts.native} if parts.native else kept)
        provider.hooks_rewritten(path, settings.get(HOOKS_KEY), parts.native)
        return True
