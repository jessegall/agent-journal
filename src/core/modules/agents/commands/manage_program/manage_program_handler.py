from pathlib import Path

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.driver_rule import DriverRule
from engine.journal.journal_home import JournalHome
from engine.provider.hook_manager import HookManager
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.providers import Providers
from engine.provider.program_settings_sync import ProgramSettingsSync
from core.modules.agents.commands.manage_program.manage_program import ManageProgram


class ManageProgramHandler(Handler[ManageProgram, int]):
    """Imports project command hooks from the launch folder into the source project's store and writes the journal's
    own settings of the program, before the transaction opens, since it runs version control and edits files."""

    command = ManageProgram

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, sync: ProgramSettingsSync) -> None:
        self.home, self.providers, self.managed, self.sync = home, providers, managed, sync

    def prepare(self, command: ManageProgram, actor: Actor) -> None:
        provider = self.providers.provider(command.program)
        rules = [entry.path.checked_class(DriverRule) for entry in self.providers.registry.rules]
        manager = HookManager(self.home.project_folder, self.managed, rules)
        if manager.unmanaged(type(provider), Path(command.folder)):
            manager.import_hooks(type(provider), Path(command.folder))
        self.sync.prepare(command.program)

    def handle(self, command: ManageProgram, context: Context) -> int:
        return len(self.managed.all())
