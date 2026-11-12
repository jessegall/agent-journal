from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.scope.environment_scope import EnvironmentScope
from suites.coding.modules.workers.commands.remove_project_worktree.remove_project_worktree import RemoveProjectWorktree
from suites.coding.modules.workers.support.project_worktrees import ProjectWorktrees
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class RemoveProjectWorktreeHandler(Handler[RemoveProjectWorktree, str]):
    """Removes the folder for a user, keeping its branch; the main checkout, a worker's worktree and one an
    agent runs in stay, and git refuses one with changes."""

    runs_once = True
    command = RemoveProjectWorktree
    disabled_scopes = [EnvironmentScope]

    def __init__(self, worktrees: ProjectWorktrees, git: WorktreeGit, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.worktrees, self.git = worktrees, git

    def handle(self, command: RemoveProjectWorktree, context: Context) -> str:
        worktree = next((row for row in self.worktrees.listed(context.environment_id) if row.folder == command.folder), None)
        if worktree is None:
            raise Refusal(f"no worktree at {command.folder}", "journal project-worktree list shows the worktrees")
        if worktree.is_checkout:
            raise Refusal(f"{command.folder} is the main checkout", "only a linked worktree is removed")
        if worktree.worker_id is not None:
            raise Refusal(f"{AgentLabel.from_row_id(worktree.worker_id, self.numbers, "worker").text} is out on {command.folder}", "merge or release the worker first")
        if worktree.agent_count:
            raise Refusal(f"an agent is running in {command.folder}", "end the agent first")
        self.git.remove_folder(self.worktrees.folder(context.environment_id), command.folder)
        return command.folder
