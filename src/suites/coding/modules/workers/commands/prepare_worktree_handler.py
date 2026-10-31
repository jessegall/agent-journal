from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.support.library_folders import LibraryFolders
from suites.coding.modules.workers.commands.support.worktree_commands import WorktreeCommands
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS, WORKTREE_COMMANDS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class PrepareWorktreeHandler(Handler[PrepareWorktree, None]):
    """Places the source environment's library folders in a launch worktree and runs its worktree commands there."""

    command = PrepareWorktree

    def __init__(self, queries: Queries, settings: SettingValues, git: WorktreeGit, libraries: LibraryFolders, commands: WorktreeCommands) -> None:
        self.queries, self.settings, self.git, self.libraries, self.commands = queries, settings, git, libraries, commands

    def handle(self, command: PrepareWorktree, context: Context) -> None:
        sources = self.queries.query(Environment).filter(folder=command.source).page(1, 1).rows
        if not sources:
            raise Refusal(f"no environment has the folder {command.source}", "name the folder of the project's environment")
        links = self.settings.texts(LIBRARY_LINKS, sources[0].id)
        copies = self.settings.texts(LIBRARY_COPIES, sources[0].id)
        self.libraries.check(command.source, (*links, *copies))
        self.libraries.place(command.source, command.folder, links, copies)
        self.commands.run(command.folder, self.git.head(command.folder), self.settings.texts(WORKTREE_COMMANDS, sources[0].id), (*links, *copies))
