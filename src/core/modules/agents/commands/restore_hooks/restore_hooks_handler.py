from engine.command.context import Context
from engine.command.handler import Handler
from engine.journal.journal_home import JournalHome
from core.base.provider.hook_manager import HookManager
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.agents.commands.restore_hooks.restore_hooks import RestoreHooks


class RestoreHooksHandler(Handler[RestoreHooks, int]):
    """Returns managed hooks to the project's native configuration files."""

    command = RestoreHooks

    def __init__(self, home: JournalHome, managed: ManagedHooks) -> None:
        self.home, self.managed = home, managed

    def handle(self, command: RestoreHooks, context: Context) -> int:
        return len(HookManager(self.home.project_folder, self.managed).restore())
