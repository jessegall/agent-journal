from pathlib import Path

from core.base.provider.program_hooks import ProgramHooks
from engine.command.context import Context
from engine.command.handler import Handler
from engine.environment.environment_names import EnvironmentNames
from engine.journal.journal_home import JournalHome
from core.base.provider.hook_manager import HookManager
from core.base.driver.driver_rule import DriverRule
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.providers import Providers
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.tools.support.tools import Tools
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.commands.support.worktree_commands import WorktreeCommands
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS, WORKTREE_COMMANDS, WORKTREE_COMMANDS_NAME
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit



class PrepareWorktreeHandler(Handler[PrepareWorktree, None]):
    """Prepares a worktree's libraries, hooks and skills before running its setup commands. It saves no row, so
    its setup commands hold no write lock."""

    runs_once = True
    command = PrepareWorktree

    def __init__(self, environment_names: EnvironmentNames, settings: SettingValues, git: WorktreeGit, libraries: LibraryFolders, commands: WorktreeCommands,
                 skills: SkillFiles, home: JournalHome, managed: ManagedHooks, providers: Providers, instruction_files: WorkerInstructionFiles, tools: Tools) -> None:
        self.instruction_files, self.tools = instruction_files, tools
        self.environment_names, self.settings, self.git, self.libraries, self.commands = environment_names, settings, git, libraries, commands
        self.skills = skills
        self.home, self.managed, self.providers = home, managed, providers

    def place_program_hooks(self, command: PrepareWorktree) -> None:
        for provider in self.providers.all():
            for file in provider.worktree_hook_files:
                source = Path(command.source) / file
                if not source.is_file():
                    continue
                target = Path(command.folder) / file
                target.parent.mkdir(parents=True, exist_ok=True)
                ProgramHooks.store(target, ProgramHooks.read(source))
                provider.hooks_copied(source, target)
                self.libraries.exclude(command.folder, [str(file)])

    def handle(self, command: PrepareWorktree, context: Context) -> None:
        self.environment_names.environment_id(command.environment)
        links = (*self.settings.texts(LIBRARY_LINKS), *command.library_links)
        copies = (*self.settings.texts(LIBRARY_COPIES), *command.library_copies)
        links = (*links, *(name for name in self.git.dependency_folders(command.source) if name not in (*links, *copies) and not (Path(command.folder) / name).exists()))
        self.libraries.check(command.source, (*links, *copies))
        self.libraries.place(command.source, command.folder, links, copies)
        self.place_program_hooks(command)
        rules = [entry.path.checked_class(DriverRule) for entry in self.providers.registry.rules]
        manager = HookManager(self.home.project_folder, self.managed, rules)
        for provider in self.providers.all():
            manager.import_hooks(type(provider), Path(command.folder))
        self.libraries.exclude(command.folder, [*self.skills.place(Path(command.folder)), *self.tools.worktree_graph(command.source, command.folder)])
        self.instruction_files.write(command.folder, command.profile)
        self.commands.run(command.folder, self.git.head(command.folder), self.settings.texts(WORKTREE_COMMANDS), (*links, *copies), WORKTREE_COMMANDS_NAME)
