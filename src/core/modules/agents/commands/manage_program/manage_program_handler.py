from pathlib import Path

from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.driver_rule import DriverRule
from engine.journal.journal_home import JournalHome
from core.base.provider.hook_manager import HookManager
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.providers import Providers
from core.modules.agents.commands.manage_program.manage_program import ManageProgram


class ManageProgramHandler(Handler[ManageProgram, int]):
    """Imports project command hooks from the launch folder into the source project's store, before the transaction
    opens, since it runs git and edits files."""

    command = ManageProgram

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks) -> None:
        self.home, self.providers, self.managed = home, providers, managed

    def prepare(self, command: ManageProgram, actor: Actor) -> None:
        provider = self.providers.provider(command.program)
        rules = [entry.path.checked_class(DriverRule) for entry in self.providers.registry.rules]
        manager = HookManager(self.home.project_folder, self.managed, rules)
        if manager.unmanaged(type(provider), Path(command.folder)):
            manager.import_hooks(type(provider), Path(command.folder))

    def handle(self, command: ManageProgram, context: Context) -> int:
        return len(self.managed.all())
