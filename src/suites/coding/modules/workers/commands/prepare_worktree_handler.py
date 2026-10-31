from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.environment_names import EnvironmentNames
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.support.library_folders import LibraryFolders
from suites.coding.modules.workers.commands.support.worktree_commands import WorktreeCommands
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS, WORKTREE_COMMANDS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class PrepareWorktreeHandler(Handler[PrepareWorktree, None]):
    """Places the project folder's library folders in a launch worktree and runs the named environment's worktree commands there."""

    command = PrepareWorktree

    def __init__(self, environment_names: EnvironmentNames, settings: SettingValues, git: WorktreeGit, libraries: LibraryFolders, commands: WorktreeCommands) -> None:
        self.environment_names, self.settings, self.git, self.libraries, self.commands = environment_names, settings, git, libraries, commands

    def handle(self, command: PrepareWorktree, context: Context) -> None:
        environment_id = self.environment_names.environment_id(command.environment)
        links = (*self.settings.texts(LIBRARY_LINKS, environment_id), *command.library_links)
        copies = (*self.settings.texts(LIBRARY_COPIES, environment_id), *command.library_copies)
        self.libraries.check(command.source, (*links, *copies))
        self.libraries.place(command.source, command.folder, links, copies)
        self.commands.run(command.folder, self.git.head(command.folder), self.settings.texts(WORKTREE_COMMANDS, environment_id), (*links, *copies))
